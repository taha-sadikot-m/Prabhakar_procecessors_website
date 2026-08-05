type RibbonAccentProps = {
  className?: string
  from?: string
  to?: string
}

export function RibbonAccent({
  className = '',
  from = '#C8C2B8',
  to = '#674438',
}: RibbonAccentProps) {
  const id = `ribbon-${from.replace('#', '')}-${to.replace('#', '')}`

  return (
    <svg
      className={`pointer-events-none h-16 w-full overflow-visible ${className}`}
      viewBox="0 0 1200 80"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="40" x2="1200" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <path
        d="M0 50 C200 20, 400 70, 600 40 S1000 10, 1200 45"
        stroke={`url(#${id})`}
        strokeWidth="2"
        strokeOpacity="0.55"
      />
    </svg>
  )
}
