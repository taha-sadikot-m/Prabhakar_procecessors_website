import { Link } from 'react-router-dom'
import { Logo } from '../assets/logo'
import { company, navLinks } from '../data/content'
import { GoogleMapEmbed } from './GoogleMapEmbed'

const ACCENT = '#674438'

const footerNavLinks = [...navLinks, { label: 'Blog', href: '/blog' }]

function SectionLabel({ children }: { children: string }) {
  return (
    <>
      <p
        className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase"
        style={{ color: ACCENT }}
      >
        {children}
      </p>
      <span
        className="mt-2 mb-3.5 block h-px w-8"
        style={{ backgroundColor: ACCENT }}
        aria-hidden="true"
      />
    </>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-[#674438]/30 bg-cream-dark text-ink">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-3 md:gap-10 md:px-8 md:py-12 lg:px-10">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-ink-muted">
            {company.tagline}
          </p>
          <p className="mt-2 font-sans text-[11px] tracking-[0.06em] text-ink/45">
            {company.legalName}
          </p>
        </div>

        <div>
          <SectionLabel>Explore</SectionLabel>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
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
          <SectionLabel>Contact</SectionLabel>
          <div className="space-y-2 font-sans text-sm">
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
            <address className="space-y-0.5 text-ink-muted not-italic">
              {company.address.lines.map((line) => (
                <span key={line} className="block text-[13px] leading-snug">
                  {line}
                </span>
              ))}
            </address>
            <GoogleMapEmbed
              className="mt-4 h-36 w-full sm:h-40"
              roundedClassName="rounded-lg"
              showOpenLink
              title="Mill location map"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-[#674438]/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-5 py-4 font-sans text-xs text-ink-muted sm:flex-row sm:flex-wrap sm:gap-3 md:px-8 lg:px-10">
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
          <span
            className="hidden h-1 w-1 rotate-45 sm:inline-block"
            style={{ backgroundColor: ACCENT }}
            aria-hidden="true"
          />
          <p>
            Designed &amp; Developed By{' '}
            <a
              href="https://www.magolabs.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink-muted transition-colors hover:text-mahogany"
            >
              Mago Labs
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
