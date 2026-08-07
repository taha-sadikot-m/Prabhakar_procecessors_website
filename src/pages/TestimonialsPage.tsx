import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { company, testimonialsPage } from '../data/content'
import { CountUp } from '../components/motion/CountUp'
import { FadeIn } from '../components/motion/FadeIn'
import { SectionCta } from '../components/SectionCta'

const MAHOGANY = '#674438'
const HEADING = '#20222D'

function DiamondRule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-8 bg-mahogany/30" />
      <span className="h-1.5 w-1.5 rotate-45 bg-mahogany" />
      <span className="h-px w-8 bg-mahogany/30" />
    </div>
  )
}

function TestimonialsHero() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : ['0%', '12%'],
  )

  const [first, second] = testimonialsPage.headline
  const highlight = testimonialsPage.highlight
  const secondParts = second.split(highlight)

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[78svh] flex-col overflow-hidden bg-cream pt-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-[-8%] will-change-transform"
          style={{ y: bgY }}
        >
          <img
            src={testimonialsPage.hero.texture}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[0.14]"
            draggable={false}
          />
        </motion.div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-cream via-cream/92 to-cream/70"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <FadeIn className="max-w-xl">
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: MAHOGANY }}
          >
            {testimonialsPage.eyebrow}
          </p>
          <h1 className="mt-5 font-serif text-[2.5rem] leading-[1.08] font-medium tracking-tight text-ink md:text-5xl lg:text-[3.5rem]">
            {first}
            <br />
            {secondParts[0]}
            <span className="text-mahogany">{highlight}</span>
            {secondParts[1] ?? ''}
          </h1>
          <DiamondRule className="mt-6" />
          <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {testimonialsPage.body}
          </p>
          <p className="mt-8 font-sans text-[10px] font-medium tracking-[0.18em] text-ink/45 uppercase">
            {testimonialsPage.meta}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <SectionCta label="Start A Partnership" to="/contact" />
            <a
              href="#stories"
              className="inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-ink uppercase transition-colors hover:border-mahogany hover:text-mahogany"
            >
              Read Stories
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </FadeIn>
      </div>

      <a
        href="#stories"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="font-sans text-[9px] font-medium tracking-[0.24em] text-ink-muted uppercase">
          Scroll
        </span>
        <span
          className="h-8 w-px origin-top bg-mahogany/40"
          aria-hidden="true"
        />
      </a>
    </section>
  )
}

