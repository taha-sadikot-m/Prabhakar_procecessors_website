/**
 * Hostinger / production entry.
 * Registers tsx so bare `node server.js` can load TypeScript API routes,
 * then starts the Express app in scripts/prod-server.mjs.
 */
import { register } from 'tsx/esm/api'

register()
await import('./scripts/prod-server.mjs')
