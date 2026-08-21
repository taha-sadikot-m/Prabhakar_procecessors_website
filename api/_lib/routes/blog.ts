import type { VercelRequest, VercelResponse } from '@vercel/node'
import { mapBlogRow, toPublicBlogPost } from '../blog'
import { getDb } from '../db'
import { handleOptions, json } from '../http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    const sql = getDb()
    const slug =
      typeof req.query.slug === 'string' ? req.query.slug.trim() : ''

    if (slug) {
      const rows = await sql`
        SELECT *
        FROM blog_posts
        WHERE slug = ${slug} AND published = TRUE
        LIMIT 1
      `
      if (!rows.length) {
        return json(res, 404, { error: 'Post not found' })
      }
      return json(res, 200, {
        post: toPublicBlogPost(mapBlogRow(rows[0] as Record<string, unknown>)),
      })
    }

    const rows = await sql`
      SELECT *
      FROM blog_posts
      WHERE published = TRUE
      ORDER BY published_at DESC, sort_order ASC, title ASC
    `
    return json(res, 200, {
      posts: rows.map((row) =>
        toPublicBlogPost(mapBlogRow(row as Record<string, unknown>)),
      ),
    })
  } catch (err) {
    console.error('[api/blog]', err)
    const message = err instanceof Error ? err.message : 'Failed to load blog'
    return json(res, 500, { error: message })
  }
}
