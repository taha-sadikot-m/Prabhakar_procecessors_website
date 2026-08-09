import type { VercelRequest, VercelResponse } from '@vercel/node'
import { json } from './_lib/http'
import health from './_lib/routes/health'
import services from './_lib/routes/services'
import gallery from './_lib/routes/gallery'
import driveMedia from './_lib/routes/drive-media'
import testimonials from './_lib/routes/testimonials'
import blog from './_lib/routes/blog'
import contact from './_lib/routes/contact'
import careers from './_lib/routes/careers'
import adminLogin from './_lib/routes/admin/login'
import adminServices from './_lib/routes/admin/services'
import adminGallery from './_lib/routes/admin/gallery'
import adminTestimonials from './_lib/routes/admin/testimonials'
import adminBlog from './_lib/routes/admin/blog'
import adminCareers from './_lib/routes/admin/careers'
import adminContact from './_lib/routes/admin/contact'

type ApiHandler = (
  req: VercelRequest,
  res: VercelResponse,
) => unknown | Promise<unknown>

const routes: Record<string, ApiHandler> = {
  health,
  services,
  gallery,
  'drive-media': driveMedia,
  testimonials,
  blog,
  contact,
  careers,
  'admin/login': adminLogin,
  'admin/services': adminServices,
  'admin/gallery': adminGallery,
  'admin/testimonials': adminTestimonials,
  'admin/blog': adminBlog,
  'admin/careers': adminCareers,
  'admin/contact': adminContact,
}

function resolvePath(req: VercelRequest): string {
  const raw = req.query.path
  if (Array.isArray(raw)) {
    return raw.filter((p) => typeof p === 'string' && p.length > 0).join('/')
  }
  if (typeof raw === 'string' && raw.length > 0) {
    return raw.replace(/^\/+|\/+$/g, '')
  }
  const urlPath = (req.url ?? '').split('?')[0] ?? ''
  return urlPath.replace(/^\/api\/?/, '').replace(/^\/+|\/+$/g, '')
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const path = resolvePath(req)
  const route = routes[path]
  if (!route) {
    return json(res, 404, { error: 'API route not found' })
  }
  return route(req, res)
}
