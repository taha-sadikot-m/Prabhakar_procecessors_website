import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAdmin } from '../_lib/auth'
import { getDb } from '../_lib/db'
import { handleOptions, json, readJsonBody } from '../_lib/http'

async function ensureTable() {
  const sql = getDb()
  await sql`
    CREATE TABLE IF NOT EXISTS job_applications (
      id TEXT PRIMARY KEY,
      department TEXT NOT NULL,
      city TEXT NOT NULL,
      full_name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL,
      qualification TEXT NOT NULL,
      experience TEXT NOT NULL,
      current_company TEXT NOT NULL DEFAULT '',
      expected_salary TEXT NOT NULL DEFAULT '',
      resume_url TEXT NOT NULL,
      remarks TEXT NOT NULL DEFAULT '',
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
        SELECT
          id,
          department,
          city,
          full_name,
          mobile,
          email,
          qualification,
          experience,
          current_company,
          expected_salary,
          resume_url,
          remarks,
          created_at
        FROM job_applications
        ORDER BY created_at DESC
      `
      return json(res, 200, {
        applications: rows.map((row) => ({
          id: row.id as string,
          department: row.department as string,
          city: row.city as string,
          fullName: row.full_name as string,
          mobile: row.mobile as string,
          email: row.email as string,
          qualification: row.qualification as string,
          experience: row.experience as string,
          currentCompany: (row.current_company as string) || '',
          expectedSalary: (row.expected_salary as string) || '',
          resumeUrl: row.resume_url as string,
          remarks: (row.remarks as string) || '',
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
      await sql`DELETE FROM job_applications WHERE id = ${id}`
      return json(res, 200, { ok: true })
    }

    return json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Careers admin error'
    return json(res, 500, { error: message })
  }
}
