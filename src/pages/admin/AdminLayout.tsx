import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAdminToken, isAdminLoggedIn } from '../../lib/admin-auth'
import { AdminButton } from './admin-ui'

const links = [
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/testimonials', label: 'Testimonials' },
]

export function AdminLayout() {
  const navigate = useNavigate()

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  function logout() {
    clearAdminToken()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-svh bg-cream-light text-ink">
      <header className="sticky top-0 z-40 border-b border-mahogany/30 bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold tracking-[0.18em] text-mahogany uppercase">
              Prabhakar Processors
            </p>
            <p className="font-serif text-2xl font-medium text-ink">Admin</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 font-sans text-xs font-semibold tracking-[0.12em] uppercase transition-colors ${
                    isActive
                      ? 'bg-mahogany text-cream'
                      : 'border border-mahogany/30 bg-cream text-ink hover:border-mahogany hover:text-mahogany'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <AdminButton variant="secondary" onClick={logout}>
              Logout
            </AdminButton>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-8 md:py-10">
        <Outlet />
      </div>
    </div>
  )
}
