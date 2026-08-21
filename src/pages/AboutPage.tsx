import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
  type TouchEvent,
} from 'react'
import {
  Handshake,
  Leaf,
  Settings2,
  ShieldCheck,
  type LucideProps,
} from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { aboutPage } from '../data/content'
import { CountUp } from '../components/motion/CountUp'
import { FadeIn } from '../components/motion/FadeIn'
import { SectionCta } from '../components/SectionCta'

const MAHOGANY = '#674438'
const HEADING = '#20222D'

const PRINCIPLE_ICONS: Record<
  (typeof aboutPage.principles)[number]['id'],
  ComponentType<LucideProps>
> = {
  quality: ShieldCheck,
  technology: Settings2,
  trust: Handshake,
  growth: Leaf,
}

function DiamondRule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-8 bg-mahogany/30" />
      <span className="h-1.5 w-1.5 rotate-45 bg-mahogany" />
      <span className="h-px w-8 bg-mahogany/30" />
    </div>
  )
}

function AboutHero() {
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

  const [first, second] = aboutPage.headline
  const highlight = aboutPage.highlight
  const firstParts = first.split(highlight)

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[88svh] flex-col overflow-hidden bg-cream pt-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div className="absolute inset-[-6%] will-change-transform" style={{ y: bgY }}>
          <picture className="absolute inset-0 block h-full w-full">
            <source
              media="(min-width: 768px)"
              srcSet={aboutPage.hero.desktopImage}
            />
            <img
              src={aboutPage.hero.mobileImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_30%] md:object-[center_40%]"
              draggable={false}
            />
          </picture>
        </motion.div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-transparent md:via-cream/80 md:to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cream to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <FadeIn className="max-w-xl">
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: MAHOGANY }}
          >
            {aboutPage.eyebrow}
          </p>
          <h1 className="mt-5 font-serif text-[2.5rem] leading-[1.08] font-medium tracking-tight text-ink md:text-5xl lg:text-[3.5rem]">
            {firstParts[0]}
            <span className="text-mahogany">{highlight}</span>
            {firstParts[1] ?? ''}
            <br />
            {second}
          </h1>
          <DiamondRule className="mt-6" />
          <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {aboutPage.positioning}
          </p>
          <p className="mt-8 font-sans text-[10px] font-medium tracking-[0.2em] text-ink/45 uppercase">
            {aboutPage.provenance}
          </p>
        </FadeIn>
      </div>

      <a
        href="#story"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="font-sans text-[9px] font-medium tracking-[0.24em] text-ink-muted uppercase">
          Scroll
        </span>
        <span className="relative flex h-8 w-5 items-start justify-center rounded-full border border-ink/20 pt-1.5">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-mahogany"
            animate={
              reduceMotion ? undefined : { y: [0, 8, 0], opacity: [1, 0.35, 1] }
            }
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </a>
    </section>
  )
}

