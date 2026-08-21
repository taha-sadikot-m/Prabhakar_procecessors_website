/**
 * Hostinger Express entry (`node server.js`).
 * Builds the Vite frontend if `dist/` is missing, then starts the API + static server.
 */
import { existsSync } from 'node:fs'
import { spawn, spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const distIndex = path.join(root, 'dist', 'index.html')
const prodEntry = path.join(root, 'scripts', 'prod-server.mjs')

function ensureDist() {
  if (existsSync(distIndex)) return
  console.log('[server] dist/ missing — running npm run build…')
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
    shell: true,
  })
  if (result.status !== 0) {
    console.error('[server] build failed')
    process.exit(result.status ?? 1)
  }
  if (!existsSync(distIndex)) {
    console.error('[server] build finished but dist/index.html is still missing')
    process.exit(1)
  }
}

ensureDist()

const child = spawn(
  process.execPath,
  ['--import', 'tsx', prodEntry],
  {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  },
)

child.on('error', (err) => {
  console.error('[server] failed to start prod-server:', err)
  process.exit(1)
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 1)
})

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    if (!child.killed) child.kill(sig)
  })
}
