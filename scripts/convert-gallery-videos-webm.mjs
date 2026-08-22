/**
 * Convert staged gallery videos under .tmp/gallery-download/videos to WebM.
 * Constrained VP9: -b:v 1.5M -crf 32 -an (no audio), max height 720.
 * Keeps originals; skips non-empty existing .webm.
 *
 * Usage:
 *   npm run convert:gallery-videos
 *   npm run convert:gallery-videos -- --only gitem_mslkush0_tclxu8
 */
import { spawn } from 'node:child_process'
import { existsSync, readdirSync, renameSync, statSync, unlinkSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const videosDir = path.join(root, '.tmp', 'gallery-download', 'videos')

const VIDEO_EXTS = new Set([
  '.mp4',
  '.mov',
  '.avi',
  '.mkv',
  '.m4v',
  '.mpeg',
  '.mpg',
])

function resolveFfmpeg() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH
  const localWin = path.join(root, 'tools', 'ffmpeg', 'ffmpeg.exe')
  const localUnix = path.join(root, 'tools', 'ffmpeg', 'ffmpeg')
  if (existsSync(localWin)) return localWin
  if (existsSync(localUnix)) return localUnix
  return 'ffmpeg'
}

function parseOnlyArg(argv) {
  const idx = argv.indexOf('--only')
  if (idx === -1) return null
  return argv[idx + 1] || null
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

function mib(bytes) {
  return (bytes / (1024 * 1024)).toFixed(1)
}

if (!existsSync(videosDir)) {
  console.error(`Missing folder: ${videosDir}`)
  console.error('Run npm run download:gallery-media first.')
  process.exit(1)
}

const ffmpeg = resolveFfmpeg()
try {
  await run(ffmpeg, ['-version'])
} catch {
  console.error(
    'ffmpeg not found. Install ffmpeg and ensure it is on PATH, or set FFMPEG_PATH.',
  )
  process.exit(1)
}

const only = parseOnlyArg(process.argv.slice(2))
let files = readdirSync(videosDir).filter((name) =>
  VIDEO_EXTS.has(path.extname(name).toLowerCase()),
)

if (only) {
  files = files.filter((name) => path.basename(name, path.extname(name)) === only)
  if (!files.length) {
    console.error(`No video matches --only ${only}`)
    process.exit(1)
  }
}

if (!files.length) {
  console.log(`[convert-gallery-videos] no source videos in ${videosDir}`)
  process.exit(0)
}

let converted = 0
let skipped = 0
let failed = 0

console.log(
  `[convert-gallery-videos] ${files.length} file(s) → WebM (VP9 1.5M CRF32 -an)`,
)

for (const name of files) {
  const src = path.join(videosDir, name)
  const stem = path.basename(name, path.extname(name))
  const dest = path.join(videosDir, `${stem}.webm`)
  const partial = path.join(videosDir, `${stem}.partial.webm`)

  if (existsSync(dest) && statSync(dest).size > 0) {
    skipped += 1
    console.log(`  skip  ${name} → ${stem}.webm (exists, ${mib(statSync(dest).size)} MiB)`)
    continue
  }

  if (existsSync(partial)) {
    try {
      unlinkSync(partial)
    } catch {
      /* ignore */
    }
  }

  const before = statSync(src).size
  console.log(`  encode ${name} (${mib(before)} MiB)…`)

  try {
    await run(ffmpeg, [
      '-y',
      '-i',
      src,
      '-vf',
      "scale=-2:'min(720,ih)'",
      '-c:v',
      'libvpx-vp9',
      '-b:v',
      '1.5M',
      '-crf',
      '32',
      '-row-mt',
      '1',
      '-an',
      partial,
    ])
    renameSync(partial, dest)
    const after = statSync(dest).size
    converted += 1
    console.log(
      `  ok    ${stem}.webm ${mib(before)} → ${mib(after)} MiB`,
    )
  } catch (err) {
    failed += 1
    if (existsSync(partial)) {
      try {
        unlinkSync(partial)
      } catch {
        /* ignore */
      }
    }
    const message = err instanceof Error ? err.message : String(err)
    console.error(`  FAIL  ${name}: ${message}`)
  }
}

console.log(
  `[convert-gallery-videos] done — converted=${converted} skipped=${skipped} failed=${failed}`,
)
if (failed > 0) process.exitCode = 1
