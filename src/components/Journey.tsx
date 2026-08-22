import { journey } from '../data/content'
import { CountUp } from './motion/CountUp'
import { FadeIn } from './motion/FadeIn'
import { SectionCta } from './SectionCta'

function DiamondDivider() {
  return (
    <div className="mt-6 flex items-center gap-3" aria-hidden="true">
      <span className="h-px w-10 bg-mahogany/30" />
      <span className="h-1.5 w-1.5 rotate-45 bg-mahogany" />
      <span className="h-px w-10 bg-mahogany/30" />
    </div>
  )
}

function StatRing({
  value,
  suffix,
  label,
}: {
  value: number
  suffix: string
  label: string
}) {
  return (
    <div className="relative flex h-[7.5rem] w-[7.5rem] items-center justify-center md:h-36 md:w-36">
      {/* Glass disc */}
      <div
        className="absolute inset-[8%] rounded-full border border-white/45 bg-cream/55 shadow-[0_8px_32px_rgba(45,52,54,0.08)] backdrop-blur-md"
        aria-hidden="true"
      />
      <svg
        className="absolute inset-0 z-[1] h-full w-full text-mahogany"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="60"
          cy="60"
          r="52"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeOpacity="0.45"
          strokeDasharray="220 110"
          strokeLinecap="round"
          transform="rotate(-40 60 60)"
        />
        <circle cx="108" cy="42" r="2.5" fill="currentColor" />
      </svg>
      <div className="relative z-10 flex max-w-[5.5rem] flex-col items-center px-2 text-center md:max-w-[6.5rem]">
        <p className="font-serif text-2xl font-medium tracking-tight text-mahogany md:text-3xl">
          <CountUp value={value} suffix={suffix} />
        </p>
        <p className="mt-1 font-sans text-[8px] font-medium tracking-[0.14em] text-ink uppercase md:text-[9px]">
          {label}
        </p>
      </div>
    </div>
  )
}

const positionClass: Record<(typeof journey.stats)[number]['position'], string> = {
  tl: 'md:absolute md:top-[18%] md:left-[42%] lg:left-[46%]',
  mr: 'md:absolute md:top-[38%] md:right-[8%] lg:right-[12%]',
  bl: 'md:absolute md:bottom-[16%] md:left-[48%] lg:left-[52%]',
  br: 'md:absolute md:right-[10%] md:bottom-[10%] lg:right-[14%]',
}

export function Journey() {
  return (
    <section
      id="journey"
      className="relative min-h-[90svh] overflow-hidden bg-cream scroll-mt-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <picture className="absolute inset-0 block h-full w-full">
          <source media="(min-width: 768px)" srcSet="/second_section/desktop.webp" />
          <img
            src="/second_section/mobile.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-bottom md:object-right md:object-center"
          />
        </picture>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[90svh] max-w-7xl flex-col px-5 py-20 md:px-8 md:py-28 lg:px-10">
        <FadeIn className="max-w-md lg:max-w-lg">
          <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-mahogany uppercase">
            {journey.eyebrow}
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.12] font-medium tracking-tight text-ink md:text-5xl lg:text-[3.25rem]">
            {journey.headline}{' '}
            <span className="text-mahogany">{journey.highlight}</span>
          </h2>
          <DiamondDivider />
          <p className="mt-7 font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {journey.body}
          </p>
          <p className="mt-5 font-serif text-lg leading-snug text-mahogany md:text-xl">
            {journey.commitment}
          </p>
          <div className="mt-8">
            <SectionCta label={journey.cta} to={journey.ctaHref} />
          </div>
        </FadeIn>

        <div className="mt-auto grid grid-cols-2 justify-items-center gap-4 pt-16 pb-4 md:hidden">
          {journey.stats.map((stat) => (
            <FadeIn key={stat.label} delay={0.05}>
              <StatRing value={stat.value} suffix={stat.suffix} label={stat.label} />
            </FadeIn>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {journey.stats.map((stat, i) => (
            <FadeIn
              key={stat.label}
              delay={0.1 + i * 0.08}
              className={positionClass[stat.position]}
            >
              <StatRing value={stat.value} suffix={stat.suffix} label={stat.label} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
