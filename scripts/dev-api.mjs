/**
 * Local Express bridge that mounts the same Vercel api/*.ts handlers.
 * Used by `npm run dev` so /api works without the Vercel CLI.
 */
import express from 'express'
import health from '../api/health.ts'
import services from '../api/services.ts'
import gallery from '../api/gallery.ts'
import driveMedia from '../api/drive-media.ts'
import testimonials from '../api/testimonials.ts'
import blog from '../api/blog.ts'
import contact from '../api/contact.ts'
import careers from '../api/careers.ts'
import adminLogin from '../api/admin/login.ts'
import adminServices from '../api/admin/services.ts'
import adminGallery from '../api/admin/gallery.ts'
import adminTestimonials from '../api/admin/testimonials.ts'
import adminBlog from '../api/admin/blog.ts'
import adminCareers from '../api/admin/careers.ts'
import adminContact from '../api/admin/contact.ts'

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

app.listen(PORT, () => {
  console.log(`[dev-api] listening on http://localhost:${PORT}`)
})
