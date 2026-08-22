/**
 * Recompress oversized WebPs under public/ for PageSpeed.
 * Desktop max width 1920 / q78; mobile max width 768 / q65.
 *
 * Usage: node scripts/optimize-public-images.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')

const TARGETS = [
  'hero_section_image/desktop.webp',
  'hero_section_image/tablet_version.webp',
  'hero_section_image/mobile_version.webp',
  'second_section/desktop.webp',
  'second_section/mobile.webp',
  'third_section/1_desktop.webp',
  'third_section/1_mobile.webp',
  'third_section/2_desktop.webp',
  'third_section/2_mobile.webp',
  'third_section/3_desktop.webp',
  'third_section/3_mobile.webp',
  'third_section/4_desktop.webp',
  'third_section/4_mobile.webp',
  'third_section/5_desktop.webp',
  'third_section/5_mobile.webp',
  '4th_section/desktop.webp',
  '4th_section/mobile.webp',
  'plain_background/desktop_background.webp',
  'plain_background/mobile_background.webp',
  '6th_section/desktop_1.webp',
  '6th_section/desktop_2.webp',
  '6th_section/desktop_3.webp',
  '6th_section/desktop_4.webp',
  '6th_section/mobile_1.webp',
  '6th_section/mobile_2.webp',
  '6th_section/mobile_3.webp',
  '6th_section/mobile_4.webp',
  '7th_section/desktop_image.webp',
  '7th_section/mobile_image.webp',
  '8th_section/1.webp',
  '8th_section/2.webp',
  '8th_section/3.webp',
  '9th_section/3IN1_desktop.webp',
  '9th_section/3In1_mobile.webp',
  '10th_section/desktop.webp',
  '10th_section/mobile.webp',
  'service_section/swatch-01-piece-dyeing.webp',
  'service_section/swatch-03-cationic-dyeing.webp',
  'service_section/swatch-04-screen-printing.webp',
  'service_section/swatch-05-discharge-printing.webp',
  'service_section/swatch-06-digital-printing.webp',
  'service_section/swatch-07-shearing.webp',
  'service_section/swatch-08-sueding.webp',
  'service_section/swatch-09-water-repellency.webp',
  'service_section/swatch-11-rotary-allover.webp',
  'service_section/swatch-12-foil-jari-print.webp',
]

function isMobileAsset(rel) {
  const base = path.basename(rel).toLowerCase()
  return (
    base.includes('mobile') ||
    base.includes('mobile_version') ||
    base.includes('tablet')
  )
}

function settingsFor(rel) {
  if (isMobileAsset(rel)) {
    return { maxWidth: 768, quality: 65 }
  }
  return { maxWidth: 1920, quality: 78 }
}

async function optimizeOne(rel) {
  const filePath = path.join(publicDir, rel)
  if (!fs.existsSync(filePath)) {
    console.warn(`[skip] missing ${rel}`)
    return
  }
  const before = fs.statSync(filePath).size
  const { maxWidth, quality } = settingsFor(rel)
  const input = fs.readFileSync(filePath)
  const image = sharp(input, { failOn: 'none' })
  const meta = await image.metadata()
  const width = meta.width ?? maxWidth
  const pipeline =
    width > maxWidth
      ? image.resize({ width: maxWidth, withoutEnlargement: true })
      : image
  const out = await pipeline.webp({ quality, effort: 6 }).toBuffer()
  // Always write when quality/size settings are stricter, even if slightly larger
  // is unlikely; skip only if not meaningfully smaller.
  if (out.length >= before * 0.98) {
    console.log(
      `[keep] ${rel} ${(before / 1024).toFixed(0)} KiB (recompress not smaller)`,
    )
    return
  }
  fs.writeFileSync(filePath, out)
  console.log(
    `[ok]   ${rel} ${(before / 1024).toFixed(0)} → ${(out.length / 1024).toFixed(0)} KiB (q${quality})`,
  )
}

let ok = 0
for (const rel of TARGETS) {
  try {
    await optimizeOne(rel)
    ok++
  } catch (err) {
    console.error(`[fail] ${rel}`, err instanceof Error ? err.message : err)
  }
}
console.log(`Done. Processed ${ok}/${TARGETS.length} targets.`)
