/**
 * Hostinger / Node entry file.
 * Hostinger runs `node server.mjs`; we re-exec with tsx so TypeScript API routes load.
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const entry = path.join(root, 'scripts', 'prod-server.mjs')

const child = spawn(
  process.execPath,
  ['--import', 'tsx', entry],
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
