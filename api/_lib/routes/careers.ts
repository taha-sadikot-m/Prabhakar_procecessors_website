import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb } from '../db'
import { careersNotifyTo, notifyOrLog } from '../email'
import { handleOptions, json, newId, readJsonBody } from '../http'

type CareersBody = {
  department?: string
  city?: string
  fullName?: string
  mobile?: string
  email?: string
  qualification?: string
  experience?: string
  currentCompany?: string
  expectedSalary?: string
  resumeUrl?: string
  remarks?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isHttpUrl(value: string) {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

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
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  try {
    const body = readJsonBody<CareersBody>(req)
    const department = (body.department ?? '').trim()
    const city = (body.city ?? '').trim()
    const fullName = (body.fullName ?? '').trim()
    const mobile = (body.mobile ?? '').trim()
    const email = (body.email ?? '').trim().toLowerCase()
    const qualification = (body.qualification ?? '').trim()
    const experience = (body.experience ?? '').trim()
    const currentCompany = (body.currentCompany ?? '').trim()
    const expectedSalary = (body.expectedSalary ?? '').trim()
    const resumeUrl = (body.resumeUrl ?? '').trim()
    const remarks = (body.remarks ?? '').trim()

    if (!department || department.length > 200) {
      return json(res, 400, { error: 'Please select a department.' })
    }
    if (!city || city.length > 120) {
      return json(res, 400, { error: 'Please enter your current city.' })
    }
    if (!fullName || fullName.length > 120) {
      return json(res, 400, { error: 'Please enter your full name.' })
    }
    if (!mobile || mobile.length > 40) {
      return json(res, 400, { error: 'Please enter a valid mobile number.' })
    }
    if (!email || !EMAIL_RE.test(email) || email.length > 200) {
      return json(res, 400, { error: 'Please enter a valid email address.' })
    }
    if (!qualification || qualification.length > 200) {
      return json(res, 400, { error: 'Please enter your qualification.' })
    }
    if (!experience || experience.length > 200) {
      return json(res, 400, { error: 'Please enter your work experience.' })
    }
    if (currentCompany.length > 200) {
      return json(res, 400, { error: 'Current company is too long.' })
    }
    if (expectedSalary.length > 120) {
      return json(res, 400, { error: 'Expected salary is too long.' })
    }
    if (!resumeUrl || !isHttpUrl(resumeUrl) || resumeUrl.length > 2000) {
      return json(res, 400, {
        error: 'Please paste a valid resume link (https://…).',
      })
    }
    if (remarks.length > 5000) {
      return json(res, 400, { error: 'Remarks are too long.' })
    }

    await ensureTable()
    const sql = getDb()
    const id = newId('app')
    await sql`
      INSERT INTO job_applications (
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
        remarks
      )
      VALUES (
        ${id},
        ${department},
        ${city},
        ${fullName},
        ${mobile},
        ${email},
        ${qualification},
        ${experience},
        ${currentCompany},
        ${expectedSalary},
        ${resumeUrl},
        ${remarks}
      )
    `

    await notifyOrLog('careers', {
      to: careersNotifyTo(),
      subject: `New job application: ${department} — ${fullName}`,
      replyTo: email,
      text: [
        'A new job application was submitted on the website.',
        '',
        `Department: ${department}`,
        `City: ${city}`,
        `Full name: ${fullName}`,
        `Mobile: ${mobile}`,
        `Email: ${email}`,
        `Qualification: ${qualification}`,
        `Experience: ${experience}`,
        `Current company: ${currentCompany || '(none)'}`,
        `Expected salary: ${expectedSalary || '(none)'}`,
        `Resume: ${resumeUrl}`,
        '',
        'Remarks:',
        remarks || '(none)',
        '',
        `Application ID: ${id}`,
      ].join('\n'),
    })

    return json(res, 200, { ok: true, id })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to submit application'
    return json(res, 500, { error: message })
  }
}
