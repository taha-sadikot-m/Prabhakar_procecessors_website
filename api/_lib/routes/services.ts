import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from '../db'
import { handleOptions, json } from '../http'
import { ensureServicesSchema } from '../services-schema'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    const sql = getDb()
    await ensureServicesSchema(sql)
    const categories = await sql`
      SELECT id, title, numeral, intro, sort_order
      FROM service_categories
      ORDER BY sort_order ASC, title ASC
    `
    const cards = await sql`
      SELECT id, category_id, name, description, image_url, sort_order
      FROM service_cards
      ORDER BY sort_order ASC, name ASC
    `

    const result = categories.map((cat) => ({
      id: cat.id as string,
      title: cat.title as string,
      numeral: cat.numeral as string,
      intro: cat.intro as string,
      services: cards
        .filter((c) => c.category_id === cat.id)
        .map((c) => ({
          id: c.id as string,
          name: c.name as string,
          description: c.description as string,
          image: c.image_url as string,
        })),
    }))

    return json(res, 200, { categories: result })
  } catch (err) {
    console.error('[api/services]', err)
    const message = err instanceof Error ? err.message : 'Failed to load services'
    return json(res, 500, { error: message })
  }
}
