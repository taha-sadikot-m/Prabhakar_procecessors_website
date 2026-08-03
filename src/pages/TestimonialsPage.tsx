import { Link } from 'react-router-dom'
import { testimonialsPage } from '../data/content'
import { SectionCta } from '../components/SectionCta'

const GOLD = '#D4AF37'

export function TestimonialsPage() {
  return (
    <main className="bg-cream pt-24">
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <p
          className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
          style={{ color: GOLD }}
        >
          {testimonialsPage.eyebrow}
        </p>
        <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.12] font-medium tracking-tight text-ink md:text-5xl lg:text-[3.4rem]">
          {testimonialsPage.headline}
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
          {testimonialsPage.body}
        </p>
      </section>

      <section className="border-t border-line/80 bg-cream-dark">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            {testimonialsPage.placeholders.map((item) => (
              <blockquote
                key={item.type}
                className="border border-line/70 bg-cream px-6 py-8 md:px-8"
              >
                <p
                  className="font-sans text-[11px] font-medium tracking-[0.18em] uppercase"
                  style={{ color: GOLD }}
                >
                  {item.type}
                </p>
                <p className="mt-4 font-serif text-2xl leading-snug text-ink italic md:text-[1.65rem]">
                  “{item.quote}”
                </p>
                <p className="mt-6 font-sans text-xs tracking-[0.12em] text-ink-muted uppercase">
                  Partner · {item.years}
                </p>
              </blockquote>
            ))}
          </div>
          <p className="mt-10 max-w-xl font-sans text-sm text-ink-muted">
            {testimonialsPage.note}
          </p>
          <div className="mt-10 flex flex-wrap gap-8">
            <SectionCta label="Start A Partnership" to="/contact" />
            <Link
              to="/services"
              className="inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-ink uppercase transition-colors hover:border-gold hover:text-gold"
            >
              View Services
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
