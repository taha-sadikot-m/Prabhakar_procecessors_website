import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleOptions, json } from '../http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' })
  }
  return json(res, 200, { ok: true })
}
