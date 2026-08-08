import {
  useEffect,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { Link } from 'react-router-dom'

const surface =
  'border border-ink/10 bg-cream shadow-[0_1px_2px_rgba(45,27,14,0.04),0_8px_24px_rgba(45,27,14,0.06)]'
const surfaceInset = 'border border-ink/10 bg-cream-light'
const fieldFocus =
  'focus:border-mahogany focus:ring-2 focus:ring-mahogany/20 focus:ring-offset-0'

export function AdminPageHeader({
  title,
  children,
  meta,
  actions,
  busy,
}: {
  title: string
  children?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  busy?: boolean
}) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-ink/10 pb-6">
      <div className="min-w-0 max-w-2xl">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink md:text-[2rem]">
            {title}
          </h1>
          {meta && (
            <span className="rounded-md bg-cream-dark/80 px-2 py-0.5 font-sans text-xs font-medium tracking-[0.08em] text-ink-muted uppercase">
              {meta}
            </span>
          )}
          {busy && (
            <span className="inline-flex items-center gap-2 font-sans text-xs font-medium text-mahogany">
              <AdminSpinner className="size-3.5" />
              Saving…
            </span>
          )}
        </div>
        {children && (
          <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
            {children}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  )
}

export function AdminSpinner({ className = 'size-8' }: { className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-mahogany/20 border-t-mahogany ${className}`}
      aria-hidden="true"
    />
  )
}

export function AdminLoading({
  label = 'Loading…',
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-xl border border-ink/10 bg-cream px-6 py-16 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <AdminSpinner className="size-9" />
      <p className="font-sans text-sm font-medium tracking-[0.06em] text-ink-muted">
        {label}
      </p>
    </div>
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
      className={`rounded-2xl ${surface} p-5 md:p-6 ${className}`}
    >
      {title && (
        <h2 className="font-sans text-[11px] font-semibold tracking-[0.14em] text-mahogany uppercase">
          {title}
        </h2>
      )}
      <div className={title ? 'mt-4' : undefined}>{children}</div>
    </section>
  )
}

export function AdminDisclosure({
  title,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = controlledOpen ?? internalOpen
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <div className={`mb-6 overflow-hidden rounded-xl ${surface}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-cream-light"
        aria-expanded={open}
      >
        <span className="font-sans text-[11px] font-semibold tracking-[0.14em] text-mahogany uppercase">
          {title}
        </span>
        <span
          className="flex size-7 items-center justify-center rounded-md bg-cream-dark/60 font-sans text-sm text-ink-muted"
          aria-hidden="true"
        >
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="border-t border-ink/10 bg-cream-light/50 px-5 py-5">
          {children}
        </div>
      )}
    </div>
  )
}

export function AdminNestedBlock({
  title,
  subtitle,
  meta,
  open,
  onToggle,
  actions,
  children,
}: {
  title: ReactNode
  subtitle?: ReactNode
  meta?: ReactNode
  open: boolean
  onToggle: () => void
  actions?: ReactNode
  children: ReactNode
}) {
  const panelId = useId()

  return (
    <section className={`overflow-hidden rounded-xl ${surface}`}>
      <div className="flex flex-wrap items-start gap-3 px-4 py-3.5 md:px-5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="min-w-0 flex-1 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-mahogany/40"
        >
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-serif text-xl font-medium text-ink md:text-[1.35rem]">
              {title}
            </span>
            {meta && (
              <span className="rounded-md bg-cream-dark/80 px-2 py-0.5 font-sans text-[11px] font-medium tracking-[0.08em] text-ink-muted uppercase">
                {meta}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 line-clamp-2 font-sans text-sm text-ink-muted">
              {subtitle}
            </p>
          )}
        </button>
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          <button
            type="button"
            onClick={onToggle}
            className="rounded-md px-2 py-1.5 font-sans text-xs text-ink-muted transition-colors hover:bg-cream-dark/60 hover:text-ink"
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            {open ? '▴' : '▾'}
          </button>
        </div>
      </div>
      {open && (
        <div
          id={panelId}
          className="border-t border-ink/10 bg-cream-light/40 px-4 py-5 md:px-5"
        >
          {children}
        </div>
      )}
    </section>
  )
}

export function AdminList({ children }: { children: ReactNode }) {
  return <ul className="m-0 list-none space-y-3 p-0">{children}</ul>
}

export function AdminListItem({
  title,
  meta,
  description,
  media,
  actions,
  children,
}: {
  title?: ReactNode
  meta?: ReactNode
  description?: ReactNode
  media?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}) {
  if (children) {
    return (
      <li className={`rounded-xl ${surfaceInset} px-4 py-4`}>{children}</li>
    )
  }

  return (
    <li className={`rounded-xl ${surfaceInset} px-4 py-4`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-start gap-4">
          {media}
          <div className="min-w-0 flex-1">
            {title && (
              <p className="font-sans text-base font-semibold text-ink">
                {title}
              </p>
            )}
            {meta && (
              <p className="mt-1 font-sans text-xs font-medium tracking-[0.06em] text-mahogany uppercase">
                {meta}
              </p>
            )}
            {description && (
              <div className="mt-1.5 font-sans text-sm leading-relaxed text-ink-muted">
                {description}
              </div>
            )}
          </div>
        </div>
        {actions && <AdminActions>{actions}</AdminActions>}
      </div>
    </li>
  )
}

export function AdminError({ children }: { children: ReactNode }) {
  return (
    <p
      className="mb-6 rounded-xl border border-crimson/35 bg-crimson/5 px-4 py-3 font-sans text-sm font-medium text-crimson"
      role="alert"
    >
      {children}
    </p>
  )
}

export function AdminEmpty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-ink/15 bg-cream-dark/40 px-5 py-10 text-center font-sans text-sm text-ink-muted">
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
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  className?: string
  mono?: boolean
  autoComplete?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="font-sans text-xs font-medium text-ink-muted">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className={`mt-1.5 w-full rounded-lg border border-ink/10 bg-cream-light px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 ${fieldFocus} ${
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
      <span className="font-sans text-xs font-medium text-ink-muted">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 w-full resize-y rounded-lg border border-ink/10 bg-cream-light px-3 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink/35 ${fieldFocus}`}
      />
    </label>
  )
}

