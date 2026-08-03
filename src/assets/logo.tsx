import { Link } from 'react-router-dom'

type LogoProps = {
  className?: string
  showText?: boolean
  variant?: 'light' | 'dark'
}

export function Logo({ className = '', showText = true, variant = 'dark' }: LogoProps) {
  const nameColor = variant === 'light' ? 'text-cream' : 'text-ink'
  const sinceColor = variant === 'light' ? 'text-gold-soft' : 'text-gold'

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label="Prabhakar Processors home"
    >
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="22" cy="22" r="20.5" stroke="#B76E2A" strokeWidth="1.25" />
        <path
          d="M12 32V12h10.2c4.55 0 7.55 2.7 7.55 6.65 0 2.85-1.55 5.05-4.2 5.95L32 32h-3.85l-5.55-6.15H15.4V32H12zm3.4-9.55h6.55c2.45 0 3.95-1.35 3.95-3.35s-1.5-3.35-3.95-3.35H15.4v6.7z"
          fill="#B76E2A"
        />
        <path
          d="M14.5 10.5c4.2-1.8 9.5-1.6 13.2 1.1"
          stroke="#B76E2A"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M13.2 13c3.8-1.5 8.4-1.4 11.7 0.9"
          stroke="#B76E2A"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.35"
        />

      </svg>
      {showText && (
        <span className="flex flex-col leading-tight">
          <span
            className={`font-sans text-[11px] font-semibold tracking-[0.18em] uppercase sm:text-xs ${nameColor}`}
          >
            Prabhakar Processors
          </span>
          <span
            className={`font-sans text-[9px] font-medium tracking-[0.28em] uppercase sm:text-[10px] ${sinceColor}`}
          >
            Since 2009
          </span>
        </span>
      )}
    </Link>
  )
}
