import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from '../db'
import { handleOptions, json } from '../http'

function dbHost(): string | null {
  const url = process.env.DATABASE_URL
  if (!url) return null
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  const host = dbHost()
  if (!process.env.DATABASE_URL) {
    return json(res, 200, {
      ok: true,
      db: { ok: false, error: 'DATABASE_URL is not configured' },
    })
  }

  try {
    const sql = getDb()
    const [
      serviceCategories,
      serviceCards,
      galleryItems,
      cultureImages,
      testimonials,
      blogPosts,
      contactMessages,
      jobApplications,
    ] = await Promise.all([
      sql`SELECT COUNT(*)::int AS c FROM service_categories`,
      sql`SELECT COUNT(*)::int AS c FROM service_cards`,
      sql`SELECT COUNT(*)::int AS c FROM gallery_items`,
      sql`SELECT COUNT(*)::int AS c FROM culture_images`,
      sql`SELECT COUNT(*)::int AS c FROM testimonials`,
      sql`SELECT COUNT(*)::int AS c FROM blog_posts`,
      sql`SELECT COUNT(*)::int AS c FROM contact_messages`,
      sql`SELECT COUNT(*)::int AS c FROM job_applications`,
    ])

    return json(res, 200, {
      ok: true,
      db: {
        ok: true,
        host,
        counts: {
          service_categories: Number(serviceCategories[0]?.c ?? 0),
          service_cards: Number(serviceCards[0]?.c ?? 0),
          gallery_items: Number(galleryItems[0]?.c ?? 0),
          culture_images: Number(cultureImages[0]?.c ?? 0),
          testimonials: Number(testimonials[0]?.c ?? 0),
          blog_posts: Number(blogPosts[0]?.c ?? 0),
          contact_messages: Number(contactMessages[0]?.c ?? 0),
          job_applications: Number(jobApplications[0]?.c ?? 0),
        },
      },
    })
  } catch (err) {
    console.error('[api/health]', err)
    return json(res, 200, {
      ok: true,
      db: {
        ok: false,
        host,
        error: err instanceof Error ? err.message : 'Database check failed',
      },
    })
  }
}
