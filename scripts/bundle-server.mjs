/**
 * Bundle scripts/prod-server.mjs (+ local .ts API routes) for Hostinger.
 * node_modules stay external; output is server.run.mjs.
 */
import * as esbuild from 'esbuild'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const outfile = path.join(root, '..', 'server.run.mjs')

await esbuild.build({
  entryPoints: [path.join(root, 'prod-server.mjs')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile,
  packages: 'external',
  logLevel: 'info',
})

console.log(`[bundle-server] wrote ${outfile}`)
