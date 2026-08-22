/**
 * Production server for single-host deploys (e.g. Hostinger Node).
 * Serves Vite `dist/` + the same /api handlers used by scripts/dev-api.mjs.
 */
import http from 'node:http'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import compression from 'compression'
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
const PUBLIC = path.join(ROOT, 'public')
const PORT = Number(process.env.PORT) || 3000

const STATIC_EXT =
  /\.(?:webp|svg|js|css|woff2?|png|jpe?g|gif|ico|avif|map)$/i

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

function setLongCache(res, immutable = false) {
  const value = immutable
    ? 'public, max-age=31536000, immutable'
    : 'public, max-age=31536000'
  res.setHeader('Cache-Control', value)
  res.setHeader('Expires', new Date(Date.now() + 31536000 * 1000).toUTCString())
}

function setStaticCacheHeaders(res, filePath) {
  if (filePath.endsWith('.html')) {
    res.setHeader('Cache-Control', 'no-cache')
    return
  }
  if (filePath.includes(`${path.sep}assets${path.sep}`)) {
    setLongCache(res, true)
    return
  }
  setLongCache(res, false)
}

const app = express()
app.disable('x-powered-by')
app.use(compression())
app.use(express.json({ limit: '2mb' }))

// Hostinger/LiteSpeed otherwise caches GET /api/* for ~7 days.
app.use('/api', (_req, res, next) => {
  res.setHeader(
    'Cache-Control',
    'private, no-store, no-cache, must-revalidate',
  )
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  next()
})

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

// Belt-and-suspenders: set long cache for static extensions even if LiteSpeed
// or an intermediate strips express.static setHeaders.
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  if ((req.method === 'GET' || req.method === 'HEAD') && STATIC_EXT.test(req.path)) {
    setLongCache(res, req.path.includes('/assets/'))
  }
  next()
})

// Images and other static files live in public/ (not duplicated into dist/).
app.use(
  express.static(PUBLIC, {
    index: false,
    fallthrough: true,
    setHeaders: setStaticCacheHeaders,
  }),
)

app.use(
  express.static(DIST, {
    index: false,
    fallthrough: true,
    setHeaders: setStaticCacheHeaders,
  }),
)

app.get(/^(?!\/api(?:\/|$)).*/, (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()
  res.setHeader('Cache-Control', 'no-cache')
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
  console.log(`[prod-server] serving public from ${PUBLIC}`)
  console.log(`[prod-server] serving app bundle from ${DIST}`)
})

function shutdown() {
  server.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
