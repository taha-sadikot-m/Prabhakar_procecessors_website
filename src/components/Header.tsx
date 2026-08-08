import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from '../assets/logo'
import { navLinks } from '../data/content'

const ACCENT = '#674438'
const MAHOGANY = '#674438'

const pageLinks = navLinks.filter((link) => link.href !== '/contact')

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        open
          ? 'border-b border-[#674438]/25 bg-cream'
          : scrolled
            ? 'border-b border-[#674438]/25 bg-cream/95 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5 md:px-8 lg:px-10 xl:grid-cols-[1fr_auto_1fr]">
        <div className="justify-self-start">
          <Logo />
        </div>

        <nav
          className="hidden items-center justify-center gap-5 xl:flex xl:gap-7 xl:justify-self-center"
          aria-label="Primary"
        >
          {pageLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              end={link.href === '/'}
              className={({ isActive }) =>
                `group relative font-sans text-[10px] font-medium tracking-[0.12em] uppercase transition-colors hover:text-ink ${
                  isActive ? 'text-ink' : 'text-ink/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute inset-x-0 -bottom-1 h-px origin-left transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                    style={{ backgroundColor: ACCENT }}
                    aria-hidden="true"
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3 justify-self-end">
          <Link
            to="/contact"
            className="hidden rounded-lg bg-mahogany px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.16em] text-cream uppercase shadow-[0_2px_8px_rgba(103,68,56,0.25)] transition-colors hover:bg-mahogany-dark lg:inline-block"
          >
            Contact
          </Link>

          <button
            type="button"
            className={`relative z-50 flex h-11 w-11 items-center justify-center rounded-full border transition-colors xl:hidden ${
              open
                ? 'border-[#674438] text-[#674438]'
                : 'border-ink/25 hover:border-[#674438] hover:text-mahogany'
            }`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex w-4 flex-col gap-[5px]">
              <span
                className={`h-[1.5px] w-full bg-current transition-transform duration-300 ${
                  open ? 'translate-y-[6.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-[1.5px] w-full bg-current transition-opacity duration-300 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`h-[1.5px] w-full bg-current transition-transform duration-300 ${
                  open ? '-translate-y-[6.5px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[68px] bottom-0 z-40 flex flex-col overflow-y-auto bg-cream"
            style={{ backgroundColor: '#FAF0E6' }}
          >
            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-8">
              <p
                className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
                style={{ color: MAHOGANY }}
              >
                Menu
              </p>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Menu">
                {pageLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <NavLink
                      to={link.href}
                      end={link.href === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block border-b border-line/80 py-4 font-sans text-sm font-medium tracking-[0.16em] uppercase transition-colors hover:text-mahogany ${
                          isActive ? 'text-mahogany' : 'text-ink'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto pt-10 pb-6">
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-lg bg-mahogany px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.16em] text-cream uppercase shadow-[0_2px_8px_rgba(103,68,56,0.25)] transition-colors hover:bg-mahogany-dark"
                >
                  Contact
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