function HeritageStory() {
  const reduceMotion = useReducedMotion()
  const imageRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : ['-5%', '5%'],
  )

  return (
    <section
      id="story"
      className="scroll-mt-24 border-t border-line/70 bg-cream-dark"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:gap-14 md:px-8 lg:gap-20 lg:px-10 lg:py-28">
        <FadeIn>
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: MAHOGANY }}
          >
            {aboutPage.story.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-[1.12] font-medium tracking-tight text-ink md:text-4xl lg:text-[2.75rem]">
            {aboutPage.story.title}
          </h2>
          <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {aboutPage.story.body}
          </p>

          <ol className="relative mt-12 space-y-0">
            <span
              className="absolute top-2 bottom-2 left-[0.3rem] w-px bg-mahogany/25"
              aria-hidden="true"
            />
            {aboutPage.timeline.map((item, i) => (
              <FadeIn key={item.year} delay={0.06 * i} className="relative pl-8 pb-8 last:pb-0">
                <span
                  className="absolute top-1.5 left-0 h-2.5 w-2.5 rounded-full border-2 border-cream-dark bg-mahogany"
                  aria-hidden="true"
                />
                <p
                  className="font-sans text-[11px] font-semibold tracking-[0.18em] uppercase"
                  style={{ color: MAHOGANY }}
                >
                  {item.year}
                </p>
                <h3 className="mt-1 font-serif text-xl font-medium tracking-tight text-heading">
                  {item.title}
                </h3>
                <p className="mt-1.5 max-w-sm font-sans text-sm leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </FadeIn>
            ))}
          </ol>
        </FadeIn>

        <div
          ref={imageRef}
          className="relative aspect-[4/5] overflow-hidden rounded-xl border border-mahogany/20 md:aspect-[5/6]"
        >
          <motion.div
            className="absolute inset-[-8%] h-[116%] w-full"
            style={{ y: imageY }}
          >
            <img
              src={aboutPage.story.image}
              alt={aboutPage.story.imageAlt}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ProofRibbon() {
  return (
    <section className="border-y border-line/70 bg-cream-light">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 py-14 md:grid-cols-4 md:gap-0 md:px-8 md:py-16 lg:px-10">
        {aboutPage.stats.map((stat, i) => (
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

function Principles() {
  const [featured, ...rest] = aboutPage.principles
  const FeaturedIcon = PRINCIPLE_ICONS[featured.id]

  return (
    <section className="bg-cream-dark">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:px-10 lg:py-28">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: MAHOGANY }}
          >
            {aboutPage.vision.eyebrow}
          </p>
          <blockquote className="mt-6 font-serif text-2xl leading-snug font-light tracking-tight text-heading italic md:text-3xl lg:text-[2.35rem]">
            “{aboutPage.vision.quote}”
          </blockquote>
          <DiamondRule className="mt-8 justify-center" />
        </FadeIn>

        {/* Desktop / tablet asymmetric bento */}
        <div className="mt-16 hidden gap-5 md:grid md:grid-cols-12 md:gap-6">
          <FadeIn className="md:col-span-7 md:row-span-3">
            <article className="relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-xl border border-mahogany/20 bg-cream px-8 py-10 lg:min-h-full lg:px-10 lg:py-12">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: 'url(/service_section/bg-ikat-texture.webp)',
                  backgroundSize: 'cover',
                }}
                aria-hidden="true"
              />
              <p
                className="relative font-serif text-7xl font-light leading-none tracking-tight lg:text-8xl"
                style={{ color: 'rgba(103,68,56,0.18)' }}
                aria-hidden="true"
              >
                01
              </p>
              <span
                className="relative mt-6 inline-flex size-12 items-center justify-center rounded-full border border-mahogany/30 bg-cream-light"
                style={{ color: MAHOGANY }}
              >
                <FeaturedIcon size={22} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="relative mt-5 max-w-sm font-serif text-3xl font-medium tracking-tight text-ink lg:text-[2.15rem]">
                {featured.title}
              </h3>
              <DiamondRule className="relative mt-5" />
              <p className="relative mt-5 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
                {featured.body}
              </p>
            </article>
          </FadeIn>

          {rest.map((item, i) => {
            const Icon = PRINCIPLE_ICONS[item.id]
            const numeral = String(i + 2).padStart(2, '0')
            return (
              <FadeIn
                key={item.id}
                delay={0.08 * (i + 1)}
                className="md:col-span-5"
              >
                <article className="flex h-full flex-col border-t border-mahogany/40 bg-cream/50 px-6 pt-5 pb-6">
                  <div className="flex items-start justify-between gap-4">
                    <p
                      className="font-serif text-3xl font-light tracking-tight"
                      style={{ color: 'rgba(103,68,56,0.35)' }}
                      aria-hidden="true"
                    >
                      {numeral}
                    </p>
                    <span style={{ color: MAHOGANY }}>
                      <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif text-xl font-medium tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </article>
              </FadeIn>
            )
          })}
        </div>

        {/* Mobile: featured first, then leaners with alternating rule offset */}
        <ul className="mt-14 grid list-none gap-6 p-0 md:hidden">
          <li>
            <FadeIn>
              <article className="relative overflow-hidden rounded-xl border border-mahogany/20 bg-cream px-6 py-8">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: 'url(/service_section/bg-ikat-texture.webp)',
                    backgroundSize: 'cover',
                  }}
                  aria-hidden="true"
                />
                <p
                  className="relative font-serif text-6xl font-light leading-none"
                  style={{ color: 'rgba(103,68,56,0.18)' }}
                  aria-hidden="true"
                >
                  01
                </p>
                <span
                  className="relative mt-5 inline-flex size-11 items-center justify-center rounded-full border border-mahogany/30 bg-cream-light"
                  style={{ color: MAHOGANY }}
                >
                  <FeaturedIcon size={20} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="relative mt-4 font-serif text-2xl font-medium tracking-tight text-ink">
                  {featured.title}
                </h3>
                <DiamondRule className="relative mt-4" />
                <p className="relative mt-4 font-sans text-sm leading-relaxed text-ink-muted">
                  {featured.body}
                </p>
              </article>
            </FadeIn>
          </li>
          {rest.map((item, i) => {
            const Icon = PRINCIPLE_ICONS[item.id]
            const numeral = String(i + 2).padStart(2, '0')
            const offsetRight = i % 2 === 1
            return (
              <li key={item.id}>
                <FadeIn delay={0.06 * (i + 1)}>
                  <article
                    className={`border-t border-mahogany/40 pt-5 ${
                      offsetRight ? 'pl-6' : 'pr-6'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p
                        className="font-serif text-2xl font-light"
                        style={{ color: 'rgba(103,68,56,0.35)' }}
                        aria-hidden="true"
                      >
                        {numeral}
                      </p>
                      <span style={{ color: MAHOGANY }}>
                        <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-medium tracking-tight text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
                      {item.body}
                    </p>
                  </article>
                </FadeIn>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function ProcessJourney() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState(0)
  const [inView, setInView] = useState(false)
  const pauseUntilRef = useRef(0)
  const touchStartX = useRef<number | null>(null)
  const stages = aboutPage.process.stages
  const count = stages.length
  const stage = stages[current]
  const AUTO_MS = 4500
  const PAUSE_MS = 4500

  const goTo = useCallback(
    (index: number, fromUser = false) => {
      const next = ((index % count) + count) % count
      if (next === current) return
      setCurrent(next)
      if (fromUser) pauseUntilRef.current = Date.now() + PAUSE_MS
    },
    [count, current],
  )

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) =>
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      { threshold: [0, 0.35, 1] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduceMotion || !inView) return
    const id = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return
      setCurrent((c) => (c + 1) % count)
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [reduceMotion, inView, count])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      goTo(current + 1, true)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      goTo(current - 1, true)
    }
  }

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current == null) return
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 48) return
    if (dx < 0) goTo(current + 1, true)
    else goTo(current - 1, true)
  }

  const imageDuration = reduceMotion ? 0.15 : 0.55

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="scroll-mt-24 border-t border-line/70 bg-cream"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:px-10 lg:py-28">
        <FadeIn className="max-w-2xl">
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: MAHOGANY }}
          >
            {aboutPage.process.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl lg:text-[2.75rem]">
            {aboutPage.process.title}
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {aboutPage.process.body}
          </p>
        </FadeIn>

        <div
          className="mt-12 outline-none md:mt-14"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="End-to-end process stages"
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseEnter={() => {
            pauseUntilRef.current = Date.now() + PAUSE_MS
          }}
        >
          <div className="grid gap-8 md:grid-cols-12 md:items-stretch md:gap-10 lg:gap-14">
            {/* Stage image */}
            <div className="relative aspect-[16/11] overflow-hidden rounded-xl border border-mahogany/20 bg-cream-dark md:col-span-7 md:aspect-auto md:min-h-[26rem]">
              {stages.map((s) => (
                <motion.div
                  key={s.id}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: s.id === stage.id ? 1 : 0 }}
                  transition={{ duration: imageDuration, ease: 'easeInOut' }}
                  aria-hidden={s.id !== stage.id}
                >
                  <img
                    src={s.image}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </motion.div>
              ))}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-cream via-cream/70 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 z-10 px-5 py-5 md:px-7 md:py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage.id}
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: reduceMotion ? 0.12 : 0.35 }}
                  >
                    <p
                      className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase"
                      style={{ color: MAHOGANY }}
                    >
                      {String(current + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl font-medium tracking-tight text-ink md:text-3xl">
                      {stage.title}
                    </h3>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Stage list */}
            <ol className="relative flex list-none flex-col gap-0 p-0 md:col-span-5 md:justify-center">
              <span
                className="absolute top-3 bottom-3 left-[0.55rem] w-px bg-mahogany/25 md:left-[0.7rem]"
                aria-hidden="true"
              />
              {stages.map((s, i) => {
                const active = i === current
                return (
                  <li key={s.id} className="relative pl-8 md:pl-10">
                    <button
                      type="button"
                      onClick={() => goTo(i, true)}
                      aria-current={active ? 'step' : undefined}
                      className={`group w-full border-b border-line/60 py-4 text-left transition-colors last:border-b-0 md:py-5 ${
                        active ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span
                        className={`absolute top-6 left-0 flex size-3 items-center justify-center rounded-full border-2 border-cream transition-colors md:top-7 md:left-0.5 md:size-3.5 ${
                          active ? 'bg-mahogany' : 'bg-cream-dark'
                        }`}
                        style={{
                          boxShadow: active
                            ? '0 0 0 3px rgba(103,68,56,0.18)'
                            : undefined,
                          borderColor: active ? MAHOGANY : 'rgba(103,68,56,0.35)',
                        }}
                        aria-hidden="true"
                      />
                      <span className="flex items-baseline gap-3">
                        <span
                          className="font-sans text-[10px] font-semibold tracking-[0.18em] uppercase"
                          style={{
                            color: active ? MAHOGANY : 'rgba(45,27,14,0.4)',
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`font-serif text-xl tracking-tight md:text-2xl ${
                            active
                              ? 'font-medium text-ink'
                              : 'font-normal text-ink/70'
                          }`}
                        >
                          {s.title}
                        </span>
                      </span>
                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.p
                            key={`${s.id}-desc`}
                            initial={
                              reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, height: 0 }
                            }
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={
                              reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, height: 0 }
                            }
                            transition={{ duration: reduceMotion ? 0.12 : 0.3 }}
                            className="mt-2 overflow-hidden font-sans text-sm leading-relaxed text-ink-muted"
                          >
                            {s.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <div className="mt-12">
          <SectionCta
            label={aboutPage.process.cta}
            to={aboutPage.process.ctaHref}
          />
        </div>
      </div>
    </section>
  )
}

function Leadership() {
  return (
    <section id="leadership" className="scroll-mt-24 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:px-10 lg:py-28">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: MAHOGANY }}
          >
            Leadership
          </p>
          <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl lg:text-[2.75rem]">
            {aboutPage.leadership.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {aboutPage.leadership.body}
          </p>
          <blockquote className="mx-auto mt-8 max-w-xl font-serif text-xl leading-snug text-heading italic md:text-2xl">
            “{aboutPage.leadership.quote}”
          </blockquote>
          <p className="mt-4 font-sans text-xs tracking-[0.08em] text-ink/50">
            {aboutPage.leadership.attribution}
          </p>
        </FadeIn>

        {/* Mobile: stacked full portraits */}
        <ul className="mt-14 grid list-none gap-12 p-0 md:hidden">
          {aboutPage.leadership.members.map((member, i) => (
            <li key={member.name}>
              <FadeIn delay={0.05 * i}>
                <div className="overflow-hidden rounded-xl border border-mahogany/20">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="block h-auto w-full"
                    draggable={false}
                  />
                </div>
                <div className="mt-5">
                  <p className="font-serif text-xl font-medium tracking-tight text-ink">
                    {member.name}
                  </p>
                  <p
                    className="mt-1.5 font-sans text-[11px] font-medium tracking-[0.18em] uppercase"
                    style={{ color: MAHOGANY }}
                  >
                    {member.role}
                  </p>
                </div>
              </FadeIn>
            </li>
          ))}
        </ul>

        {/* Desktop: staggered editorial gallery */}
        <ul className="mt-16 hidden list-none gap-6 p-0 md:grid md:grid-cols-12 md:items-end lg:gap-8">
          {aboutPage.leadership.members.map((member, i) => {
            const offsets = [
              'md:col-span-4 md:pb-16',
              'md:col-span-4',
              'md:col-span-4 md:pb-10',
            ]
            return (
              <li key={member.name} className={offsets[i]}>
                <FadeIn delay={0.08 * i} className="group">
                  <div
                    className="aspect-[3/4] overflow-hidden rounded-xl border"
                    style={{ borderColor: 'rgba(103, 68, 56, 0.25)' }}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      draggable={false}
                    />
                  </div>
                  <div className="mt-5">
                    <p className="font-serif text-xl font-medium tracking-tight text-ink md:text-[1.35rem]">
                      {member.name}
                    </p>
                    <p
                      className="mt-1.5 font-sans text-[11px] font-medium tracking-[0.18em] uppercase"
                      style={{ color: MAHOGANY }}
                    >
                      {member.role}
                    </p>
                  </div>
                </FadeIn>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function AboutClosing() {
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
      className="relative flex min-h-[70svh] items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={{ scale: bgScale }}
        aria-hidden="true"
      >
        <picture className="block h-full w-full">
          <source
            media="(min-width: 768px)"
            srcSet={aboutPage.closing.desktopImage}
          />
          <img
            src={aboutPage.closing.mobileImage}
            alt=""
            className="h-full w-full object-cover object-center"
            draggable={false}
          />
        </picture>
      </motion.div>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(250, 240, 230, 0.68)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-24 text-center md:px-8">
        <FadeIn>
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: MAHOGANY }}
          >
            {aboutPage.closing.eyebrow}
          </p>
          <h2
            className="mt-5 font-serif text-4xl leading-[1.12] font-light tracking-tight italic md:text-5xl"
            style={{ color: HEADING }}
          >
            {aboutPage.closing.headline[0]}
            <br />
            {aboutPage.closing.headline[1]}
          </h2>
          <p className="mx-auto mt-6 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {aboutPage.closing.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <SectionCta
              label={aboutPage.closing.primaryCta}
              to={aboutPage.closing.primaryHref}
            />
            <SectionCta
              label={aboutPage.closing.secondaryCta}
              to={aboutPage.closing.secondaryHref}
              variant="outline"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export function AboutPage() {
  return (
    <main className="bg-cream">
      <AboutHero />
      <HeritageStory />
      <ProofRibbon />
      <Principles />
      <ProcessJourney />
      <Leadership />
      <AboutClosing />
    </main>
  )
}
