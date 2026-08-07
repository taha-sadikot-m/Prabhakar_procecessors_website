import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { Link } from 'react-router-dom'
import { careersPage, company } from '../data/content'

const MAHOGANY = '#674438'

const fieldClass =
  'w-full border border-line bg-cream px-4 py-3 font-sans text-sm text-ink outline-none transition-colors focus:border-mahogany'

const labelClass =
  'mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase'

const STEPS = careersPage.form.steps

export function JobApplicationForm() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [announce, setAnnounce] = useState('')
  const stepRefs = useRef<(HTMLFieldSetElement | null)[]>([])
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([])

  useEffect(() => {
    if (submitted) return
    const heading = headingRefs.current[step]
    heading?.focus()
    setAnnounce(`Step ${step + 1} of ${STEPS.length}: ${STEPS[step].title}`)
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
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }

  const goBack = () => {
    setStep((s) => Math.max(0, s - 1))
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateStep(step)) return
    setSubmitted(true)
    setAnnounce('Application submitted. Thank you.')
  }

  const onKeyDownContinue = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      goNext()
    }
  }

  if (submitted) {
    return (
      <div className="border border-mahogany/30 bg-cream px-6 py-10 md:px-10 md:py-12">
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
          Your application has been recorded locally. Please also email your
          resume to{' '}
          <a
            href={`mailto:${company.email}`}
            className="text-mahogany underline-offset-2 hover:underline"
          >
            {company.email}
          </a>{' '}
          so our HR team can follow up.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 border-b border-mahogany pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-mahogany uppercase transition-opacity hover:opacity-75"
        >
          Back to Home
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    )
  }

  return (
    <form className="space-y-8" onSubmit={onSubmit} noValidate={false}>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </div>

      {/* Progress */}
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
                  className={`flex h-8 w-8 items-center justify-center font-sans text-[11px] font-semibold tracking-wider ${
                    current || done
                      ? 'bg-mahogany text-cream'
                      : 'border border-mahogany/25 text-ink/40'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={`hidden font-sans text-[10px] font-medium tracking-[0.14em] uppercase sm:block ${
                    current ? 'text-mahogany' : done ? 'text-ink/55' : 'text-ink/40'
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

      {/* Step 1 — Role */}
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

      {/* Step 2 — About You */}
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

      {/* Step 3 — Documents */}
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

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="resume" className={labelClass}>
              Upload Resume (PDF/DOC)
            </label>
            <input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className="w-full font-sans text-sm text-ink-muted file:mr-3 file:border file:border-line file:bg-cream file:px-3 file:py-2 file:font-sans file:text-xs file:uppercase file:tracking-wider"
            />
          </div>
          <div>
            <label htmlFor="photo" className={labelClass}>
              Photograph (Optional)
            </label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="w-full font-sans text-sm text-ink-muted file:mr-3 file:border file:border-line file:bg-cream file:px-3 file:py-2 file:font-sans file:text-xs file:uppercase file:tracking-wider"
            />
          </div>
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
            className="font-sans text-[11px] font-semibold tracking-[0.18em] text-ink/55 uppercase transition-colors hover:text-ink"
          >
            ← Back
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            onKeyDown={onKeyDownContinue}
            className="inline-flex items-center gap-2 border-b border-mahogany pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-mahogany uppercase transition-opacity hover:opacity-75"
          >
            Continue
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button
            type="submit"
            className="inline-flex items-center gap-2 border-b border-mahogany pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-mahogany uppercase transition-opacity hover:opacity-75"
          >
            Submit Application
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
