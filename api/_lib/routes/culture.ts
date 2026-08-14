import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ensureCultureImagesSchema } from '../culture-schema'
import { getDb } from '../db'
import { resolveDriveUrls } from '../drive'
import { handleOptions, json } from '../http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    const sql = getDb()
    await ensureCultureImagesSchema(sql)
    const items = await sql`
      SELECT id, drive_url, caption, sort_order
      FROM culture_images
      ORDER BY sort_order ASC, id ASC
    `

    return json(res, 200, {
      items: items.map((item) => {
        const driveUrl = item.drive_url as string
        const resolved = resolveDriveUrls(driveUrl)
        return {
          id: item.id as string,
          driveUrl,
          caption: (item.caption as string) || '',
          sortOrder: item.sort_order as number,
          previewUrl: resolved.previewUrl,
          viewUrl: resolved.viewUrl,
          thumbUrl: resolved.thumbUrl,
          fileId: resolved.fileId,
        }
      }),
    })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to load culture images'
    return json(res, 500, { error: message })
  }
}
