import { SignJWT, jwtVerify } from 'jose'
import type { VercelRequest } from '@vercel/node'

const encoder = new TextEncoder()

function secretKey() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')
  return encoder.encode(secret)
}

export async function signAdminToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secretKey())
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey())
  return payload.role === 'admin'
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
