/**
 * Copy converted gallery WebP/WebM into public/uploads/gallery,
 * extract video posters, UPDATE Neon drive_url. No description/sort changes.
 *
 * Usage: npm run migrate:gallery-media
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  unlinkSync,
} from 'node:fs'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const stagingRoot = path.join(root, '.tmp', 'gallery-download')
const stagingImages = path.join(stagingRoot, 'images')
const stagingVideos = path.join(stagingRoot, 'videos')
const outDir = path.join(root, 'public', 'uploads', 'gallery')

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const sql = neon(url)

function safeFileStem(id) {
  return String(id).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120) || 'item'
}

function resolveFfmpeg() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH
  const localWin = path.join(root, 'tools', 'ffmpeg', 'ffmpeg.exe')
  const localUnix = path.join(root, 'tools', 'ffmpeg', 'ffmpeg')
  if (existsSync(localWin)) return localWin
  if (existsSync(localUnix)) return localUnix
  return 'ffmpeg'
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: false })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} exited with code ${code}`))
    })
  })
}

function alreadyMigrated(driveUrl) {
  return (driveUrl || '').trim().startsWith('/uploads/gallery/')
}

mkdirSync(outDir, { recursive: true })

const ffmpeg = resolveFfmpeg()
try {
  await run(ffmpeg, ['-version'])
} catch {
  console.error(
    'ffmpeg not found (needed for video posters). Install ffmpeg or set FFMPEG_PATH.',
  )
  process.exit(1)
}

const rows = await sql`
  SELECT id, drive_url, media_type FROM gallery_items ORDER BY sort_order ASC, id ASC
`

let migrated = 0
let skipped = 0
let failed = 0

console.log(`[migrate-gallery-media] ${rows.length} item(s) → ${outDir}`)

for (const row of rows) {
  const id = row.id
  const stem = safeFileStem(id)
  const driveUrl = (row.drive_url || '').trim()
  const mediaType = row.media_type === 'image' ? 'image' : 'video'

  if (alreadyMigrated(driveUrl)) {
    skipped += 1
    console.log(`  skip  ${id}  ${driveUrl}`)
    continue
  }

  try {
    if (mediaType === 'image') {
      const src = path.join(stagingImages, `${stem}.webp`)
      if (!existsSync(src)) {
        throw new Error(`Missing staging image: ${src}`)
      }
      const destName = `${stem}.webp`
      const dest = path.join(outDir, destName)
      copyFileSync(src, dest)
      const publicPath = `/uploads/gallery/${destName}`
      await sql`
        UPDATE gallery_items
        SET drive_url = ${publicPath}, updated_at = NOW()
        WHERE id = ${id}
      `
      migrated += 1
      console.log(`  ok    ${id} image → ${publicPath}`)
    } else {
      const src = path.join(stagingVideos, `${stem}.webm`)
      if (!existsSync(src)) {
        throw new Error(`Missing staging video: ${src}`)
      }
      const destName = `${stem}.webm`
      const dest = path.join(outDir, destName)
      copyFileSync(src, dest)

      const posterPath = path.join(outDir, `${stem}.jpg`)
      const partialPoster = `${posterPath}.partial.jpg`
      if (existsSync(partialPoster)) {
        try {
          unlinkSync(partialPoster)
        } catch {
          /* ignore */
        }
      }
      await run(ffmpeg, [
        '-y',
        '-i',
        dest,
        '-ss',
        '00:00:01.000',
        '-frames:v',
        '1',
        '-q:v',
        '3',
        '-update',
        '1',
        partialPoster,
      ])
      // rename via copy+unlink for Windows friendliness
      copyFileSync(partialPoster, posterPath)
      unlinkSync(partialPoster)

      const publicPath = `/uploads/gallery/${destName}`
      await sql`
        UPDATE gallery_items
        SET drive_url = ${publicPath}, updated_at = NOW()
        WHERE id = ${id}
      `
      migrated += 1
      console.log(`  ok    ${id} video → ${publicPath} (+ poster)`)
    }
  } catch (err) {
    failed += 1
    const message = err instanceof Error ? err.message : String(err)
    console.error(`  FAIL  ${id}: ${message}`)
  }
}

console.log(
  `[migrate-gallery-media] done — migrated=${migrated} skipped=${skipped} failed=${failed}`,
)
if (failed > 0) process.exitCode = 1
