import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAdmin } from '../../auth'
import { ensureCultureImagesSchema } from '../../culture-schema'
import { getDb } from '../../db'
import { handleOptions, json, newId, readJsonBody } from '../../http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (!(await requireAdmin(req))) {
    return json(res, 401, { error: 'Unauthorized' })
  }

  const sql = getDb()
  const action = typeof req.query.action === 'string' ? req.query.action : ''

  try {
    await ensureCultureImagesSchema(sql)

    if (req.method === 'GET') {
      const items = await sql`
        SELECT id, drive_url, caption, sort_order
        FROM culture_images
        ORDER BY sort_order ASC, id ASC
      `
      return json(res, 200, {
        items: items.map((i) => ({
          id: i.id,
          driveUrl: i.drive_url,
          caption: (i.caption as string) || '',
          sortOrder: i.sort_order,
        })),
      })
    }

    if (req.method === 'POST' && action === 'item') {
      const body = readJsonBody<{
        id?: string
        driveUrl?: string
        caption?: string
        sortOrder?: number
      }>(req)
      const driveUrl = (body.driveUrl ?? '').trim()
      if (!driveUrl) return json(res, 400, { error: 'driveUrl required' })
      const id = (body.id ?? newId('cult')).trim()
      await sql`
        INSERT INTO culture_images (id, drive_url, caption, sort_order)
        VALUES (
          ${id},
          ${driveUrl},
          ${(body.caption ?? '').trim()},
          ${body.sortOrder ?? 0}
        )
      `
      return json(res, 201, { id })
    }

    if (req.method === 'PUT' && action === 'item') {
      const body = readJsonBody<{
        id?: string
        driveUrl?: string
        caption?: string
        sortOrder?: number
      }>(req)
      if (!body.id) return json(res, 400, { error: 'id required' })
      const driveUrl = (body.driveUrl ?? '').trim()
      if (!driveUrl) return json(res, 400, { error: 'driveUrl required' })
      await sql`
        UPDATE culture_images
        SET
          drive_url = ${driveUrl},
          caption = ${(body.caption ?? '').trim()},
          sort_order = ${body.sortOrder ?? 0},
          updated_at = NOW()
        WHERE id = ${body.id}
      `
      return json(res, 200, { ok: true })
    }

    if (req.method === 'DELETE' && action === 'item') {
      const id =
        typeof req.query.id === 'string'
          ? req.query.id
          : readJsonBody<{ id?: string }>(req).id
      if (!id) return json(res, 400, { error: 'id required' })
      await sql`DELETE FROM culture_images WHERE id = ${id}`
      return json(res, 200, { ok: true })
    }

    return json(res, 400, { error: 'Unknown action' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Culture admin error'
    return json(res, 500, { error: message })
  }
}
