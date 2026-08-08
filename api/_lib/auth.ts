import { createHmac, timingSafeEqual } from 'node:crypto'
import type { VercelRequest } from '@vercel/node'

const TOKEN_TTL_SEC = 12 * 60 * 60

function secretKey() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')
  return secret
}

function base64UrlEncode(input: string | Buffer) {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64UrlDecode(input: string) {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/')
  const padLen = (4 - (padded.length % 4)) % 4
  return Buffer.from(padded + '='.repeat(padLen), 'base64')
}

function signHs256(data: string, secret: string) {
  return createHmac('sha256', secret).update(data).digest()
}

export async function signAdminToken() {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const payload = base64UrlEncode(
    JSON.stringify({
      role: 'admin',
      iat: now,
      exp: now + TOKEN_TTL_SEC,
    }),
  )
  const data = `${header}.${payload}`
  const signature = base64UrlEncode(signHs256(data, secretKey()))
  return `${data}.${signature}`
}

export async function verifyAdminToken(token: string) {
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [headerB64, payloadB64, signatureB64] = parts
  const data = `${headerB64}.${payloadB64}`
  const expected = signHs256(data, secretKey())
  const actual = base64UrlDecode(signatureB64)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return false
  }
  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64).toString('utf8')) as {
      role?: string
      exp?: number
    }
    if (payload.role !== 'admin') return false
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
      return false
    }
    return true
  } catch {
    return false
  }
}

export function readBearer(req: VercelRequest): string | null {
  const header = req.headers.authorization
  if (!header || typeof header !== 'string') return null
  const [scheme, token] = header.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null
  return token
}

export async function requireAdmin(req: VercelRequest) {
  const token = readBearer(req)
  if (!token) return false
  try {
    return await verifyAdminToken(token)
  } catch {
    return false
  }
}

export function checkStaticCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME
  const expectedPass = process.env.ADMIN_PASSWORD
  if (!expectedUser || !expectedPass) {
    throw new Error('ADMIN_USERNAME / ADMIN_PASSWORD are not configured')
  }
  return username === expectedUser && password === expectedPass
}
