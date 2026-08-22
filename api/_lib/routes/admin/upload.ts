import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import sharp from 'sharp'
import { requireAdmin } from '../../auth'
import { handleOptions, json, newId, readJsonBody } from '../../http'

const MAX_BYTES = 5.5 * 1024 * 1024
const ALLOWED_FOLDERS = new Set(['services', 'culture'] as const)
type UploadFolder = 'services' | 'culture'

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
  throw new Error('folder must be services or culture')
}

function parseDataUrl(dataUrl: string): Buffer {
  const match = /^data:([^;]+);base64,(.+)$/s.exec(dataUrl.trim())
  if (!match) {
    throw new Error('Expected a base64 data URL')
  }
  const mime = match[1].toLowerCase()
  if (!mime.startsWith('image/')) {
    throw new Error('Only image uploads are allowed')
  }
  const buf = Buffer.from(match[2], 'base64')
  if (!buf.length) throw new Error('Empty image data')
  if (buf.length > MAX_BYTES) {
    throw new Error('Image too large (max ~5.5MB)')
  }
  return buf
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
    }>(req)
    const dataUrl = (body.dataUrl ?? '').trim()
    if (!dataUrl) return json(res, 400, { error: 'dataUrl required' })

    const folder = parseFolder(body.folder)
    const raw = parseDataUrl(dataUrl)
    const stem = safeFileStem((body.id ?? newId('img')).trim())
    const webp = await sharp(raw)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer()

    const dir = uploadsDir(folder)
    mkdirSync(dir, { recursive: true })
    const filename = `${stem}.webp`
    writeFileSync(path.join(dir, filename), webp)

    const url = `/uploads/${folder}/${filename}`
    return json(res, 201, { url })
  } catch (err) {
    console.error('[api/admin/upload]', err)
    const message = err instanceof Error ? err.message : 'Upload failed'
    return json(res, 400, { error: message })
  }
}
