/**
 * Hostinger Express entry (LiteSpeed require()s this file).
 * No top-level await — delegates to CommonJS bootstrap server.cjs.
 */
import { createRequire } from 'node:module'

createRequire(import.meta.url)('./server.cjs')
