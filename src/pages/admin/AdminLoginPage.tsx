import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminLogin } from '../../lib/cms-api'
import { setAdminToken } from '../../lib/admin-auth'
import { AdminButton, AdminError, AdminField, AdminPanel } from './admin-ui'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { token } = await adminLogin(username, password)
      setAdminToken(token)
      navigate('/admin/services', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-cream-light px-5 py-10">
      <form onSubmit={onSubmit} className="w-full max-w-md">
        <AdminPanel>
          <p className="font-sans text-[11px] font-semibold tracking-[0.18em] text-mahogany uppercase">
            Admin
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium text-ink md:text-4xl">
            Sign in
          </h1>
          <p className="mt-2 font-sans text-sm text-ink-muted">
            Manage services, gallery, and testimonials for the public site.
          </p>

          <div className="mt-8 space-y-5">
            <AdminField
              label="Username"
              value={username}
              onChange={setUsername}
              autoComplete="username"
              required
            />
            <AdminField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="mt-5 [&_p]:mb-0">
              <AdminError>{error}</AdminError>
            </div>
          )}

          <AdminButton
            type="submit"
            variant="primary"
            disabled={loading}
            className="mt-6 w-full"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </AdminButton>

          <p className="mt-6 font-sans text-sm text-ink">
            <Link
              to="/"
              className="font-medium text-mahogany underline-offset-4 hover:underline"
            >
              ← Back to site
            </Link>
          </p>
        </AdminPanel>
      </form>
    </main>
  )
}
