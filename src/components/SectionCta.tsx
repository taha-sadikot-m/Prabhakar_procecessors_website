import { Link } from 'react-router-dom'

type SectionCtaProps = {
  label: string
  to: string
  className?: string
  variant?: 'accent' | 'outline' | 'light' | 'cream' | 'dark' | 'navy'
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.18em] uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mahogany/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream'

const styles = {
  /** Filled mahogany — primary action */
  accent:
    'bg-mahogany text-cream shadow-[0_2px_10px_rgba(103,68,56,0.28)] hover:bg-mahogany-dark hover:shadow-[0_4px_16px_rgba(103,68,56,0.34)]',
  /** Bordered mahogany — secondary action on light surfaces */
  outline:
    'border border-mahogany/45 bg-transparent text-mahogany hover:border-mahogany hover:bg-mahogany/5',
  /** Cream fill — primary action on dark / closing bands */
  light:
    'bg-cream text-mahogany shadow-[0_2px_10px_rgba(45,27,14,0.18)] hover:bg-cream-light',
  /** Legacy aliases */
  cream:
    'border border-mahogany/45 bg-transparent text-mahogany hover:border-mahogany hover:bg-mahogany/5',
  dark:
    'border border-mahogany/45 bg-transparent text-mahogany hover:border-mahogany hover:bg-mahogany/5',
  navy:
    'border border-mahogany/45 bg-transparent text-heading hover:border-mahogany hover:bg-mahogany/5',
} as const

function isExternalOrHash(to: string) {
  return (
    to.startsWith('#') ||
    to.startsWith('mailto:') ||
    to.startsWith('tel:') ||
    to.startsWith('http://') ||
    to.startsWith('https://')
  )
}

export function SectionCta({
  label,
  to,
  className = '',
  variant = 'accent',
}: SectionCtaProps) {
  const classNames = `${base} ${styles[variant]} ${className}`

  if (isExternalOrHash(to)) {
    return (
      <a href={to} className={classNames}>
        {label}
        <span aria-hidden="true">→</span>
      </a>
    )
  }

  return (
    <Link to={to} className={classNames}>
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  )
}
