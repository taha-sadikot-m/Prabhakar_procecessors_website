import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import sharp from 'sharp'
import { requireAdmin } from '../../auth'
import { handleOptions, json, newId, readJsonBody } from '../../http'

const MAX_BYTES = 5.5 * 1024 * 1024
const ALLOWED_FOLDERS = new Set(['services', 'culture', 'gallery'] as const)
type UploadFolder = 'services' | 'culture' | 'gallery'
type MediaType = 'image' | 'video'

function uploadsDir(folder: UploadFolder) {
  return path.join(process.cwd(), 'public', 'uploads', folder)
}

function safeFileStem(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120) || 'image'
}

function parseFolder(raw: unknown): UploadFolder {
  const value = typeof raw === 'string' ? raw.trim() : ''
  if (!value) return 'services'
  if (ALLOWED_FOLDERS.has(value as UploadFolder)) {
    return value as UploadFolder
  }
  throw new Error('folder must be services, culture, or gallery')
}

function parseMediaType(raw: unknown, folder: UploadFolder): MediaType {
  if (raw === 'video') {
    if (folder !== 'gallery') {
      throw new Error('video uploads are only allowed for gallery')
    }
    return 'video'
  }
  return 'image'
}

function parseDataUrl(dataUrl: string): { mime: string; buf: Buffer } {
  const match = /^data:([^;]+);base64,(.+)$/s.exec(dataUrl.trim())
  if (!match) {
    throw new Error('Expected a base64 data URL')
  }
  const mime = match[1].toLowerCase()
  const buf = Buffer.from(match[2], 'base64')
  if (!buf.length) throw new Error('Empty media data')
  if (buf.length > MAX_BYTES) {
    throw new Error('File too large (max ~5.5MB)')
  }
  return { mime, buf }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (!(await requireAdmin(req))) {
    return json(res, 401, { error: 'Unauthorized' })
  }
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    const body = readJsonBody<{
      dataUrl?: string
      id?: string
      folder?: string
      mediaType?: string
    }>(req)
    const dataUrl = (body.dataUrl ?? '').trim()
    if (!dataUrl) return json(res, 400, { error: 'dataUrl required' })

    const folder = parseFolder(body.folder)
    const mediaType = parseMediaType(body.mediaType, folder)
    const { mime, buf } = parseDataUrl(dataUrl)
    const stem = safeFileStem(
      (body.id ?? newId(mediaType === 'video' ? 'gitem' : 'img')).trim(),
    )
    const dir = uploadsDir(folder)
    mkdirSync(dir, { recursive: true })

    if (mediaType === 'video') {
      let ext = 'webm'
      if (mime === 'video/webm') ext = 'webm'
      else if (mime === 'video/mp4' || mime === 'video/quicktime') ext = 'mp4'
      else if (!mime.startsWith('video/')) {
        throw new Error('Only video uploads are allowed for mediaType=video')
      } else {
        throw new Error('Use video/webm or video/mp4')
      }
      const filename = `${stem}.${ext}`
      writeFileSync(path.join(dir, filename), buf)
      return json(res, 201, { url: `/uploads/${folder}/${filename}` })
    }

    if (!mime.startsWith('image/')) {
      throw new Error('Only image uploads are allowed')
    }

    const webp = await sharp(buf)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer()

    const filename = `${stem}.webp`
    writeFileSync(path.join(dir, filename), webp)
    return json(res, 201, { url: `/uploads/${folder}/${filename}` })
  } catch (err) {
    console.error('[api/admin/upload]', err)
    const message = err instanceof Error ? err.message : 'Upload failed'
    return json(res, 400, { error: message })
  }
}
