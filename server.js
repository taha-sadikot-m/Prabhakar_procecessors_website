/**
 * Hostinger Express entry (`node server.js`).
 * Same process must bind PORT — do not spawn a child.
 * Expects `server.run.mjs` from `npm run build` (esbuild bundle of prod-server).
 */
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const distIndex = path.join(root, 'dist', 'index.html')
const serverBundle = path.join(root, 'server.run.mjs')

function runBuild() {
  console.log('[server] running npm run build…')
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
}

if (!existsSync(serverBundle) || !existsSync(distIndex)) {
  runBuild()
}

if (!existsSync(serverBundle)) {
  console.error(
    '[server] server.run.mjs missing after build — cannot start',
  )
  process.exit(1)
}

if (!existsSync(distIndex)) {
  console.error(
    '[server] dist/index.html missing after build — cannot start',
  )
  process.exit(1)
}

await import('./server.run.mjs')