function ProofRibbon() {
  const quotes = testimonialsPage.quotes
  const combinedYears = quotes.reduce((sum, q) => sum + q.years, 0)
  const longest = Math.max(...quotes.map((q) => q.years))
  const yearsSince = new Date().getFullYear() - company.since

  const stats = [
    { value: quotes.length, suffix: '', label: 'Partner Types' },
    { value: combinedYears, suffix: '+', label: 'Combined Years' },
    { value: longest, suffix: ' yr', label: 'Longest Tenure' },
    { value: yearsSince, suffix: '+', label: 'Years Of Trust' },
  ]

  return (
    <section className="border-y border-line/70 bg-cream-dark">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 py-14 md:grid-cols-4 md:gap-0 md:px-8 md:py-16 lg:px-10">
        {stats.map((stat, i) => (
          <FadeIn
            key={stat.label}
            delay={0.05 * i}
            className={`text-center md:text-left ${
              i > 0 ? 'md:border-l md:border-mahogany/20 md:pl-8 lg:pl-10' : ''
            }`}
          >
            <p className="font-serif text-4xl font-medium tracking-tight text-mahogany md:text-5xl">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 font-sans text-[10px] font-medium tracking-[0.16em] text-ink-muted uppercase md:text-[11px]">
              {stat.label}
            </p>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

function StoriesSection({
  featured,
  rest,
}: {
  featured: (typeof testimonialsPage.quotes)[number]
  rest: (typeof testimonialsPage.quotes)[number][]
}) {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="stories"
      className="scroll-mt-[100px] sm:scroll-mt-[108px]"
    >
      {/* Featured — longest tenure */}
      <div className="border-b border-line/60 bg-cream-dark">
        <div className="relative mx-auto max-w-7xl overflow-hidden px-5 py-16 md:px-8 lg:px-10 lg:py-24">
          <span
            className="pointer-events-none absolute top-8 right-5 font-serif text-[7rem] leading-none font-light tracking-tight select-none md:top-10 md:right-8 md:text-[10rem] lg:right-10"
            style={{ color: 'rgba(103,68,56,0.12)' }}
            aria-hidden="true"
          >
            01
          </span>

          <FadeIn className="relative max-w-3xl">
            <p
              className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase"
              style={{ color: MAHOGANY }}
            >
              Featured Partnership
            </p>
            <blockquote className="mt-6">
              <p className="font-serif text-3xl leading-[1.2] font-light tracking-tight text-ink italic md:text-4xl lg:text-[2.75rem]">
                “{featured.quote}”
              </p>
            </blockquote>
            <DiamondRule className="mt-8" />
            <footer className="mt-6 flex flex-wrap items-baseline gap-3">
              <cite className="font-sans text-sm font-medium tracking-[0.04em] text-ink not-italic">
                {featured.type}
              </cite>
              <span className="text-ink/25" aria-hidden="true">
                ·
              </span>
              <span className="font-sans text-[11px] font-medium tracking-[0.16em] text-ink/45 uppercase">
                Partner · {featured.years} years
              </span>
            </footer>
          </FadeIn>
        </div>
      </div>

      {/* Ledger — remaining quotes */}
      <div className="border-b border-line/60 bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-24">
          <FadeIn>
            <p
              className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase"
              style={{ color: MAHOGANY }}
            >
              Partner Voices
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
              Stories From The Floor
            </h2>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
              Long-term partners across manufacturing, export, retail, and trade.
            </p>
          </FadeIn>

          <ul className="mt-14 grid list-none gap-x-10 gap-y-0 p-0 md:grid-cols-2">
            {rest.map((item, i) => (
              <li key={item.id}>
                <FadeIn delay={reduceMotion ? 0 : 0.04 * i}>
                  <article className="relative py-7 md:py-8">
                    <motion.span
                      className="mb-5 block h-px origin-left bg-mahogany/40"
                      initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.7,
                        delay: reduceMotion ? 0 : 0.05 * i,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      aria-hidden="true"
                    />
                    <span
                      className="pointer-events-none absolute top-7 right-0 font-serif text-5xl font-light leading-none tracking-tight select-none md:top-8 md:text-6xl"
                      style={{ color: 'rgba(103,68,56,0.14)' }}
                      aria-hidden="true"
                    >
                      {String(i + 2).padStart(2, '0')}
                    </span>
                    <blockquote>
                      <p className="relative pr-16 font-serif text-xl leading-snug font-medium tracking-tight text-ink italic md:text-2xl">
                        “{item.quote}”
                      </p>
                    </blockquote>
                    <footer className="relative mt-4 flex flex-wrap items-baseline gap-2">
                      <cite className="font-sans text-sm text-ink not-italic">
                        {item.type}
                      </cite>
                      <span className="text-ink/25" aria-hidden="true">
                        ·
                      </span>
                      <span className="font-sans text-[11px] font-medium tracking-[0.14em] text-ink/45 uppercase">
                        {item.years} years
                      </span>
                    </footer>
                  </article>
                </FadeIn>
              </li>
            ))}
          </ul>

          <FadeIn delay={0.1}>
            <p className="mt-10 max-w-xl font-sans text-sm leading-relaxed text-ink/45">
              {testimonialsPage.note}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

function TestimonialsClosing() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [1, 1.06],
  )

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[56svh] items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={{ scale: bgScale }}
        aria-hidden="true"
      >
        <img
          src={testimonialsPage.closing.texture}
          alt=""
          className="h-full w-full object-cover opacity-30"
          draggable={false}
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(250, 240, 230, 0.82)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-20 text-center md:px-8">
        <FadeIn>
          <h2
            className="font-serif text-3xl leading-[1.12] font-light tracking-tight italic md:text-4xl lg:text-[2.75rem]"
            style={{ color: HEADING }}
          >
            {testimonialsPage.closing.headline[0]}
            <br />
            {testimonialsPage.closing.headline[1]}
          </h2>
          <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {testimonialsPage.closing.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            <SectionCta
              label={testimonialsPage.closing.primaryCta}
              to={testimonialsPage.closing.primaryHref}
            />
            <Link
              to={testimonialsPage.closing.secondaryHref}
              className="inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-ink uppercase transition-colors hover:border-mahogany hover:text-mahogany"
            >
              {testimonialsPage.closing.secondaryCta}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export function TestimonialsPage() {
  const { featured, rest } = useMemo(() => {
    const sorted = [...testimonialsPage.quotes].sort(
      (a, b) => b.years - a.years,
    )
    return { featured: sorted[0], rest: sorted.slice(1) }
  }, [])

  return (
    <main className="bg-cream">
      <TestimonialsHero />
      <ProofRibbon />
      {featured && <StoriesSection featured={featured} rest={rest} />}
      <TestimonialsClosing />
    </main>
  )
}
