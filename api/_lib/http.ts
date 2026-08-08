import type { VercelRequest, VercelResponse } from '@vercel/node'

export function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  )
}

export function handleOptions(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return true
  }
  return false
}

export function json(
  res: VercelResponse,
  status: number,
  body: unknown,
) {
  setCors(res)
  res.status(status).json(body)
}

export function readJsonBody<T>(req: VercelRequest): T {
  return (req.body ?? {}) as T
}

export function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
