import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { careersPage } from '../data/content'
import { submitJobApplication } from '../lib/cms-api'
import { SectionCta } from './SectionCta'

const MAHOGANY = '#674438'

const fieldClass =
  'w-full rounded-lg border border-line bg-cream px-4 py-3 font-sans text-sm text-ink outline-none transition-colors focus:border-mahogany'

const labelClass =
  'mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase'

const STEPS = careersPage.form.steps

export function JobApplicationForm() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [announce, setAnnounce] = useState('')
  const stepRefs = useRef<(HTMLFieldSetElement | null)[]>([])
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const prevStep = useRef<number | null>(null)

  useEffect(() => {
    if (submitted) return
    setAnnounce(`Step ${step + 1} of ${STEPS.length}: ${STEPS[step].title}`)
    if (prevStep.current !== null && prevStep.current !== step) {
      headingRefs.current[step]?.focus({ preventScroll: true })
    }
    prevStep.current = step
  }, [step, submitted])

  const validateStep = (index: number) => {
    const fieldset = stepRefs.current[index]
    if (!fieldset) return true
    const invalid = fieldset.querySelector<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >(':invalid')
    if (invalid) {
      invalid.reportValidity()
      invalid.focus()
      return false
    }
    return true
  }

  const goNext = () => {
    if (!validateStep(step)) return
    setError(null)
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }

  const goBack = () => {
    setError(null)
    setStep((s) => Math.max(0, s - 1))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (step < STEPS.length - 1) {
      goNext()
      return
    }
    if (!validateStep(step)) return

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      department: String(data.get('department') ?? ''),
      city: String(data.get('city') ?? ''),
      fullName: String(data.get('fullName') ?? ''),
      mobile: String(data.get('mobile') ?? ''),
      email: String(data.get('email') ?? ''),
      qualification: String(data.get('qualification') ?? ''),
      experience: String(data.get('experience') ?? ''),
      currentCompany: String(data.get('currentCompany') ?? ''),
      expectedSalary: String(data.get('expectedSalary') ?? ''),
      resumeUrl: String(data.get('resumeUrl') ?? ''),
      remarks: String(data.get('remarks') ?? ''),
    }

    setSubmitting(true)
    setError(null)
    try {
      await submitJobApplication(payload)
      setSubmitted(true)
      setAnnounce('Application submitted. Thank you.')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit application',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const onKeyDownContinue = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      goNext()
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-mahogany/30 bg-cream px-6 py-10 md:px-10 md:py-12">
        <p
          className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase"
          style={{ color: MAHOGANY }}
        >
          Application received
        </p>
        <h3 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
          Thank you.
        </h3>
        <span className="mt-4 block h-px w-10 bg-mahogany" aria-hidden="true" />
        <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
          Your application has been submitted. Our HR team will review your
          details and resume link, and follow up if there is a match.
        </p>
        <SectionCta label="Back to Home" to="/" className="mt-8" />
      </div>
    )
  }

  return (
    <form
      className="space-y-8 rounded-xl border border-mahogany/20 bg-cream px-5 py-8 md:px-8 md:py-10"
      onSubmit={onSubmit}
      noValidate={false}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </div>

      <ol
        className="flex list-none items-start gap-0 p-0"
        aria-label="Application steps"
      >
        {STEPS.map((s, i) => {
          const done = i < step
          const current = i === step
          return (
            <li key={s.id} className="flex flex-1 items-start last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <span
                  aria-current={current ? 'step' : undefined}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg font-sans text-[11px] font-semibold tracking-wider ${
                    current || done
                      ? 'bg-mahogany text-cream'
                      : 'border border-mahogany/25 text-ink/40'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={`hidden font-sans text-[10px] font-medium tracking-[0.14em] uppercase sm:block ${
                    current
                      ? 'text-mahogany'
                      : done
                        ? 'text-ink/55'
                        : 'text-ink/40'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="mx-3 mt-4 h-px flex-1 overflow-hidden bg-mahogany/15"
                  aria-hidden="true"
                >
                  <div
                    className="h-full origin-left bg-mahogany transition-transform duration-500 ease-out"
                    style={{ transform: `scaleX(${done ? 1 : 0})` }}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-crimson/30 bg-crimson/5 px-4 py-3 font-sans text-sm text-crimson"
        >
          {error}
        </p>
      )}

      <fieldset
        ref={(el) => {
          stepRefs.current[0] = el
        }}
        hidden={step !== 0}
        className="min-w-0 space-y-5 border-0 p-0"
      >
        <legend className="sr-only">{STEPS[0].title}</legend>
        <h3
          ref={(el) => {
            headingRefs.current[0] = el
          }}
          tabIndex={-1}
          className="font-serif text-2xl font-medium tracking-tight text-ink outline-none md:text-[1.75rem]"
        >
          {STEPS[0].title}
        </h3>

        <div>
          <label htmlFor="department" className={labelClass}>
            Department Applying For
          </label>
          <select
            id="department"
            name="department"
            required
            className={fieldClass}
            defaultValue=""
          >
            <option value="" disabled>
              Select a department
            </option>
            {careersPage.form.departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className={labelClass}>
            Current City
          </label>
          <input id="city" name="city" required className={fieldClass} />
        </div>
      </fieldset>

      <fieldset
        ref={(el) => {
          stepRefs.current[1] = el
        }}
        hidden={step !== 1}
        className="min-w-0 space-y-5 border-0 p-0"
      >
        <legend className="sr-only">{STEPS[1].title}</legend>
        <h3
          ref={(el) => {
            headingRefs.current[1] = el
          }}
          tabIndex={-1}
          className="font-serif text-2xl font-medium tracking-tight text-ink outline-none md:text-[1.75rem]"
        >
          {STEPS[1].title}
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className={labelClass}>
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              required
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="mobile" className={labelClass}>
              Mobile Number
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={fieldClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="qualification" className={labelClass}>
              Highest Qualification
            </label>
            <input
              id="qualification"
              name="qualification"
              required
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="experience" className={labelClass}>
              Total Work Experience
            </label>
            <input
              id="experience"
              name="experience"
              required
              className={fieldClass}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="currentCompany" className={labelClass}>
              Current Company (Optional)
            </label>
            <input
              id="currentCompany"
              name="currentCompany"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="expectedSalary" className={labelClass}>
              Expected Salary (Optional)
            </label>
            <input
              id="expectedSalary"
              name="expectedSalary"
              className={fieldClass}
            />
          </div>
        </div>
      </fieldset>

      <fieldset
        ref={(el) => {
          stepRefs.current[2] = el
        }}
        hidden={step !== 2}
        className="min-w-0 space-y-5 border-0 p-0"
      >
        <legend className="sr-only">{STEPS[2].title}</legend>
        <h3
          ref={(el) => {
            headingRefs.current[2] = el
          }}
          tabIndex={-1}
          className="font-serif text-2xl font-medium tracking-tight text-ink outline-none md:text-[1.75rem]"
        >
          {STEPS[2].title}
        </h3>

        <p className="font-sans text-sm leading-relaxed text-ink-muted">
          Upload your resume to Google Drive (or similar), set the link so
          anyone with the link can view it, then paste that link below.
        </p>

        <div>
          <label htmlFor="resumeUrl" className={labelClass}>
            Resume Link
          </label>
          <input
            id="resumeUrl"
            name="resumeUrl"
            type="url"
            required
            placeholder="https://drive.google.com/…"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="remarks" className={labelClass}>
            Additional Remarks (Optional)
          </label>
          <textarea
            id="remarks"
            name="remarks"
            rows={4}
            className={fieldClass}
          />
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            disabled={submitting}
            className="font-sans text-[11px] font-semibold tracking-[0.18em] text-ink/55 uppercase transition-colors hover:text-ink disabled:opacity-50"
          >
            ← Back
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            onKeyDown={onKeyDownContinue}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-mahogany px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.18em] text-cream uppercase shadow-[0_2px_10px_rgba(103,68,56,0.28)] transition-all hover:bg-mahogany-dark"
          >
            Continue
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-mahogany px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.18em] text-cream uppercase shadow-[0_2px_10px_rgba(103,68,56,0.28)] transition-all hover:bg-mahogany-dark disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit Application'}
            <span aria-hidden="true">→</span>
          </button>
        )}

        <span className="font-sans text-[10px] font-medium tracking-[0.14em] text-ink/35 uppercase">
          Step {step + 1} of {STEPS.length}
        </span>
      </div>
    </form>
  )
}
