import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAdmin } from '../_lib/auth'
import { getDb } from '../_lib/db'
import { handleOptions, json, newId, readJsonBody } from '../_lib/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (!(await requireAdmin(req))) {
    return json(res, 401, { error: 'Unauthorized' })
  }

  const sql = getDb()

  try {
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, partner_type, years, quote, sort_order
        FROM testimonials
        ORDER BY sort_order ASC, years DESC
      `
      return json(res, 200, {
        quotes: rows.map((row) => ({
          id: row.id,
          type: row.partner_type,
          years: Number(row.years),
          quote: row.quote,
          sortOrder: row.sort_order,
        })),
      })
    }

    if (req.method === 'POST') {
      const body = readJsonBody<{
        id?: string
        type?: string
        years?: number
        quote?: string
        sortOrder?: number
      }>(req)
      const type = (body.type ?? '').trim()
      const quote = (body.quote ?? '').trim()
      if (!type || !quote) {
        return json(res, 400, { error: 'type and quote required' })
      }
      const id = (body.id ?? newId('tst')).trim()
      await sql`
        INSERT INTO testimonials (id, partner_type, years, quote, sort_order)
        VALUES (
          ${id},
          ${type},
          ${Number(body.years) || 0},
          ${quote},
          ${body.sortOrder ?? 0}
        )
      `
      return json(res, 201, { id })
    }

    if (req.method === 'PUT') {
      const body = readJsonBody<{
        id?: string
        type?: string
        years?: number
        quote?: string
        sortOrder?: number
      }>(req)
      if (!body.id) return json(res, 400, { error: 'id required' })
      await sql`
        UPDATE testimonials
        SET
          partner_type = ${(body.type ?? '').trim()},
          years = ${Number(body.years) || 0},
          quote = ${(body.quote ?? '').trim()},
          sort_order = ${body.sortOrder ?? 0},
          updated_at = NOW()
        WHERE id = ${body.id}
      `
      return json(res, 200, { ok: true })
    }

    if (req.method === 'DELETE') {
      const id =
        typeof req.query.id === 'string'
          ? req.query.id
          : readJsonBody<{ id?: string }>(req).id
      if (!id) return json(res, 400, { error: 'id required' })
      await sql`DELETE FROM testimonials WHERE id = ${id}`
      return json(res, 200, { ok: true })
    }

    return json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Testimonials admin error'
    return json(res, 500, { error: message })
  }
}
