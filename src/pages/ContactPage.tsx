import { ContactForm } from '../components/ContactForm'
import { GoogleMapEmbed } from '../components/GoogleMapEmbed'
import { company, contactPage } from '../data/content'

const MAHOGANY = '#674438'

export function ContactPage() {
  return (
    <main className="bg-cream pt-24">
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <p
          className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
          style={{ color: MAHOGANY }}
        >
          {contactPage.eyebrow}
        </p>
        <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.12] font-medium tracking-tight text-ink md:text-5xl lg:text-[3.4rem]">
          {contactPage.headline}
        </h1>
        <p className="mt-6 max-w-xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
          {contactPage.body}
        </p>

        <div className="mt-14 grid gap-10 border-t border-line/80 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 xl:gap-16">
          <div className="space-y-8">
            <div>
              <p
                className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase"
                style={{ color: MAHOGANY }}
              >
                Phone
              </p>
              <a
                href={`tel:${company.phone.replace(/\s/g, '')}`}
                className="mt-2 block font-serif text-2xl text-ink transition-colors hover:text-mahogany"
              >
                {company.phone}
              </a>
            </div>
            <div>
              <p
                className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase"
                style={{ color: MAHOGANY }}
              >
                Email
              </p>
              <a
                href={`mailto:${company.email}`}
                className="mt-2 block font-serif text-2xl text-ink transition-colors hover:text-mahogany"
              >
                {company.email}
              </a>
            </div>
            <div>
              <p
                className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase"
                style={{ color: MAHOGANY }}
              >
                Website
              </p>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block font-sans text-base text-ink-muted transition-colors hover:text-mahogany"
              >
                {company.website.replace('https://', '')}
              </a>
            </div>
            <div>
              <p
                className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase"
                style={{ color: MAHOGANY }}
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
            </div>
          </div>

          <ContactForm />
        </div>

        <div className="mt-16 border-t border-line/80 pt-12 md:mt-20 md:pt-16">
          <p
            className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase"
            style={{ color: MAHOGANY }}
          >
            Find Us
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-2xl font-medium tracking-tight text-ink md:text-3xl">
            Our mill in Kadodara, Surat
          </h2>
          <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {company.address.lines.join(', ')}
          </p>

          <GoogleMapEmbed className="mt-8 h-[280px] w-full md:h-[380px] lg:aspect-[21/9] lg:h-auto" />

          <a
            href={company.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-mahogany/45 bg-transparent px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.18em] text-mahogany uppercase transition-all hover:border-mahogany hover:bg-mahogany/5"
          >
            Open In Google Maps
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  )
}
