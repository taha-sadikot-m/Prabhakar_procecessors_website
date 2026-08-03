import { useState } from 'react'
import { servicesPage } from '../data/content'
import { SectionCta } from '../components/SectionCta'

const GOLD = '#D4AF37'

function SwatchCard({
  name,
  description,
  image,
}: {
  name: string
  description: string
  image: string
}) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      className="group relative aspect-[2/3] w-full overflow-hidden border border-line/60 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
      aria-pressed={flipped}
      aria-label={`${name}: ${description}`}
    >
      <img
        src={image}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          flipped ? 'opacity-40' : 'opacity-100'
        }`}
        draggable={false}
      />
      <div
        className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#1a1208]/85 via-[#1a1208]/25 to-transparent p-5 transition-opacity duration-500 ${
          flipped ? 'opacity-100' : 'opacity-90'
        }`}
      >
        <p
          className="font-sans text-[10px] font-medium tracking-[0.18em] uppercase"
          style={{ color: GOLD }}
        >
          Service
        </p>
        <h3 className="mt-1 font-serif text-xl font-medium text-[#FFF8F0] md:text-2xl">
          {name}
        </h3>
        <p
          className={`mt-2 font-sans text-sm leading-relaxed text-[#FFF8F0]/85 transition-all duration-500 ${
            flipped
              ? 'translate-y-0 opacity-100'
              : 'translate-y-2 opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100'
          }`}
        >
          {description}
        </p>
      </div>
    </button>
  )
}

export function ServicesPage() {
  return (
    <main className="relative overflow-hidden bg-cream pt-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url(${servicesPage.backgrounds.ikat})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url(${servicesPage.backgrounds.jali})`,
          backgroundSize: '600px',
          backgroundRepeat: 'repeat',
        }}
        aria-hidden="true"
      />

      <section className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <p
          className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
          style={{ color: GOLD }}
        >
          {servicesPage.eyebrow}
        </p>
        <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-[1.12] font-medium tracking-tight text-ink md:text-5xl lg:text-[3.4rem]">
          {servicesPage.headline}
        </h1>
        <p className="mt-6 max-w-xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
          {servicesPage.body}
        </p>
      </section>

      {servicesPage.categories.map((category) => (
        <section
          key={category.id}
          id={category.id}
          className="relative mx-auto max-w-7xl scroll-mt-24 px-5 pb-16 md:px-8 lg:px-10 lg:pb-20"
        >
          <div className="mb-8 flex items-center gap-4">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-ink md:text-3xl">
              {category.title}
            </h2>
            <span
              className="h-px flex-1 max-w-xs"
              style={{ backgroundColor: `${GOLD}55` }}
              aria-hidden="true"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {category.services.map((service) => (
              <SwatchCard key={service.id} {...service} />
            ))}
          </div>
        </section>
      ))}

      <section className="relative border-t border-line/80 bg-cream-dark/80">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-20">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-ink">
            {servicesPage.alsoAvailable.title}
          </h2>
          <p className="mt-3 max-w-xl font-sans text-sm text-ink-muted">
            {servicesPage.alsoAvailable.body}
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {servicesPage.alsoAvailable.items.map((item) => (
              <li
                key={item}
                className="font-sans text-sm tracking-[0.04em] text-ink-muted"
              >
                <span
                  className="mr-2 inline-block h-1.5 w-1.5 rotate-45 align-middle"
                  style={{ backgroundColor: GOLD }}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <SectionCta label="Discuss Your Requirements" to="/contact" />
          </div>
        </div>
      </section>
    </main>
  )
}
