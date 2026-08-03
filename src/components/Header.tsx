import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from '../assets/logo'
import { navLinks } from '../data/content'

const GOLD = '#D4AF37'

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
        scrolled || open
          ? 'border-b border-[#D4AF37]/25 bg-cream/95 backdrop-blur-md'
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
          {navLinks
            .filter((link) => link.href !== '#contact')
            .map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group relative font-sans text-[10px] font-medium tracking-[0.12em] text-ink/80 uppercase transition-colors hover:text-ink"
              >
                {link.label}
                <span
                  className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{ backgroundColor: GOLD }}
                  aria-hidden="true"
                />
              </a>
            ))}
        </nav>

        <div className="flex items-center justify-end gap-3 justify-self-end">
          <a
            href="#contact"
            className="hidden font-sans text-[11px] font-semibold tracking-[0.16em] text-[#D4AF37] uppercase transition-opacity hover:opacity-75 lg:inline-block"
          >
            Contact
          </a>

          <button
            type="button"
            className={`relative z-50 flex h-11 w-11 items-center justify-center rounded-full border transition-colors xl:hidden ${
              open
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-ink/25 hover:border-[#D4AF37] hover:text-[#D4AF37]'
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
            className="fixed inset-0 top-[68px] z-40 flex flex-col bg-cream"
          >
            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-8">
              <p
                className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
                style={{ color: GOLD }}
              >
                Menu
              </p>
              <nav
                className="mt-6 flex flex-col gap-1"
                aria-label="Menu"
              >
                {navLinks
                  .filter((link) => link.href !== '#contact')
                  .map((link, i) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      onClick={() => setOpen(false)}
                      className="border-b border-line/80 py-4 font-sans text-sm font-medium tracking-[0.16em] text-ink uppercase transition-colors hover:text-[#D4AF37]"
                    >
                      {link.label}
                    </motion.a>
                  ))}
              </nav>

              <div className="mt-auto pt-10 pb-6">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="relative inline-block font-sans text-[0.9rem] font-medium tracking-[0.12em] uppercase"
                  style={{ color: GOLD }}
                >
                  Contact
                  <span aria-hidden="true"> →</span>
                  <span
                    className="absolute inset-x-0 -bottom-0.5 h-px"
                    style={{ backgroundColor: GOLD }}
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
