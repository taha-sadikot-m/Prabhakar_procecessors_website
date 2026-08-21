import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from '../db'
import { handleOptions, json } from '../http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    const sql = getDb()
    const rows = await sql`
      SELECT id, partner_type, years, quote, sort_order
      FROM testimonials
      ORDER BY sort_order ASC, years DESC
    `
    return json(res, 200, {
      quotes: rows.map((row) => ({
        id: row.id as string,
        type: row.partner_type as string,
        years: Number(row.years),
        quote: row.quote as string,
      })),
    })
  } catch (err) {
    console.error('[api/testimonials]', err)
    const message =
      err instanceof Error ? err.message : 'Failed to load testimonials'
    return json(res, 500, { error: message })
  }
}
