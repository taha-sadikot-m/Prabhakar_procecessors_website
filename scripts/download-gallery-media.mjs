/**
 * Download gallery_items media into staging folders (no DB updates).
 *
 * Output:
 *   .tmp/gallery-download/images/{id}.{ext}
 *   .tmp/gallery-download/videos/{id}.{ext}
 *   .tmp/gallery-download/manifest.json
 *
 * Usage: npm run download:gallery-media
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'
import {
  fetchDriveMediaStream,
  isValidDriveFileId,
  parseDriveFileId,
} from '../api/_lib/drive.ts'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outRoot = path.join(root, '.tmp', 'gallery-download')
const imagesDir = path.join(outRoot, 'images')
const videosDir = path.join(outRoot, 'videos')
const publicDir = path.join(root, 'public')

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const sql = neon(url)

function safeFileStem(id) {
  return String(id).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120) || 'item'
}

function mediaFolder(mediaType) {
  return mediaType === 'image' ? 'images' : 'videos'
}

function extFromContentType(contentType) {
  const ct = (contentType || '').split(';')[0].trim().toLowerCase()
  const map = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
    'image/heic': 'heic',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'application/octet-stream': null,
  }
  return map[ct] ?? null
}

function extFromUrl(sourceUrl) {
  try {
    const pathname = sourceUrl.startsWith('/')
      ? sourceUrl.split('?')[0]
      : new URL(sourceUrl).pathname
    const base = path.basename(pathname)
    const dot = base.lastIndexOf('.')
    if (dot <= 0) return null
    const ext = base.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '')
    return ext || null
  } catch {
    return null
  }
}

function defaultExt(mediaType) {
  return mediaType === 'image' ? 'jpg' : 'mp4'
}

function findExisting(dir, stem) {
  if (!existsSync(dir)) return null
  const match = readdirSync(dir).find(
    (name) => name === stem || name.startsWith(`${stem}.`),
  )
  return match ? path.join(dir, match) : null
}

async function fetchRemote(sourceUrl) {
  const trimmed = sourceUrl.trim()
  const fileId = parseDriveFileId(trimmed)
  if (fileId && isValidDriveFileId(fileId)) {
    const res = await fetchDriveMediaStream(fileId)
    const buf = Buffer.from(await res.arrayBuffer())
    if (!buf.length) throw new Error('Empty Drive download')
    return {
      buffer: buf,
      contentType: res.headers.get('content-type') || '',
    }
  }

  if (/^https?:\/\//i.test(trimmed)) {
    const res = await fetch(trimmed, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; PrabhakarProcessorsGalleryDownload/1.0)',
      },
      redirect: 'follow',
    })
    const contentType = res.headers.get('content-type') || ''
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    if (contentType.includes('text/html')) {
      throw new Error('Remote URL returned HTML')
    }
    const buf = Buffer.from(await res.arrayBuffer())
    if (!buf.length) throw new Error('Empty remote download')
    return { buffer: buf, contentType }
  }

  throw new Error(`Unsupported drive_url: ${trimmed.slice(0, 80)}`)
}

function resolveLocalPublicPath(driveUrl) {
  const trimmed = driveUrl.trim()
  let pathname = trimmed
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      pathname = new URL(trimmed).pathname
    } catch {
      return null
    }
  }
  if (!pathname.startsWith('/')) return null
  const rel = pathname.replace(/^\/+/, '').split('?')[0]
  if (!rel || rel.includes('..')) return null
  return path.join(publicDir, rel)
}

mkdirSync(imagesDir, { recursive: true })
mkdirSync(videosDir, { recursive: true })

const rows = await sql`
  SELECT id, drive_url, description, media_type, sort_order
  FROM gallery_items
  ORDER BY sort_order ASC, id ASC
`

const manifest = []
let downloaded = 0
let skipped = 0
let failed = 0

console.log(`[download-gallery-media] ${rows.length} item(s) → ${outRoot}`)

for (const row of rows) {
  const id = row.id
  const driveUrl = (row.drive_url || '').trim()
  const mediaType = row.media_type === 'image' ? 'image' : 'video'
  const folder = mediaFolder(mediaType)
  const dir = folder === 'images' ? imagesDir : videosDir
  const stem = safeFileStem(id)

  const entry = {
    id,
    mediaType,
    driveUrl,
    description: row.description ?? null,
    sortOrder: row.sort_order,
    relativePath: null,
    bytes: null,
    status: 'pending',
    error: null,
  }

  if (!driveUrl) {
    entry.status = 'failed'
    entry.error = 'empty drive_url'
    failed += 1
    console.error(`  FAIL   ${id}: empty drive_url`)
    manifest.push(entry)
    continue
  }

  const existing = findExisting(dir, stem)
  if (existing) {
    entry.status = 'skipped'
    entry.relativePath = path
      .relative(outRoot, existing)
      .split(path.sep)
      .join('/')
    entry.bytes = null
    skipped += 1
    console.log(`  skip  ${id}  (exists ${entry.relativePath})`)
    manifest.push(entry)
    continue
  }

  try {
    const localPath = resolveLocalPublicPath(driveUrl)
    let buffer
    let contentType = ''
    let sourceHint = driveUrl

    if (localPath && existsSync(localPath)) {
      const ext =
        extFromUrl(localPath) ||
        extFromUrl(driveUrl) ||
        defaultExt(mediaType)
      const filename = `${stem}.${ext}`
      const dest = path.join(dir, filename)
      copyFileSync(localPath, dest)
      const size = statSync(dest).size
      entry.status = 'downloaded'
      entry.relativePath = `${folder}/${filename}`
      entry.bytes = size
      downloaded += 1
      console.log(`  ok     ${id} ← public copy → ${entry.relativePath} (${size} bytes)`)
      manifest.push(entry)
      continue
    }

    if (localPath && !existsSync(localPath)) {
      // Fall through to remote/Drive if the public file is missing and URL is Drive
      if (!parseDriveFileId(driveUrl) && !/^https?:\/\//i.test(driveUrl)) {
        throw new Error(`Local file missing: ${localPath}`)
      }
    }

    ;({ buffer, contentType } = await fetchRemote(driveUrl))
    const ext =
      extFromContentType(contentType) ||
      extFromUrl(sourceHint) ||
      defaultExt(mediaType)
    const filename = `${stem}.${ext}`
    const dest = path.join(dir, filename)
    writeFileSync(dest, buffer)
    entry.status = 'downloaded'
    entry.relativePath = `${folder}/${filename}`
    entry.bytes = buffer.length
    downloaded += 1
    console.log(
      `  ok     ${id} → ${entry.relativePath} (${buffer.length} bytes)`,
    )
  } catch (err) {
    entry.status = 'failed'
    entry.error = err instanceof Error ? err.message : String(err)
    failed += 1
    console.error(`  FAIL   ${id}: ${entry.error}`)
  }

  manifest.push(entry)
}

const manifestPath = path.join(outRoot, 'manifest.json')
writeFileSync(
  manifestPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: { total: rows.length, downloaded, skipped, failed },
      items: manifest,
    },
    null,
    2,
  ),
)

console.log(
  `[download-gallery-media] done — downloaded=${downloaded} skipped=${skipped} failed=${failed}`,
)
console.log(`[download-gallery-media] manifest → ${manifestPath}`)
if (failed > 0) process.exitCode = 1
