import { Link } from 'react-router-dom'
import { aboutPage } from '../data/content'
import { SectionCta } from '../components/SectionCta'

const GOLD = '#D4AF37'

export function AboutPage() {
  return (
    <main className="bg-cream pt-24">
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <p
          className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
          style={{ color: GOLD }}
        >
          {aboutPage.eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.12] font-medium tracking-tight text-ink md:text-5xl lg:text-[3.4rem]">
          {aboutPage.headline}
        </h1>
        <div className="mt-10 max-w-2xl space-y-5">
          {aboutPage.intro.map((p) => (
            <p
              key={p.slice(0, 40)}
              className="font-sans text-sm leading-relaxed text-ink-muted md:text-base"
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="border-y border-line/80 bg-cream-dark">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8 lg:gap-16 lg:px-10 lg:py-20">
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
              {aboutPage.vision.title}
            </h2>
            <p className="mt-5 font-sans text-sm leading-relaxed text-ink-muted md:text-base">
              {aboutPage.vision.body}
            </p>
          </div>
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
              {aboutPage.mission.title}
            </h2>
            <ul className="mt-5 space-y-3">
              {aboutPage.mission.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 font-sans text-sm leading-relaxed text-ink-muted"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45"
                    style={{ backgroundColor: GOLD }}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-20">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {aboutPage.stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <p className="font-serif text-4xl font-medium tracking-tight text-gold md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 font-sans text-[11px] font-medium tracking-[0.16em] text-ink-muted uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="leadership"
        className="scroll-mt-24 border-t border-line/80 bg-cream"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
              style={{ color: GOLD }}
            >
              Leadership
            </p>
            <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl lg:text-[2.75rem]">
              {aboutPage.leadership.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
              {aboutPage.leadership.body}
            </p>
          </div>

          <ul className="mt-14 grid list-none gap-10 p-0 sm:mt-16 sm:grid-cols-3 sm:gap-6 lg:gap-8">
            {aboutPage.leadership.members.map((member) => (
              <li key={member.name} className="group">
                <div
                  className="aspect-[3/4] overflow-hidden border"
                  style={{ borderColor: 'rgba(212, 175, 55, 0.25)' }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    draggable={false}
                  />
                </div>
                <div className="mt-5 text-left">
                  <p className="font-serif text-xl font-medium tracking-tight text-ink md:text-[1.35rem]">
                    {member.name}
                  </p>
                  <p
                    className="mt-1.5 font-sans text-[11px] font-medium tracking-[0.18em] uppercase"
                    style={{ color: GOLD }}
                  >
                    {member.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-20">
        <h2 className="font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
          {aboutPage.usp.title}
        </h2>
        <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
          {aboutPage.usp.body}
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {aboutPage.usp.items.map((item, i) => (
            <div key={item.title} className="border-t border-[#D4AF37]/40 pt-5">
              <p
                className="font-sans text-[10px] font-medium tracking-[0.2em] uppercase"
                style={{ color: GOLD }}
              >
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-2 font-serif text-xl font-medium text-ink">
                {item.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="capabilities"
        className="scroll-mt-24 border-t border-line/80 bg-cream-dark"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-20">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
            {aboutPage.capabilities.title}
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-sm text-ink-muted">
            {aboutPage.capabilities.body}
          </p>
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {aboutPage.capabilities.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 border border-line/70 bg-cream px-5 py-4 font-sans text-sm leading-relaxed text-ink-muted"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45"
                  style={{ backgroundColor: GOLD }}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-8">
            <SectionCta label="Explore Services" to="/services" />
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-ink uppercase transition-colors hover:border-gold hover:text-gold"
            >
              Contact Us
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
