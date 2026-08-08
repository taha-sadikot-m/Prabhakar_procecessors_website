import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAdminToken, isAdminLoggedIn } from '../../lib/admin-auth'
import { AdminButton } from './admin-ui'

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/services', label: 'Services', end: false },
  { to: '/admin/gallery', label: 'Gallery', end: false },
  { to: '/admin/testimonials', label: 'Testimonials', end: false },
  { to: '/admin/blog', label: 'Blog', end: false },
]

function navClass({ isActive }: { isActive: boolean }) {
  return `block rounded-lg px-3 py-2.5 font-sans text-sm transition-colors ${
    isActive
      ? 'bg-cream-dark font-medium text-mahogany shadow-[inset_0_0_0_1px_rgba(103,68,56,0.12)]'
      : 'text-ink-muted hover:bg-cream-light hover:text-ink'
  }`
}

function mobileNavClass({ isActive }: { isActive: boolean }) {
  return `shrink-0 rounded-lg px-3 py-2 font-sans text-xs font-semibold tracking-[0.1em] uppercase transition-colors ${
    isActive
      ? 'bg-cream-dark text-mahogany'
      : 'text-ink-muted hover:bg-cream-light hover:text-ink'
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
    <div className="relative min-h-svh bg-cream-light text-ink md:flex">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 45% at 20% -5%, rgba(103,68,56,0.1), transparent), radial-gradient(ellipse 50% 40% at 90% 10%, rgba(247,148,29,0.06), transparent)',
        }}
        aria-hidden="true"
      />

      <aside className="relative z-10 sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-ink/10 bg-cream/90 backdrop-blur-sm md:flex">
        <div className="shrink-0 border-b border-ink/10 px-5 py-6">
          <p className="font-sans text-[10px] font-semibold tracking-[0.18em] text-mahogany uppercase">
            Prabhakar Processors
          </p>
          <p className="mt-1 font-serif text-xl font-medium text-ink">CMS</p>
        </div>
        <nav
          className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4"
          aria-label="Admin"
        >
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
        <div className="mt-auto shrink-0 space-y-2 border-t border-ink/10 px-4 py-4">
          <Link
            to="/"
            className="block rounded-lg px-2 py-1.5 font-sans text-xs font-medium text-ink-muted transition-colors hover:bg-cream-light hover:text-mahogany"
          >
            ← View site
          </Link>
          <AdminButton variant="secondary" className="w-full" onClick={logout}>
            Log out
          </AdminButton>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 shadow-[0_4px_16px_rgba(45,27,14,0.04)] backdrop-blur-md md:hidden">
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
                className="rounded-lg px-2 py-1.5 font-sans text-xs text-ink-muted hover:bg-cream-dark/50 hover:text-mahogany"
              >
                Site
              </Link>
              <AdminButton variant="ghost" onClick={logout}>
                Log out
              </AdminButton>
            </div>
          </div>
          <nav
            className="flex gap-1 overflow-x-auto px-3 pb-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
