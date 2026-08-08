import { useState, type FormEvent } from 'react'
import { contactPage } from '../data/content'

const MAHOGANY = '#674438'

const fieldClass =
  'mt-1.5 w-full rounded-lg border border-line bg-cream-light px-4 py-3 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-mahogany'

const labelClass =
  'block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase'

export function ContactForm() {
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      subject: String(data.get('subject') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    }

    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = (await res.json().catch(() => ({}))) as {
        error?: string
        ok?: boolean
      }
      if (!res.ok) {
        throw new Error(json.error || 'Could not send your message.')
      }
      setSubmitted(true)
      form.reset()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not send your message.',
      )
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-mahogany/30 bg-cream px-6 py-10 md:px-8 md:py-12">
        <p
          className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase"
          style={{ color: MAHOGANY }}
        >
          {contactPage.formSuccessEyebrow}
        </p>
        <h3 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
          {contactPage.formSuccessTitle}
        </h3>
        <span className="mt-4 block h-px w-10 bg-mahogany" aria-hidden="true" />
        <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
          {contactPage.formSuccessBody}
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg border border-mahogany/45 bg-transparent px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.18em] text-mahogany uppercase transition-all hover:border-mahogany hover:bg-mahogany/5"
        >
          Send Another Message
          <span aria-hidden="true">→</span>
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-mahogany/20 bg-cream px-5 py-8 md:px-8 md:py-10"
      noValidate={false}
    >
      <p
        className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase"
        style={{ color: MAHOGANY }}
      >
        {contactPage.formTitle}
      </p>
      <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
        {contactPage.formBody}
      </p>

      <div className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Full Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              maxLength={120}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              maxLength={200}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              Phone <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={40}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="contact-subject" className={labelClass}>
              Subject
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              required
              maxLength={200}
              defaultValue={contactPage.ctaMailSubject}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClass}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            maxLength={5000}
            className={`${fieldClass} resize-y`}
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-crimson/35 bg-crimson/5 px-4 py-3 font-sans text-sm text-crimson"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-mahogany px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.18em] text-cream uppercase shadow-[0_2px_10px_rgba(103,68,56,0.28)] transition-all hover:bg-mahogany-dark disabled:cursor-not-allowed disabled:bg-mahogany/45 disabled:shadow-none"
      >
        {sending ? 'Sending…' : 'Send Enquiry'}
        {!sending && <span aria-hidden="true">→</span>}
      </button>
    </form>
  )
}
