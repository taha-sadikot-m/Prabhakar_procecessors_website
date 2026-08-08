import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function AdminPageHeader({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <header className="mb-8">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
        {title}
      </h1>
      {children && (
        <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
          {children}
        </p>
      )}
    </header>
  )
}

export function AdminPanel({
  title,
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`border border-mahogany/30 bg-cream p-5 md:p-6 ${className}`}
    >
      {title && (
        <h2 className="font-sans text-xs font-semibold tracking-[0.14em] text-mahogany uppercase">
          {title}
        </h2>
      )}
      <div className={title ? 'mt-4' : undefined}>{children}</div>
    </section>
  )
}

export function AdminError({ children }: { children: ReactNode }) {
  return (
    <p
      className="mb-6 border border-crimson/40 bg-cream px-4 py-3 font-sans text-sm font-medium text-crimson"
      role="alert"
    >
      {children}
    </p>
  )
}

export function AdminEmpty({ children }: { children: ReactNode }) {
  return (
    <p className="border border-dashed border-mahogany/35 bg-cream px-5 py-8 text-center font-sans text-sm text-ink-muted">
      {children}
    </p>
  )
}

export function AdminField({
  label,
  value,
  onChange,
  type = 'text',
  className = '',
  mono = false,
  autoComplete,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  className?: string
  mono?: boolean
  autoComplete?: string
  required?: boolean
}) {
  return (
    <label className={`block ${className}`}>
      <span className="font-sans text-xs font-semibold tracking-[0.06em] text-ink">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        className={`mt-1.5 w-full border border-mahogany/40 bg-cream-light px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-mahogany focus:ring-1 focus:ring-mahogany ${
          mono ? 'font-mono text-[13px]' : 'font-sans'
        }`}
      />
    </label>
  )
}

export function AdminTextArea({
  label,
  value,
  onChange,
  className = '',
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  className?: string
  rows?: number
}) {
  return (
    <label className={`block ${className}`}>
      <span className="font-sans text-xs font-semibold tracking-[0.06em] text-ink">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full resize-y border border-mahogany/40 bg-cream-light px-3 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-mahogany focus:ring-1 focus:ring-mahogany"
      />
    </label>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-mahogany text-cream hover:bg-mahogany-dark disabled:bg-mahogany/40 disabled:text-cream/80',
  secondary:
    'border border-mahogany bg-cream text-mahogany hover:bg-cream-dark disabled:border-mahogany/30 disabled:text-mahogany/40',
  danger:
    'border border-crimson bg-cream text-crimson hover:bg-crimson hover:text-cream disabled:border-crimson/30 disabled:text-crimson/40',
  ghost:
    'border border-transparent bg-transparent text-ink underline-offset-4 hover:underline disabled:text-ink-muted',
}

export function AdminButton({
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] uppercase transition-colors disabled:cursor-not-allowed ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function AdminRow({ children }: { children: ReactNode }) {
  return (
    <li className="border border-mahogany/25 bg-cream-light px-4 py-4">
      {children}
    </li>
  )
}

export function AdminActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">{children}</div>
  )
}
