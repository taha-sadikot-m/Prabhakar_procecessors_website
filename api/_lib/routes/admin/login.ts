import type { VercelRequest, VercelResponse } from '@vercel/node'
import { checkStaticCredentials, signAdminToken } from '../../auth'
import { handleOptions, json, readJsonBody } from '../../http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    const body = readJsonBody<{ username?: string; password?: string }>(req)
    const username = (body.username ?? '').trim()
    const password = body.password ?? ''
    if (!username || !password) {
      return json(res, 400, { error: 'Username and password required' })
    }
    if (!checkStaticCredentials(username, password)) {
      return json(res, 401, { error: 'Invalid credentials' })
    }
    const token = await signAdminToken()
    return json(res, 200, { token })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed'
    return json(res, 500, { error: message })
  }
}
