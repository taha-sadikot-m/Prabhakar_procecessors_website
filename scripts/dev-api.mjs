/**
 * Local Express bridge that mounts the same Vercel api handlers.
 * Used by `npm run dev` so /api works without the Vercel CLI.
 */
import http from 'node:http'
import express from 'express'
import health from '../api/_lib/routes/health.ts'
import services from '../api/_lib/routes/services.ts'
import gallery from '../api/_lib/routes/gallery.ts'
import driveMedia from '../api/_lib/routes/drive-media.ts'
import testimonials from '../api/_lib/routes/testimonials.ts'
import blog from '../api/_lib/routes/blog.ts'
import contact from '../api/_lib/routes/contact.ts'
import careers from '../api/_lib/routes/careers.ts'
import adminLogin from '../api/_lib/routes/admin/login.ts'
import adminServices from '../api/_lib/routes/admin/services.ts'
import adminGallery from '../api/_lib/routes/admin/gallery.ts'
import adminTestimonials from '../api/_lib/routes/admin/testimonials.ts'
import adminBlog from '../api/_lib/routes/admin/blog.ts'
import adminCareers from '../api/_lib/routes/admin/careers.ts'
import adminContact from '../api/_lib/routes/admin/contact.ts'

const PORT = Number(process.env.DEV_API_PORT) || 8787

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
      console.error('[dev-api]', err)
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
app.all('/api/admin/login', mount(adminLogin))
app.all('/api/admin/services', mount(adminServices))
app.all('/api/admin/gallery', mount(adminGallery))
app.all('/api/admin/testimonials', mount(adminTestimonials))
app.all('/api/admin/blog', mount(adminBlog))
app.all('/api/admin/careers', mount(adminCareers))
app.all('/api/admin/contact', mount(adminContact))

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found' })
})

const server = http.createServer(app)

server.on('error', (err) => {
  const code = err && typeof err === 'object' && 'code' in err ? err.code : ''
  if (code === 'EADDRINUSE') {
    console.error(
      `[dev-api] failed to bind :${PORT}: listen EADDRINUSE: address already in use ::: ${PORT}`,
    )
    console.error(
      '[dev-api] Free the port or set DEV_API_PORT to a free port, then retry.',
    )
    process.exit(1)
  }
  console.error('[dev-api]', err)
  process.exit(1)
})

server.listen(PORT, () => {
  console.log(`[dev-api] listening on http://localhost:${PORT}`)
})

function shutdown() {
  server.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
