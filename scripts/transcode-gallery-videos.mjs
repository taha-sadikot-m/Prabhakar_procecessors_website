/**
 * Download gallery Drive videos and transcode to browser-safe H.264 (+faststart).
 *
 * Requires ffmpeg on PATH, or set FFMPEG_PATH to the ffmpeg binary.
 *
 * Usage:
 *   npm run gallery:transcode
 *   npm run gallery:transcode -- --only stenter-1
 *
 * Outputs:
 *   public/gallery-videos/<itemId>.mp4
 *   scripts/gallery-video-map.json
 */
import { spawn } from 'node:child_process'
import { createWriteStream, existsSync } from 'node:fs'
import {
  access,
  mkdir,
  readFile,
  rename,
  stat,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public', 'gallery-videos')
const tmpDir = path.join(root, '.tmp', 'gallery-raw')
const mapPath = path.join(__dirname, 'gallery-video-map.json')

/** Keep in sync with seed-cms.mjs gallery items that have driveId. */
const galleryItems = [
  { id: 'stenter-1', driveId: '1m2sLnv6_5Bb6Ae70bbCvg2vka4uI-18G' },
  { id: 'stenter-2', driveId: '163P3BxH8MKjt5XoG3Bypo0o4lbWC_vcZ' },
  { id: 'stitching-1', driveId: '1Kuucxn-h8sODj5usVXwH8vnaaYJzeJRV' },
  { id: 'finishing-gallery-1', driveId: '1BVVbT4Oh_cIzCKgb7u0V53x6a4b2UYKE' },
  { id: 'finishing-gallery-2', driveId: '1hsax-M2u5XQgqvugvEWNGvL_K4_uT8HX' },
  { id: 'drum-process-1', driveId: '1md-T9lkFqqxK-ocDPnYWwFmytoiyiKhd' },
  { id: 'packing-1', driveId: '1fGyCeA5REIDP_FW3M8iOvZ5Vx05BXx1Q' },
  { id: 'dispatch-1', driveId: '1kjB-7OelPV8TzWf5MoXv3dS0zCLgWf4-' },
  { id: 'dispatch-2', driveId: '1bCdim2_-wKmmYbiT4LyQoBJgLjehP20_' },
  { id: 'loading-1', driveId: '1fm_7qeHAS-e6JmGYGFoGpROsEpj1OwHm' },
  { id: 'printing-gallery-1', driveId: '1PW0gg3E3F6aFOs-ioG9lr16mYZLa5hnL' },
  { id: 'printing-gallery-2', driveId: '1WUgSPdM3kkAEGupDGR8rEGQb2wabvQbI' },
  { id: 'printing-gallery-3', driveId: '1TGnQVgTEfKVgh0cDhmNKtiOzdcXxTlQP' },
  { id: 'checking-1', driveId: '1L49SjO5MT6FDmepRvlg1mYtrPqXVqxoT' },
  { id: 'checking-2', driveId: '1TUxVXxSMQo30vp4f2TSIr-02l6W1Wswb' },
  { id: 'gate-parking-1', driveId: '1hc9cUZ4rMhSQgX0EHgSfP9dWH-9dUqxv' },
  { id: 'gate-parking-2', driveId: '1kKbWaG0vL5hilfNf7znO_tNREYsOEPrX' },
  { id: 'washing-1', driveId: '1Mv1ZpX_nR9ATKyxDGGYqunX6aE5qTV_E' },
]

function driveDownloadUrl(fileId) {
  return `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download&confirm=t`
}

function parseOnlyArg(argv) {
  const idx = argv.indexOf('--only')
  if (idx === -1) return null
  return argv[idx + 1] || null
}

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
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

async function downloadFile(url, dest) {
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok || !res.body) {
    throw new Error(`Download failed (${res.status}) for ${url}`)
  }
  const type = res.headers.get('content-type') || ''
  if (type.includes('text/html')) {
    throw new Error(`Download returned HTML (file may not be public): ${url}`)
  }
  await pipeline(res.body, createWriteStream(dest))
}

async function main() {
  const only = parseOnlyArg(process.argv.slice(2))
  const items = only
    ? galleryItems.filter((item) => item.id === only)
    : galleryItems

  if (only && items.length === 0) {
    console.error(`No gallery item matches --only ${only}`)
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

  await mkdir(outDir, { recursive: true })
  await mkdir(tmpDir, { recursive: true })

  /** @type {Record<string, { driveId: string, url: string, bytes: number }>} */
  const map = (await exists(mapPath))
    ? JSON.parse(await readFile(mapPath, 'utf8'))
    : {}

  for (const item of items) {
    const outFile = path.join(outDir, `${item.id}.mp4`)
    const rawFile = path.join(tmpDir, `${item.id}.bin`)
    const publicUrl = `/gallery-videos/${item.id}.mp4`

    if (await exists(outFile)) {
      const st = await stat(outFile)
      console.log(`skip ${item.id} (exists, ${st.size} bytes)`)
      map[item.id] = {
        driveId: item.driveId,
        url: publicUrl,
        bytes: st.size,
      }
      continue
    }

    console.log(`download ${item.id}…`)
    await downloadFile(driveDownloadUrl(item.driveId), rawFile)

    console.log(`transcode ${item.id} → H.264…`)
    const tmpOut = `${outFile}.partial.mp4`
    await run(ffmpeg, [
      '-y',
      '-i',
      rawFile,
      // ffmpeg applies display-matrix rotation by default; then downscale for the web.
      '-vf',
      "scale='min(1280,iw)':-2",
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '26',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '96k',
      '-ac',
      '2',
      '-movflags',
      '+faststart',
      tmpOut,
    ])
    await rename(tmpOut, outFile)

    const posterFile = path.join(outDir, `${item.id}.jpg`)
    await run(ffmpeg, [
      '-y',
      '-i',
      outFile,
      '-ss',
      '00:00:01.000',
      '-frames:v',
      '1',
      '-q:v',
      '3',
      '-update',
      '1',
      posterFile,
    ])

    const st = await stat(outFile)
    map[item.id] = {
      driveId: item.driveId,
      url: publicUrl,
      posterUrl: `/gallery-videos/${item.id}.jpg`,
      bytes: st.size,
    }
    console.log(`ok ${item.id} → ${publicUrl} (${st.size} bytes)`)
  }

  await writeFile(mapPath, `${JSON.stringify(map, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${mapPath}`)
  console.log('Done. Re-seed CMS: npm run seed:cms')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
