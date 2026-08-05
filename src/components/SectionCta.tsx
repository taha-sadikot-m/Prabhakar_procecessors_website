import { Link } from 'react-router-dom'

type SectionCtaProps = {
  label: string
  to: string
  className?: string
  variant?: 'accent' | 'cream' | 'dark' | 'navy'
}

const styles = {
  /** Mahogany underline + mahogany text (AA on cream) */
  accent:
    'border-mahogany text-mahogany hover:border-mahogany-dark hover:text-mahogany-dark',
  /** Legacy alias — same as navy for light surfaces */
  cream: 'border-mahogany text-heading hover:opacity-80',
  dark: 'border-ink/40 text-ink hover:border-mahogany hover:text-mahogany',
  /** Navy text + mahogany underline — Closing / Future light CTAs */
  navy: 'border-mahogany text-heading hover:opacity-80',
} as const

export function SectionCta({
  label,
  to,
  className = '',
  variant = 'accent',
}: SectionCtaProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 border-b pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors ${styles[variant]} ${className}`}
    >
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  )
}
