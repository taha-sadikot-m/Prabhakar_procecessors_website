/**
 * Hostinger Express entry — CommonJS so LiteSpeed can require() this file.
 * Same process binds PORT via dynamic import of server.run.mjs (no top-level await).
 * Start-time build uses process.execPath (runtime PATH often has no npm).
 */
const { existsSync } = require('node:fs')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const root = __dirname
const distIndex = path.join(root, 'dist', 'index.html')
const serverBundle = path.join(root, 'server.run.mjs')
const node = process.execPath

function runStep(label, args) {
  console.log(`[server] ${label}…`)
  const result = spawnSync(node, args, {
    cwd: root,
    env: process.env,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  })

  if (result.stdout) {
    console.log(result.stdout)
  }
  if (result.stderr) {
    console.error(result.stderr)
  }
  if (result.error) {
    console.error(`[server] ${label} spawn error:`, result.error)
  }

  if (result.status !== 0) {
    console.error(`[server] ${label} failed`, {
      status: result.status,
      signal: result.signal,
    })
    process.exit(result.status ?? 1)
  }
}

function runBuild() {
  console.log(
    '[server] building with node (npm is often missing from Hostinger runtime PATH)…',
  )
  runStep('vite build', [
    path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'),
    'build',
  ])
  runStep('seo-build', [
    '--import',
    'tsx',
    path.join(root, 'scripts', 'seo-build.ts'),
  ])
  runStep('bundle-server', [path.join(root, 'scripts', 'bundle-server.mjs')])
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
