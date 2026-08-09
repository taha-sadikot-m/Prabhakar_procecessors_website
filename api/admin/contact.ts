import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAdmin } from '../_lib/auth'
import { getDb } from '../_lib/db'
import { handleOptions, json, readJsonBody } from '../_lib/http'

async function ensureTable() {
  const sql = getDb()
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (!(await requireAdmin(req))) {
    return json(res, 401, { error: 'Unauthorized' })
  }

  try {
    await ensureTable()
    const sql = getDb()

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, name, email, phone, subject, message, created_at
        FROM contact_messages
        ORDER BY created_at DESC
      `
      return json(res, 200, {
        messages: rows.map((row) => ({
          id: row.id as string,
          name: row.name as string,
          email: row.email as string,
          phone: (row.phone as string) || '',
          subject: row.subject as string,
          message: row.message as string,
          createdAt: row.created_at as string,
        })),
      })
    }

    if (req.method === 'DELETE') {
      const id =
        typeof req.query.id === 'string'
          ? req.query.id
          : readJsonBody<{ id?: string }>(req).id
      if (!id) return json(res, 400, { error: 'id required' })
      await sql`DELETE FROM contact_messages WHERE id = ${id}`
      return json(res, 200, { ok: true })
    }

    return json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Contact admin error'
    return json(res, 500, { error: message })
  }
}
