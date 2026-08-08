import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminLogin } from '../../lib/cms-api'
import { setAdminToken } from '../../lib/admin-auth'
import { AdminButton, AdminError, AdminField } from './admin-ui'

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
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center bg-cream-light px-5 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(103,68,56,0.12), transparent)',
        }}
        aria-hidden="true"
      />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md border border-line bg-cream px-6 py-8 shadow-[0_1px_0_rgba(45,27,14,0.04)] md:px-8 md:py-10"
      >
        <p className="font-sans text-[11px] font-semibold tracking-[0.18em] text-mahogany uppercase">
          Prabhakar Processors
        </p>
        <h1 className="mt-2 font-serif text-3xl font-medium text-ink md:text-[2rem]">
          Sign in to CMS
        </h1>
        <p className="mt-2 font-sans text-sm text-ink-muted">
          Manage services, gallery, and testimonials.
        </p>

        <div className="mt-8 space-y-4">
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
          className="mt-6 w-full tracking-[0.12em] uppercase"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </AdminButton>

        <p className="mt-6 font-sans text-sm text-ink-muted">
          <Link to="/" className="text-mahogany hover:underline">
            ← Back to site
          </Link>
        </p>
      </form>
    </main>
  )
}
