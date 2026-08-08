import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from './_lib/db'
import { resolveDriveUrls } from './_lib/drive'
import { handleOptions, json } from './_lib/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    const sql = getDb()
    const sections = await sql`
      SELECT id, title, body, sort_order
      FROM gallery_sections
      ORDER BY sort_order ASC, title ASC
    `
    const items = await sql`
      SELECT id, section_id, drive_url, description, sort_order
      FROM gallery_items
      ORDER BY sort_order ASC
    `

    const result = sections.map((section) => ({
      id: section.id as string,
      title: section.title as string,
      body: (section.body as string | null) ?? null,
      items: items
        .filter((item) => item.section_id === section.id)
        .map((item) => {
          const driveUrl = item.drive_url as string
          const resolved = resolveDriveUrls(driveUrl)
          return {
            id: item.id as string,
            driveUrl,
            description: (item.description as string | null) ?? null,
            previewUrl: resolved.previewUrl,
            viewUrl: resolved.viewUrl,
            thumbUrl: resolved.thumbUrl,
            fileId: resolved.fileId,
          }
        }),
    }))

    return json(res, 200, { sections: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load gallery'
    return json(res, 500, { error: message })
  }
}
