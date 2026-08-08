import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Readable } from 'node:stream'
import {
  fetchDriveMediaStream,
  isValidDriveFileId,
} from './_lib/drive'
import { handleOptions, json, setCors } from './_lib/http'

function queryId(req: VercelRequest): string | null {
  const raw = req.query.id
  const id = Array.isArray(raw) ? raw[0] : raw
  if (!id || typeof id !== 'string') return null
  return id
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  const fileId = queryId(req)
  if (!fileId || !isValidDriveFileId(fileId)) {
    return json(res, 400, { error: 'Invalid or missing Drive file id' })
  }

  try {
    const rangeHeader =
      typeof req.headers.range === 'string' ? req.headers.range : undefined
    const upstream = await fetchDriveMediaStream(fileId, rangeHeader)

    setCors(res)
    res.statusCode = upstream.status === 206 ? 206 : 200

    const contentType = upstream.headers.get('content-type') || 'video/mp4'
    res.setHeader('Content-Type', contentType)
    // Never forward Drive's Content-Disposition: attachment — browsers may refuse playback.
    res.setHeader('Content-Disposition', 'inline')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.setHeader('Accept-Ranges', 'bytes')

    const contentLength = upstream.headers.get('content-length')
    if (contentLength) res.setHeader('Content-Length', contentLength)

    const contentRange = upstream.headers.get('content-range')
    if (contentRange) res.setHeader('Content-Range', contentRange)

    if (req.method === 'HEAD' || !upstream.body) {
      res.end()
      return
    }

    const nodeStream = Readable.fromWeb(
      upstream.body as import('node:stream/web').ReadableStream,
    )
    nodeStream.on('error', () => {
      if (!res.headersSent) {
        res.statusCode = 502
      }
      res.end()
    })
    nodeStream.pipe(res)
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to load Drive media'
    return json(res, 502, { error: message })
  }
}
