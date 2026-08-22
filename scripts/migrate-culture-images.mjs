/**
 * Download Drive (or other remote) culture_images.drive_url values,
 * convert to WebP under public/uploads/culture/, and UPDATE Neon.
 * Skips same-origin paths (/careers_section/…, /uploads/…).
 *
 * Usage: npm run migrate:culture-images
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'
import sharp from 'sharp'
import {
  fetchDriveMediaStream,
  isValidDriveFileId,
  parseDriveFileId,
} from '../api/_lib/drive.ts'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'uploads', 'culture')

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const sql = neon(url)

function isLocalPath(imageUrl) {
  const t = (imageUrl || '').trim()
  if (!t) return true
  if (t.startsWith('/')) return true
  try {
    const u = new URL(t)
    if (u.pathname.startsWith('/careers_section/')) return true
    if (u.pathname.startsWith('/uploads/')) return true
  } catch {
    /* not absolute */
  }
  return false
}

function safeFileStem(id) {
  return String(id).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120) || 'image'
}

async function downloadBytes(imageUrl) {
  const trimmed = imageUrl.trim()
  const fileId = parseDriveFileId(trimmed)
  if (fileId && isValidDriveFileId(fileId)) {
    const res = await fetchDriveMediaStream(fileId)
    const buf = Buffer.from(await res.arrayBuffer())
    if (!buf.length) throw new Error('Empty Drive download')
    return buf
  }

  if (/^https?:\/\//i.test(trimmed)) {
    const res = await fetch(trimmed, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; PrabhakarProcessorsMigrate/1.0)',
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
    return buf
  }

  throw new Error(`Unsupported drive_url: ${trimmed.slice(0, 80)}`)
}

async function toWebp(buffer) {
  return sharp(buffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer()
}

mkdirSync(outDir, { recursive: true })

const rows = await sql`
  SELECT id, drive_url FROM culture_images ORDER BY id ASC
`

let skipped = 0
let migrated = 0
let failed = 0

console.log(`[migrate-culture-images] ${rows.length} item(s)`)

for (const row of rows) {
  const id = row.id
  const driveUrl = (row.drive_url || '').trim()

  if (!driveUrl || isLocalPath(driveUrl)) {
    skipped += 1
    console.log(`  skip  ${id}  ${driveUrl || '(empty)'}`)
    continue
  }

  const publicPath = `/uploads/culture/${safeFileStem(id)}.webp`
  const diskPath = path.join(outDir, `${safeFileStem(id)}.webp`)

  try {
    console.log(`  migrate ${id} …`)
    const raw = await downloadBytes(driveUrl)
    const webp = await toWebp(raw)
    writeFileSync(diskPath, webp)
    await sql`
      UPDATE culture_images
      SET drive_url = ${publicPath}, updated_at = NOW()
      WHERE id = ${id}
    `
    migrated += 1
    console.log(`  ok     ${id} → ${publicPath} (${webp.length} bytes)`)
  } catch (err) {
    failed += 1
    const message = err instanceof Error ? err.message : String(err)
    console.error(`  FAIL   ${id}: ${message}`)
  }
}

console.log(
  `[migrate-culture-images] done — migrated=${migrated} skipped=${skipped} failed=${failed}`,
)
if (failed > 0) process.exitCode = 1
