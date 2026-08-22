/**
 * Convert staged gallery images under .tmp/gallery-download/images to WebP.
 * Keeps originals; skips if .webp already exists and is non-empty.
 *
 * Usage: npm run convert:gallery-images
 */
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = path.join(root, '.tmp', 'gallery-download', 'images')

const IMAGE_EXTS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.tif',
  '.tiff',
  '.avif',
  '.heic',
  '.bmp',
])

if (!existsSync(imagesDir)) {
  console.error(`Missing folder: ${imagesDir}`)
  console.error('Run npm run download:gallery-media first.')
  process.exit(1)
}

const files = readdirSync(imagesDir).filter((name) => {
  const ext = path.extname(name).toLowerCase()
  return IMAGE_EXTS.has(ext)
})

if (!files.length) {
  console.log(`[convert-gallery-images] no source images in ${imagesDir}`)
  process.exit(0)
}

let converted = 0
let skipped = 0
let failed = 0

console.log(`[convert-gallery-images] ${files.length} file(s) in ${imagesDir}`)

for (const name of files) {
  const src = path.join(imagesDir, name)
  const stem = path.basename(name, path.extname(name))
  const dest = path.join(imagesDir, `${stem}.webp`)

  if (existsSync(dest) && statSync(dest).size > 0) {
    skipped += 1
    console.log(`  skip  ${name} → ${stem}.webp (exists)`)
    continue
  }

  try {
    const before = statSync(src).size
    const webp = await sharp(src, { failOn: 'none' })
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer()
    writeFileSync(dest, webp)
    converted += 1
    console.log(
      `  ok    ${name} ${(before / 1024).toFixed(0)} → ${(webp.length / 1024).toFixed(0)} KiB (${stem}.webp)`,
    )
  } catch (err) {
    failed += 1
    const message = err instanceof Error ? err.message : String(err)
    console.error(`  FAIL  ${name}: ${message}`)
  }
}

console.log(
  `[convert-gallery-images] done — converted=${converted} skipped=${skipped} failed=${failed}`,
)
if (failed > 0) process.exitCode = 1
