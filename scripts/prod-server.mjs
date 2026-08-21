/**
 * Production server for single-host deploys (e.g. Hostinger Node).
 * Serves Vite `dist/` + the same /api handlers used by scripts/dev-api.mjs.
 */
import http from 'node:http'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import express from 'express'
import health from '../api/_lib/routes/health.ts'
import services from '../api/_lib/routes/services.ts'
import gallery from '../api/_lib/routes/gallery.ts'
import driveMedia from '../api/_lib/routes/drive-media.ts'
import testimonials from '../api/_lib/routes/testimonials.ts'
import blog from '../api/_lib/routes/blog.ts'
import contact from '../api/_lib/routes/contact.ts'
import careers from '../api/_lib/routes/careers.ts'
import culture from '../api/_lib/routes/culture.ts'
import adminLogin from '../api/_lib/routes/admin/login.ts'
import adminServices from '../api/_lib/routes/admin/services.ts'
import adminGallery from '../api/_lib/routes/admin/gallery.ts'
import adminTestimonials from '../api/_lib/routes/admin/testimonials.ts'
import adminBlog from '../api/_lib/routes/admin/blog.ts'
import adminCareers from '../api/_lib/routes/admin/careers.ts'
import adminCulture from '../api/_lib/routes/admin/culture.ts'
import adminContact from '../api/_lib/routes/admin/contact.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Source lives in scripts/; bundled output is server.run.mjs at repo root.
const ROOT = existsSync(path.join(__dirname, 'package.json'))
  ? __dirname
  : path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const PORT = Number(process.env.PORT) || 3000

function resolveHandler(mod) {
  if (typeof mod === 'function') return mod
  if (mod && typeof mod.default === 'function') return mod.default
  throw new Error('API handler export is not a function')
}

function mount(mod) {
  const handler = resolveHandler(mod)
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (err) {
      console.error('[prod-server]', err)
      if (!res.headersSent) {
        res.status(500).json({
          error: err instanceof Error ? err.message : 'Internal error',
        })
      }
    }
  }
}

const app = express()
app.use(express.json({ limit: '2mb' }))

app.all('/api/health', mount(health))
app.all('/api/services', mount(services))
app.all('/api/gallery', mount(gallery))
app.all('/api/drive-media', mount(driveMedia))
app.all('/api/testimonials', mount(testimonials))
app.all('/api/blog', mount(blog))
app.all('/api/contact', mount(contact))
app.all('/api/careers', mount(careers))
app.all(['/api/culture', '/api/culture/'], mount(culture))
app.all('/api/admin/login', mount(adminLogin))
app.all('/api/admin/services', mount(adminServices))
app.all('/api/admin/gallery', mount(adminGallery))
app.all('/api/admin/testimonials', mount(adminTestimonials))
app.all('/api/admin/blog', mount(adminBlog))
app.all('/api/admin/careers', mount(adminCareers))
app.all(['/api/admin/culture', '/api/admin/culture/'], mount(adminCulture))
app.all('/api/admin/contact', mount(adminContact))

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found' })
})

app.use(
  express.static(DIST, {
    index: false,
    fallthrough: true,
  }),
)

app.get(/^(?!\/api(?:\/|$)).*/, (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()
  res.sendFile(path.join(DIST, 'index.html'), (err) => {
    if (err) next(err)
  })
})

const server = http.createServer(app)

server.on('error', (err) => {
  const code = err && typeof err === 'object' && 'code' in err ? err.code : ''
  if (code === 'EADDRINUSE') {
    console.error(
      `[prod-server] failed to bind :${PORT}: address already in use`,
    )
    process.exit(1)
  }
  console.error('[prod-server]', err)
  process.exit(1)
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[prod-server] listening on http://0.0.0.0:${PORT}`)
  console.log(`[prod-server] serving static from ${DIST}`)
})

function shutdown() {
  server.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
