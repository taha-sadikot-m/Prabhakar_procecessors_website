import { useState, type FormEvent } from 'react'
import { careersPage, company } from '../data/content'

const ACCENT = '#674438'
const MAHOGANY = '#674438'

const fieldClass =
  'w-full border border-line bg-cream px-4 py-3 font-sans text-sm text-ink outline-none transition-colors focus:border-[#674438]'

export function CareersPage() {
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="bg-cream pt-24">
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <p
          className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
          style={{ color: MAHOGANY }}
        >
          {careersPage.eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.12] font-medium tracking-tight text-ink md:text-5xl lg:text-[3.4rem]">
          {careersPage.headline}
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
          {careersPage.body}
        </p>
      </section>

      <section className="border-y border-line/80 bg-cream-dark">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-20">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
            {careersPage.benefits.title}
          </h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {careersPage.benefits.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 border border-line/70 bg-cream px-4 py-3.5 font-sans text-sm text-ink-muted"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45"
                  style={{ backgroundColor: ACCENT }}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-20">
        <h2 className="font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
          {careersPage.culture.title}
        </h2>
        <p className="mt-3 max-w-xl font-sans text-sm text-ink-muted">
          {careersPage.culture.body}
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {careersPage.culture.moments.map((moment) => (
            <article
              key={moment.title}
              className="border-t border-[#674438]/40 pt-5"
            >
              <h3 className="font-serif text-xl font-medium text-ink">
                {moment.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
                {moment.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="apply"
        className="scroll-mt-24 border-t border-line/80 bg-cream-dark"
      >
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 lg:px-10 lg:py-20">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
            {careersPage.form.title}
          </h2>
          <p className="mt-3 font-sans text-sm text-ink-muted">
            {careersPage.form.body}
          </p>

          {submitted ? (
            <div className="mt-10 border border-[#674438]/40 bg-cream px-6 py-8">
              <p className="font-serif text-2xl text-ink">Thank you.</p>
              <p className="mt-3 font-sans text-sm text-ink-muted">
                Your application has been recorded locally. Please also email
                your resume to{' '}
                <a
                  href={`mailto:${company.email}`}
                  className="text-mahogany underline-offset-2 hover:underline"
                >
                  {company.email}
                </a>{' '}
                so our HR team can follow up.
              </p>
            </div>
          ) : (
            <form className="mt-10 space-y-5" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="department"
                  className="mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase"
                >
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

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase"
                  >
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
                  <label
                    htmlFor="mobile"
                    className="mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase"
                  >
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

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase"
                  >
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
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase"
                  >
                    Current City
                  </label>
                  <input id="city" name="city" required className={fieldClass} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="qualification"
                    className="mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase"
                  >
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
                  <label
                    htmlFor="experience"
                    className="mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase"
                  >
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
                  <label
                    htmlFor="currentCompany"
                    className="mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase"
                  >
                    Current Company (Optional)
                  </label>
                  <input
                    id="currentCompany"
                    name="currentCompany"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="expectedSalary"
                    className="mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase"
                  >
                    Expected Salary (Optional)
                  </label>
                  <input
                    id="expectedSalary"
                    name="expectedSalary"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="resume"
                    className="mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase"
                  >
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
                  <label
                    htmlFor="photo"
                    className="mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase"
                  >
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
                <label
                  htmlFor="remarks"
                  className="mb-2 block font-sans text-[11px] font-medium tracking-[0.16em] text-ink uppercase"
                >
                  Additional Remarks (Optional)
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  rows={4}
                  className={fieldClass}
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex items-center gap-2 border-b border-[#674438] pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] uppercase transition-opacity hover:opacity-75"
                style={{ color: MAHOGANY }}
              >
                Submit Application
                <span aria-hidden="true">→</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
