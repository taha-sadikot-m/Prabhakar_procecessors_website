/**
 * Hostinger Express entry — CommonJS so LiteSpeed can require() this file.
 * Same process binds PORT via dynamic import of server.run.mjs (no top-level await).
 */
const { existsSync } = require('node:fs')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const root = __dirname
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
  console.error('[server] server.run.mjs missing after build — cannot start')
  process.exit(1)
}

if (!existsSync(distIndex)) {
  console.error('[server] dist/index.html missing after build — cannot start')
  process.exit(1)
}

import('./server.run.mjs').catch((err) => {
  console.error('[server] failed to start', err)
  process.exit(1)
})
