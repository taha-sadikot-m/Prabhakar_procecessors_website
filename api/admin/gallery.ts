import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAdmin } from '../_lib/auth'
import { getDb } from '../_lib/db'
import { handleOptions, json, newId, readJsonBody } from '../_lib/http'

function parseMediaType(value: unknown): 'image' | 'video' | null {
  if (value === 'image' || value === 'video') return value
  return null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (!(await requireAdmin(req))) {
    return json(res, 401, { error: 'Unauthorized' })
  }

  const sql = getDb()
  const action = typeof req.query.action === 'string' ? req.query.action : ''

  try {
    if (req.method === 'GET') {
      const sections = await sql`
        SELECT id, title, body, sort_order
        FROM gallery_sections
        ORDER BY sort_order ASC, title ASC
      `
      const items = await sql`
        SELECT id, section_id, drive_url, description, media_type, sort_order
        FROM gallery_items
        ORDER BY sort_order ASC
      `
      return json(res, 200, {
        sections: sections.map((s) => ({
          id: s.id,
          title: s.title,
          body: s.body,
          sortOrder: s.sort_order,
          items: items
            .filter((i) => i.section_id === s.id)
            .map((i) => ({
              id: i.id,
              sectionId: i.section_id,
              driveUrl: i.drive_url,
              description: i.description,
              mediaType: i.media_type === 'image' ? 'image' : 'video',
              sortOrder: i.sort_order,
            })),
        })),
      })
    }

    if (req.method === 'POST' && action === 'section') {
      const body = readJsonBody<{
        id?: string
        title?: string
        body?: string
        sortOrder?: number
      }>(req)
      const title = (body.title ?? '').trim()
      if (!title) return json(res, 400, { error: 'Title required' })
      const id = (body.id ?? newId('gsec')).trim()
      await sql`
        INSERT INTO gallery_sections (id, title, body, sort_order)
        VALUES (
          ${id},
          ${title},
          ${body.body?.trim() || null},
          ${body.sortOrder ?? 0}
        )
      `
      return json(res, 201, { id })
    }

    if (req.method === 'PUT' && action === 'section') {
      const body = readJsonBody<{
        id?: string
        title?: string
        body?: string
        sortOrder?: number
      }>(req)
      if (!body.id) return json(res, 400, { error: 'id required' })
      await sql`
        UPDATE gallery_sections
        SET
          title = ${(body.title ?? '').trim()},
          body = ${body.body?.trim() || null},
          sort_order = ${body.sortOrder ?? 0},
          updated_at = NOW()
        WHERE id = ${body.id}
      `
      return json(res, 200, { ok: true })
    }

    if (req.method === 'DELETE' && action === 'section') {
      const id =
        typeof req.query.id === 'string'
          ? req.query.id
          : readJsonBody<{ id?: string }>(req).id
      if (!id) return json(res, 400, { error: 'id required' })
      await sql`DELETE FROM gallery_sections WHERE id = ${id}`
      return json(res, 200, { ok: true })
    }

    if (req.method === 'POST' && action === 'item') {
      const body = readJsonBody<{
        id?: string
        sectionId?: string
        driveUrl?: string
        description?: string
        mediaType?: string
        sortOrder?: number
      }>(req)
      if (!body.sectionId) return json(res, 400, { error: 'sectionId required' })
      const driveUrl = (body.driveUrl ?? '').trim()
      if (!driveUrl) return json(res, 400, { error: 'driveUrl required' })
      const mediaType = parseMediaType(body.mediaType)
      if (!mediaType) {
        return json(res, 400, { error: 'mediaType required (image or video)' })
      }
      const id = (body.id ?? newId('gitem')).trim()
      await sql`
        INSERT INTO gallery_items (id, section_id, drive_url, description, media_type, sort_order)
        VALUES (
          ${id},
          ${body.sectionId},
          ${driveUrl},
          ${body.description?.trim() || null},
          ${mediaType},
          ${body.sortOrder ?? 0}
        )
      `
      return json(res, 201, { id })
    }

    if (req.method === 'PUT' && action === 'item') {
      const body = readJsonBody<{
        id?: string
        sectionId?: string
        driveUrl?: string
        description?: string
        mediaType?: string
        sortOrder?: number
      }>(req)
      if (!body.id) return json(res, 400, { error: 'id required' })
      const mediaType = parseMediaType(body.mediaType)
      if (!mediaType) {
        return json(res, 400, { error: 'mediaType required (image or video)' })
      }
      await sql`
        UPDATE gallery_items
        SET
          section_id = ${body.sectionId ?? ''},
          drive_url = ${(body.driveUrl ?? '').trim()},
          description = ${body.description?.trim() || null},
          media_type = ${mediaType},
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
      await sql`DELETE FROM gallery_items WHERE id = ${id}`
      return json(res, 200, { ok: true })
    }

    return json(res, 400, { error: 'Unknown action' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gallery admin error'
    return json(res, 500, { error: message })
  }
}
