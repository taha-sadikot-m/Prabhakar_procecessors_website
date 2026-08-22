import { hero } from '../data/content'
import { SectionCta } from './SectionCta'

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex h-[100svh] min-h-[100svh] flex-col overflow-hidden bg-cream pt-24"
    >
      {/* Hard clip — image never bleeds past the hero */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <picture className="absolute inset-0 block h-full w-full">
            <source
              media="(min-width: 1024px)"
              srcSet="/hero_section_image/desktop.webp"
            />
            <source
              media="(min-width: 768px)"
              srcSet="/hero_section_image/tablet_version.webp"
            />
            <img
              src="/hero_section_image/mobile_version.webp"
              alt=""
              width={768}
              height={1024}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[center_35%] md:object-center"
            />
          </picture>
        </div>
        {/* Bottom fade only */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-cream/45 to-transparent md:h-40 md:from-cream/50" />
      </div>

      {/* —— Mobile layout: copy + CTA stacked —— */}
      <div className="relative z-10 flex flex-1 flex-col md:hidden">
        <div className="relative mr-auto w-[min(22rem,92%)] px-4 pt-2 text-left sm:px-5">
          <div className="relative z-10">
            <h1 className="mt-5 font-serif text-[2.35rem] leading-[1.08] font-medium tracking-tight text-ink">
              {hero.headline[0]}
              <br />
              {hero.headline[1]}
              <br />
              {hero.headline[2]}{' '}
              <span className="text-mahogany">{hero.highlight}</span>
            </h1>

            <p className="mt-4 max-w-[20rem] font-sans text-sm leading-relaxed text-ink/75">
              {hero.subcopy}
            </p>

            <div className="mt-8">
              <SectionCta label={hero.cta} to={hero.ctaHref} />
            </div>
          </div>
        </div>
      </div>

      {/* —— Desktop / tablet layout —— */}
      <div className="relative z-10 mr-auto hidden w-full flex-1 flex-col justify-center px-4 pb-16 pl-4 sm:pl-6 md:flex md:px-6 md:pl-8 lg:pl-10 xl:pl-12">
        <div className="max-w-lg lg:max-w-xl">
          <h1 className="mt-6 font-serif text-[2.6rem] leading-[1.08] font-medium tracking-tight text-ink sm:text-5xl md:mt-7 md:text-6xl lg:text-[4.1rem]">
            {hero.headline[0]}
            <br />
            {hero.headline[1]}
            <br />
            {hero.headline[2]}{' '}
            <span className="text-mahogany">{hero.highlight}</span>
          </h1>

          <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-ink-muted sm:text-base md:mt-6">
            {hero.subcopy}
          </p>

          <div className="mt-8 md:mt-10">
            <SectionCta label={hero.cta} to={hero.ctaHref} />
          </div>
        </div>
      </div>

      <a
        href={hero.scrollHref}
        className="absolute top-1/2 right-3 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 lg:right-6 lg:flex xl:right-10"
      >
        <span
          className="font-sans text-[9px] font-medium tracking-[0.28em] text-ink-muted uppercase"
          style={{ writingMode: 'vertical-rl' }}
        >
          {hero.scrollLabel}
        </span>
        <span className="relative flex h-8 w-5 items-start justify-center rounded-full border border-ink/25 pt-1.5">
          <span className="h-1.5 w-1 animate-bounce rounded-full bg-mahogany" />
        </span>
      </a>
    </section>
  )
}
