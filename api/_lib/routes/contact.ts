import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from '../db'
import { handleOptions, json, newId, readJsonBody } from '../http'

type ContactBody = {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    const body = readJsonBody<ContactBody>(req)
    const name = (body.name ?? '').trim()
    const email = (body.email ?? '').trim().toLowerCase()
    const phone = (body.phone ?? '').trim()
    const subject = (body.subject ?? '').trim()
    const message = (body.message ?? '').trim()

    if (!name || name.length > 120) {
      return json(res, 400, { error: 'Please enter your name.' })
    }
    if (!email || !EMAIL_RE.test(email) || email.length > 200) {
      return json(res, 400, { error: 'Please enter a valid email address.' })
    }
    if (phone.length > 40) {
      return json(res, 400, { error: 'Phone number is too long.' })
    }
    if (!subject || subject.length > 200) {
      return json(res, 400, { error: 'Please enter a subject.' })
    }
    if (!message || message.length > 5000) {
      return json(res, 400, { error: 'Please enter a message.' })
    }

    await ensureTable()
    const sql = getDb()
    const id = newId('msg')
    await sql`
      INSERT INTO contact_messages (id, name, email, phone, subject, message)
      VALUES (${id}, ${name}, ${email}, ${phone}, ${subject}, ${message})
    `

    return json(res, 200, { ok: true, id })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to send your message'
    return json(res, 500, { error: message })
  }
}
