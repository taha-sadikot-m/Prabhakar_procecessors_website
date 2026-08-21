/**
 * Alias entry — same bootstrap as server.js.
 */
import { createRequire } from 'node:module'

createRequire(import.meta.url)('./server.cjs')
