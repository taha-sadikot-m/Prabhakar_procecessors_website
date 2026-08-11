import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from '../db'
import { resolveDriveUrls } from '../drive'
import { flattenGallerySchema } from '../gallery-schema'
import { handleOptions, json } from '../http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    const sql = getDb()
    await flattenGallerySchema(sql)
    const items = await sql`
      SELECT id, drive_url, description, media_type, sort_order
      FROM gallery_items
      ORDER BY sort_order ASC, id ASC
    `

    return json(res, 200, {
      items: items.map((item) => {
        const driveUrl = item.drive_url as string
        const resolved = resolveDriveUrls(driveUrl)
        const mediaType = item.media_type === 'image' ? 'image' : 'video'
        return {
          id: item.id as string,
          driveUrl,
          description: (item.description as string | null) ?? null,
          mediaType,
          previewUrl: resolved.previewUrl,
          viewUrl: resolved.viewUrl,
          thumbUrl: resolved.thumbUrl,
          fileId: resolved.fileId,
          videoUrl: mediaType === 'video' ? resolved.videoUrl : null,
        }
      }),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load gallery'
    return json(res, 500, { error: message })
  }
}
