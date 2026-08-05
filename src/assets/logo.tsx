import { Link } from 'react-router-dom'

const LOCKUP = '/logo/prabhakar-processors-logo.svg'
const MARK = '/logo/prabhakar-processors-mark.svg'

type LogoProps = {
  className?: string
  /** Needle mark without the wordmark — for spaces too tight to read the text. */
  markOnly?: boolean
}

export function Logo({ className = '', markOnly = false }: LogoProps) {
  const src = markOnly ? MARK : LOCKUP

  return (
    <Link to="/" className={`inline-flex items-center ${className}`}>
      <img
        src={src}
        alt="Prabhakar Processors"
        width={markOnly ? 340 : 1583}
        height={418}
        className={`w-auto ${markOnly ? 'h-9 sm:h-10' : 'h-10 sm:h-11'}`}
      />
    </Link>
  )
}
