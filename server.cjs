/**
 * Hostinger Express entry — CommonJS so LiteSpeed can require() this file.
 * Same process binds PORT via dynamic import of server.run.mjs (no top-level await).
 * Does not build at runtime — Hostinger cannot execute esbuild (EACCES). Ship dist/ + server.run.mjs.
 */
const { existsSync } = require('node:fs')
const path = require('node:path')

const root = __dirname
const distIndex = path.join(root, 'dist', 'index.html')
const serverBundle = path.join(root, 'server.run.mjs')

if (!existsSync(serverBundle) || !existsSync(distIndex)) {
  console.error(
    '[server] Missing dist/index.html or server.run.mjs. Run `npm run build` locally, commit the artifacts, and redeploy. Hostinger runtime cannot run Vite/esbuild.',
  )
  process.exit(1)
}

import('./server.run.mjs').catch((err) => {
  console.error('[server] failed to start', err)
  process.exit(1)
})
