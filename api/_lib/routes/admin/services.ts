import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAdmin } from '../../auth'
import { getDb } from '../../db'
import { handleOptions, json, newId, readJsonBody } from '../../http'
import { ensureServicesSchema } from '../../services-schema'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (!(await requireAdmin(req))) {
    return json(res, 401, { error: 'Unauthorized' })
  }

  const sql = getDb()
  const action = typeof req.query.action === 'string' ? req.query.action : ''

  try {
    await ensureServicesSchema(sql)

    if (req.method === 'GET') {
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
      return json(res, 200, {
        categories: categories.map((cat) => ({
          id: cat.id,
          title: cat.title,
          numeral: cat.numeral,
          intro: cat.intro,
          sortOrder: cat.sort_order,
          services: cards
            .filter((c) => c.category_id === cat.id)
            .map((c) => ({
              id: c.id,
              categoryId: c.category_id,
              name: c.name,
              description: c.description,
              imageUrl: c.image_url,
              sortOrder: c.sort_order,
            })),
        })),
      })
    }

    if (req.method === 'POST' && action === 'category') {
      const body = readJsonBody<{
        id?: string
        title?: string
        numeral?: string
        intro?: string
        sortOrder?: number
      }>(req)
      const id = (body.id ?? newId('cat')).trim()
      const title = (body.title ?? '').trim()
      if (!title) return json(res, 400, { error: 'Title required' })
      await sql`
        INSERT INTO service_categories (id, title, numeral, intro, sort_order)
        VALUES (
          ${id},
          ${title},
          ${(body.numeral ?? '').trim()},
          ${(body.intro ?? '').trim()},
          ${body.sortOrder ?? 0}
        )
      `
      return json(res, 201, { id })
    }

    if (req.method === 'PUT' && action === 'category') {
      const body = readJsonBody<{
        id?: string
        title?: string
        numeral?: string
        intro?: string
        sortOrder?: number
      }>(req)
      if (!body.id) return json(res, 400, { error: 'id required' })
      await sql`
        UPDATE service_categories
        SET
          title = ${(body.title ?? '').trim()},
          numeral = ${(body.numeral ?? '').trim()},
          intro = ${(body.intro ?? '').trim()},
          sort_order = ${body.sortOrder ?? 0},
          updated_at = NOW()
        WHERE id = ${body.id}
      `
      return json(res, 200, { ok: true })
    }

    if (req.method === 'DELETE' && action === 'category') {
      const id =
        typeof req.query.id === 'string'
          ? req.query.id
          : readJsonBody<{ id?: string }>(req).id
      if (!id) return json(res, 400, { error: 'id required' })
      await sql`DELETE FROM service_categories WHERE id = ${id}`
      return json(res, 200, { ok: true })
    }

    if (req.method === 'POST' && action === 'card') {
      const body = readJsonBody<{
        id?: string
        categoryId?: string
        name?: string
        description?: string
        imageUrl?: string
        sortOrder?: number
      }>(req)
      if (!body.categoryId) return json(res, 400, { error: 'categoryId required' })
      const name = (body.name ?? '').trim()
      if (!name) return json(res, 400, { error: 'name required' })
      const id = (body.id ?? newId('svc')).trim()
      await sql`
        INSERT INTO service_cards (id, category_id, name, description, image_url, sort_order)
        VALUES (
          ${id},
          ${body.categoryId},
          ${name},
          ${(body.description ?? '').trim()},
          ${(body.imageUrl ?? '').trim()},
          ${body.sortOrder ?? 0}
        )
      `
      return json(res, 201, { id })
    }

    if (req.method === 'PUT' && action === 'card') {
      const body = readJsonBody<{
        id?: string
        categoryId?: string
        name?: string
        description?: string
        imageUrl?: string
        sortOrder?: number
      }>(req)
      if (!body.id) return json(res, 400, { error: 'id required' })
      await sql`
        UPDATE service_cards
        SET
          category_id = ${body.categoryId ?? ''},
          name = ${(body.name ?? '').trim()},
          description = ${(body.description ?? '').trim()},
          image_url = ${(body.imageUrl ?? '').trim()},
          sort_order = ${body.sortOrder ?? 0},
          updated_at = NOW()
        WHERE id = ${body.id}
      `
      return json(res, 200, { ok: true })
    }

    if (req.method === 'DELETE' && action === 'card') {
      const id =
        typeof req.query.id === 'string'
          ? req.query.id
          : readJsonBody<{ id?: string }>(req).id
      if (!id) return json(res, 400, { error: 'id required' })
      await sql`DELETE FROM service_cards WHERE id = ${id}`
      return json(res, 200, { ok: true })
    }

    return json(res, 400, { error: 'Unknown action' })
  } catch (err) {
    console.error('[api/admin/services]', err)
    const message = err instanceof Error ? err.message : 'Services admin error'
    return json(res, 500, { error: message })
  }
}
