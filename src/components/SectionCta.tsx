import { Link } from 'react-router-dom'

type SectionCtaProps = {
  label: string
  to: string
  className?: string
  variant?: 'gold' | 'cream' | 'dark'
}

const styles = {
  gold: 'border-gold text-gold hover:border-gold-dark hover:text-gold-dark',
  cream:
    'border-[#D4AF37] text-[#D4AF37] hover:opacity-80',
  dark: 'border-ink/40 text-ink hover:border-gold hover:text-gold',
} as const

export function SectionCta({
  label,
  to,
  className = '',
  variant = 'gold',
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
