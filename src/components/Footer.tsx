import { Link } from 'react-router-dom'
import { Logo } from '../assets/logo'
import { company, navLinks } from '../data/content'

const ACCENT = '#674438'

const footerNavLinks = [...navLinks, { label: 'Blog', href: '/blog' }]

export function Footer() {
  return (
    <footer className="border-t border-[#674438]/30 bg-cream-dark text-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-3 md:gap-10 md:px-8 lg:px-10 lg:py-20">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-ink-muted">
            {company.tagline}
          </p>
          <p className="mt-3 font-sans text-[11px] tracking-[0.06em] text-ink/45">
            {company.legalName}
          </p>
        </div>

        <div>
          <p
            className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase"
            style={{ color: ACCENT }}
          >
            Navigate
          </p>
          <span
            className="mt-2.5 mb-5 block h-px w-8"
            style={{ backgroundColor: ACCENT }}
            aria-hidden="true"
          />
          <ul className="space-y-2.5">
            {footerNavLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="font-sans text-sm text-ink-muted transition-colors hover:text-mahogany"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p
            className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase"
            style={{ color: ACCENT }}
          >
            Contact
          </p>
          <span
            className="mt-2.5 mb-5 block h-px w-8"
            style={{ backgroundColor: ACCENT }}
            aria-hidden="true"
          />
          <div className="space-y-3 font-sans text-sm">
            <a
              href={`tel:${company.phone.replace(/\s/g, '')}`}
              className="block font-medium text-ink transition-colors hover:text-mahogany"
            >
              {company.phone}
            </a>
            <a
              href={`mailto:${company.email}`}
              className="block font-medium text-ink transition-colors hover:text-mahogany"
            >
              {company.email}
            </a>
            <address className="mt-5 space-y-1 text-ink-muted not-italic">
              {company.address.lines.map((line) => (
                <span key={line} className="block text-[13px] leading-relaxed">
                  {line}
                </span>
              ))}
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-[#674438]/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-5 py-5 font-sans text-xs text-ink-muted sm:flex-row sm:gap-3 md:px-8 lg:px-10">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights
            reserved.
          </p>
          <span
            className="hidden h-1 w-1 rotate-45 sm:inline-block"
            style={{ backgroundColor: ACCENT }}
            aria-hidden="true"
          />
          <p>Surat, Gujarat, India</p>
        </div>
      </div>
    </footer>
  )
}