export function AdminSelect({
  label,
  value,
  onChange,
  options,
  className = '',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="font-sans text-xs font-medium text-ink-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 w-full rounded-lg border border-ink/10 bg-cream-light px-3 py-2.5 font-sans text-sm text-ink outline-none transition-colors ${fieldFocus}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-mahogany text-cream shadow-[0_2px_8px_rgba(103,68,56,0.25)] hover:bg-mahogany-dark hover:shadow-[0_4px_14px_rgba(103,68,56,0.3)] disabled:bg-mahogany/40 disabled:text-cream/80 disabled:shadow-none',
  secondary:
    'border border-ink/10 bg-cream text-ink hover:border-mahogany/50 hover:bg-cream-light hover:text-mahogany disabled:border-ink/10 disabled:text-ink/35',
  danger:
    'border border-crimson/40 bg-cream text-crimson hover:bg-crimson hover:text-cream disabled:border-crimson/20 disabled:text-crimson/40',
  ghost:
    'border border-transparent bg-transparent text-ink-muted hover:bg-cream-dark/50 hover:text-ink disabled:text-ink/30',
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 font-sans text-xs font-semibold tracking-[0.08em] transition-all disabled:cursor-not-allowed ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/** @deprecated Prefer AdminListItem — kept for gradual migration */
export function AdminRow({ children }: { children: ReactNode }) {
  return (
    <li className={`rounded-xl ${surfaceInset} px-4 py-4`}>{children}</li>
  )
}

export function AdminActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">{children}</div>
  )
}

export function AdminStatCard({
  label,
  value,
  description,
  to,
}: {
  label: string
  value: string | number
  description: string
  to: string
}) {
  return (
    <Link
      to={to}
      className={`group relative block overflow-hidden rounded-2xl ${surface} p-5 transition-all hover:-translate-y-0.5 hover:border-mahogany/35 hover:shadow-[0_8px_28px_rgba(45,27,14,0.1)]`}
    >
      <span
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-mahogany via-saffron/80 to-transparent opacity-80 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
      <p className="font-sans text-[11px] font-semibold tracking-[0.14em] text-mahogany uppercase">
        {label}
      </p>
      <p className="mt-3 font-serif text-3xl font-medium text-ink">{value}</p>
      <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
        {description}
      </p>
      <p className="mt-4 font-sans text-xs font-semibold tracking-[0.1em] text-ink transition-colors group-hover:text-mahogany">
        Open →
      </p>
    </Link>
  )
}

export function AdminModal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-[#2d1b0e]/50 backdrop-blur-[3px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative z-10 flex max-h-[92svh] w-full flex-col border border-ink/10 bg-cream shadow-[0_24px_60px_rgba(45,27,14,0.22)] rounded-t-2xl sm:max-h-[85svh] sm:rounded-2xl ${
          wide ? 'sm:max-w-xl' : 'sm:max-w-lg'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-ink/10 px-5 py-4">
          <h2 className="font-serif text-xl font-medium text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 font-sans text-sm text-ink-muted transition-colors hover:bg-cream-dark/70 hover:text-ink"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  )
}

export function AdminSplit({
  master,
  detail,
  masterLabel = 'Browse',
}: {
  master: ReactNode
  detail: ReactNode
  masterLabel?: string
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] md:items-start md:gap-5">
      <aside
        className={`overflow-hidden rounded-2xl ${surface} md:sticky md:top-6 md:max-h-[calc(100svh-6rem)] md:overflow-y-auto`}
      >
        <p className="border-b border-ink/10 bg-cream-dark/30 px-4 py-2.5 font-sans text-[10px] font-semibold tracking-[0.14em] text-ink-muted uppercase md:hidden">
          {masterLabel}
        </p>
        {master}
      </aside>
      <div className="min-w-0">{detail}</div>
    </div>
  )
}

export function AdminMasterItem({
  title,
  meta,
  active,
  onClick,
}: {
  title: ReactNode
  meta?: ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={`mx-1.5 my-0.5 flex w-[calc(100%-0.75rem)] items-start gap-2 rounded-lg px-3 py-2.5 text-left transition-colors ${
        active
          ? 'bg-cream-dark text-mahogany shadow-[inset_0_0_0_1px_rgba(103,68,56,0.12)]'
          : 'text-ink hover:bg-cream-light'
      }`}
    >
      <span className="min-w-0 flex-1">
        <span
          className={`block font-sans text-sm font-medium ${
            active ? 'text-mahogany' : 'text-ink'
          }`}
        >
          {title}
        </span>
        {meta && (
          <span className="mt-0.5 block font-sans text-[11px] text-ink-muted">
            {meta}
          </span>
        )}
      </span>
    </button>
  )
}
