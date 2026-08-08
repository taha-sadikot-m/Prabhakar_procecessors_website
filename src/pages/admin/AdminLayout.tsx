import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAdminToken, isAdminLoggedIn } from '../../lib/admin-auth'
import { AdminButton } from './admin-ui'

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/services', label: 'Services', end: false },
  { to: '/admin/gallery', label: 'Gallery', end: false },
  { to: '/admin/testimonials', label: 'Testimonials', end: false },
]

function navClass({ isActive }: { isActive: boolean }) {
  return `block border-l-2 px-3 py-2 font-sans text-sm transition-colors ${
    isActive
      ? 'border-mahogany bg-cream font-medium text-mahogany'
      : 'border-transparent text-ink-muted hover:border-mahogany/30 hover:text-ink'
  }`
}

function mobileNavClass({ isActive }: { isActive: boolean }) {
  return `shrink-0 px-3 py-2 font-sans text-xs font-semibold tracking-[0.1em] uppercase transition-colors ${
    isActive
      ? 'border-b-2 border-mahogany text-mahogany'
      : 'border-b-2 border-transparent text-ink-muted hover:text-ink'
  }`
}

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
    <div className="min-h-svh bg-cream-light text-ink md:flex">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-cream md:flex">
        <div className="border-b border-line px-5 py-6">
          <p className="font-sans text-[10px] font-semibold tracking-[0.18em] text-mahogany uppercase">
            Prabhakar Processors
          </p>
          <p className="mt-1 font-serif text-xl font-medium text-ink">CMS</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4" aria-label="Admin">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={navClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-2 border-t border-line px-4 py-4">
          <Link
            to="/"
            className="block font-sans text-xs font-medium text-ink-muted hover:text-mahogany"
          >
            ← View site
          </Link>
          <AdminButton variant="secondary" className="w-full" onClick={logout}>
            Log out
          </AdminButton>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur-md md:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-sans text-[10px] font-semibold tracking-[0.16em] text-mahogany uppercase">
                Admin
              </p>
              <p className="font-serif text-lg font-medium text-ink">CMS</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="font-sans text-xs text-ink-muted hover:text-mahogany"
              >
                Site
              </Link>
              <AdminButton variant="ghost" onClick={logout}>
                Log out
              </AdminButton>
            </div>
          </div>
          <nav
            className="flex gap-1 overflow-x-auto px-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Admin"
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={mobileNavClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-10">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
