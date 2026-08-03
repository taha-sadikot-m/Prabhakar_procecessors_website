import { company, contactPage } from '../data/content'

const GOLD = '#D4AF37'

export function ContactPage() {
  return (
    <main className="bg-cream pt-24">
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <p
          className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
          style={{ color: GOLD }}
        >
          {contactPage.eyebrow}
        </p>
        <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.12] font-medium tracking-tight text-ink md:text-5xl lg:text-[3.4rem]">
          {contactPage.headline}
        </h1>
        <p className="mt-6 max-w-xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
          {contactPage.body}
        </p>

        <div className="mt-14 grid gap-10 border-t border-line/80 pt-12 md:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div>
              <p
                className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase"
                style={{ color: GOLD }}
              >
                Phone
              </p>
              <a
                href={`tel:${company.phone.replace(/\s/g, '')}`}
                className="mt-2 block font-serif text-2xl text-ink transition-colors hover:text-gold"
              >
                {company.phone}
              </a>
            </div>
            <div>
              <p
                className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase"
                style={{ color: GOLD }}
              >
                Email
              </p>
              <a
                href={`mailto:${company.email}`}
                className="mt-2 block font-serif text-2xl text-ink transition-colors hover:text-gold"
              >
                {company.email}
              </a>
            </div>
            <div>
              <p
                className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase"
                style={{ color: GOLD }}
              >
                Website
              </p>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block font-sans text-base text-ink-muted transition-colors hover:text-gold"
              >
                {company.website.replace('https://', '')}
              </a>
            </div>
          </div>

          <div>
            <p
              className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase"
              style={{ color: GOLD }}
            >
              Visit Us
            </p>
            <address className="mt-3 space-y-1 font-sans text-sm leading-relaxed text-ink-muted not-italic md:text-base">
              {company.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <a
              href={company.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 border-b border-[#D4AF37] pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] uppercase transition-opacity hover:opacity-75"
              style={{ color: GOLD }}
            >
              Open In Google Maps
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="mt-14">
          <a
            href={`mailto:${company.email}?subject=${encodeURIComponent(
              contactPage.ctaMailSubject,
            )}`}
            className="inline-flex items-center gap-2 border-b border-[#D4AF37] pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] uppercase transition-opacity hover:opacity-75"
            style={{ color: GOLD }}
          >
            Send An Enquiry
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  )
}
