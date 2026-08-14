import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from 'react'
import {
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Wallet,
  type LucideProps,
} from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { careersPage, company } from '../data/content'
import { CountUp } from '../components/motion/CountUp'
import { FadeIn } from '../components/motion/FadeIn'
import { JobApplicationForm } from '../components/JobApplicationForm'
import { SectionCta } from '../components/SectionCta'
import {
  fetchPublicCulture,
  type CultureImageDto,
} from '../lib/cms-api'
import { resolveDisplayImageUrl } from '../lib/media-url'

const MAHOGANY = '#674438'
const HEADING = '#20222D'

/** Clamp aspect ratio so extreme panoramas/tall shots don't break the layout. */
const CULTURE_ASPECT_MIN = 3 / 4
const CULTURE_ASPECT_MAX = 4 / 3
const CULTURE_ASPECT_FALLBACK = 4 / 5

function clampCultureAspect(ratio: number) {
  if (!Number.isFinite(ratio) || ratio <= 0) return CULTURE_ASPECT_FALLBACK
  return Math.min(CULTURE_ASPECT_MAX, Math.max(CULTURE_ASPECT_MIN, ratio))
}

const BENEFIT_ICONS: Record<
  (typeof careersPage.benefits.groups)[number]['id'],
  ComponentType<LucideProps>
> = {
  security: Wallet,
  workplace: ShieldCheck,
  learning: GraduationCap,
  life: HeartHandshake,
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

function CareersHero() {
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

  const [first, second] = careersPage.headline
  const highlight = careersPage.highlight
  const secondParts = second.split(highlight)

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[78svh] flex-col overflow-hidden bg-cream pt-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-[-6%] will-change-transform"
          style={{ y: bgY }}
        >
          <picture className="absolute inset-0 block h-full w-full">
            <source
              media="(min-width: 768px)"
              srcSet={careersPage.hero.desktopImage}
            />
            <img
              src={careersPage.hero.mobileImage}
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
            {careersPage.eyebrow}
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
            {careersPage.body}
          </p>
          <p className="mt-8 font-sans text-[10px] font-medium tracking-[0.18em] text-ink/45 uppercase">
            {careersPage.meta}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
            <SectionCta label="Apply Now" to="#apply" />
            <SectionCta
              label="Explore Benefits"
              to="#benefits"
              variant="outline"
            />
          </div>
        </FadeIn>
      </div>

      <a
        href="#benefits"
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

function CareersRail() {
  const [active, setActive] = useState(careersPage.rail[0]?.id ?? '')

  useEffect(() => {
    const sections = careersPage.rail
      .map((r) => document.getElementById(r.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!sections.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id)
        }
      },
      {
        rootMargin: '-30% 0px -50% 0px',
        threshold: [0.15, 0.35, 0.55],
      },
    )

    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <nav
      aria-label="Careers sections"
      className="sticky top-[68px] z-40 border-b border-mahogany/20 bg-cream/95 backdrop-blur-md sm:top-[72px]"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-5 py-3 [-ms-overflow-style:none] [scrollbar-width:none] md:px-8 lg:px-10 [&::-webkit-scrollbar]:hidden">
        {careersPage.rail.map((item) => {
          const isActive = active === item.id
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`relative shrink-0 px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors ${
                isActive ? 'text-mahogany' : 'text-ink/55 hover:text-ink'
              }`}
            >
              {item.label}
              <span
                className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-mahogany transition-transform duration-300 ${
                  isActive ? 'scale-x-100' : 'scale-x-0'
                }`}
                aria-hidden="true"
              />
            </a>
          )
        })}
      </div>
    </nav>
  )
}

function ProofRibbon() {
  const benefitCount = careersPage.benefits.groups.reduce(
    (sum, g) => sum + g.items.length,
    0,
  )
  const years = new Date().getFullYear() - company.since

  const stats = [
    {
      value: careersPage.form.departments.length,
      suffix: '',
      label: 'Open Departments',
    },
    {
      value: benefitCount,
      suffix: '',
      label: 'Benefits & Facilities',
    },
    {
      value: careersPage.culture.moments.length,
      suffix: '',
      label: 'Engagement Programmes',
    },
    {
      value: years,
      suffix: '+',
      label: 'Years of Growth',
    },
  ]

  return (
    <section className="border-b border-line/70 bg-cream-dark">
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

function BenefitPillars() {
  return (
    <section
      id="benefits"
      className="scroll-mt-[140px] border-t border-line/60 sm:scroll-mt-[148px]"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <FadeIn>
          <p
            className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase"
            style={{ color: MAHOGANY }}
          >
            How We Support You
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
            {careersPage.benefits.title}
          </h2>
          <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {careersPage.benefits.body}
          </p>
        </FadeIn>

        <ul className="mt-12 grid list-none gap-4 p-0 md:grid-cols-2 md:gap-5 lg:gap-6">
          {careersPage.benefits.groups.map((group, i) => {
            const Icon = BENEFIT_ICONS[group.id]
            return (
              <li key={group.id}>
                <FadeIn delay={0.06 * i} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line/70 bg-cream transition-all duration-300 hover:-translate-y-0.5 hover:border-mahogany/35 hover:shadow-[0_12px_32px_rgba(45,27,14,0.1)]">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-dark">
                      <img
                        src={group.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                        draggable={false}
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2d1b0e]/25 via-transparent to-transparent"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex flex-1 flex-col px-5 py-6 md:px-7 md:py-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Icon
                            className="h-5 w-5 text-mahogany"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          <h3 className="mt-4 font-serif text-xl font-medium tracking-tight text-ink md:text-2xl">
                            {group.title}
                          </h3>
                        </div>
                        <span className="font-sans text-[10px] font-medium tracking-[0.16em] text-ink/35 uppercase">
                          {String(group.items.length).padStart(2, '0')} items
                        </span>
                      </div>
                      <span
                        className="mt-4 block h-px w-8 bg-mahogany"
                        aria-hidden="true"
                      />
                      <ul className="mt-5 flex list-none flex-col gap-0 p-0">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 border-t border-line/50 py-3 font-sans text-sm leading-snug text-ink-muted first:border-t-0 first:pt-0 last:pb-0"
                          >
                            <span
                              className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-mahogany"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
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

function CulturePhotoStack({ images }: { images: string[] }) {
  const reduceMotion = useReducedMotion()
  const stackRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stackRef, { amount: 0.35 })
  const [active, setActive] = useState(0)
  const [aspectBySrc, setAspectBySrc] = useState<Record<string, number>>({})
  const n = images.length

  useEffect(() => {
    setActive(0)
  }, [images])

  useEffect(() => {
    if (reduceMotion || n < 2 || !inView) return
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % n)
    }, 3500)
    return () => window.clearInterval(id)
  }, [inView, n, reduceMotion])

  useEffect(() => {
    let cancelled = false
    for (const src of images) {
      if (!src) continue
      const img = new Image()
      img.onload = () => {
        if (cancelled || !img.naturalWidth || !img.naturalHeight) return
        const ratio = clampCultureAspect(img.naturalWidth / img.naturalHeight)
        setAspectBySrc((prev) =>
          prev[src] === ratio ? prev : { ...prev, [src]: ratio },
        )
      }
      img.src = src
    }
    return () => {
      cancelled = true
    }
  }, [images])

  if (n === 0) return null

  const frontSrc = images[active] ?? ''
  const aspectRatio = aspectBySrc[frontSrc] ?? CULTURE_ASPECT_FALLBACK

  const visible = reduceMotion
    ? [0]
    : [0, 1, 2].map((offset) => (active + offset) % n)

  return (
    <motion.div
      ref={stackRef}
      className="relative mx-auto w-full max-w-sm"
      style={{ aspectRatio }}
      animate={{ aspectRatio }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={false}
    >
      <AnimatePresence initial={false}>
        {visible.map((imageIndex, depth) => {
          const src = images[imageIndex]
          if (!src) return null
          const isFront = depth === 0
          const rotate = reduceMotion ? 0 : depth === 0 ? -2 : depth === 1 ? 5 : -7
          const y = reduceMotion ? 0 : depth * 14
          const x = reduceMotion ? 0 : depth === 0 ? 0 : depth === 1 ? 18 : -14
          const scale = 1 - depth * 0.05
          return (
            <motion.div
              key={`${src}-${imageIndex}-${depth === 0 ? active : `back-${depth}`}`}
              className="absolute inset-0 overflow-hidden rounded-2xl border border-mahogany/20 bg-cream shadow-[0_16px_40px_rgba(45,27,14,0.14)]"
              style={{ zIndex: 10 - depth, transformOrigin: 'center bottom' }}
              initial={
                reduceMotion || !isFront
                  ? false
                  : { opacity: 0, y: 28, rotate: -8, scale: 0.96 }
              }
              animate={{
                opacity: 1,
                y,
                x,
                rotate,
                scale,
              }}
              exit={
                reduceMotion
                  ? undefined
                  : { opacity: 0, y: -36, rotate: 10, scale: 0.94 }
              }
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-contain"
                draggable={false}
                loading={isFront ? 'eager' : 'lazy'}
                onLoad={(e) => {
                  const el = e.currentTarget
                  if (!el.naturalWidth || !el.naturalHeight) return
                  const ratio = clampCultureAspect(
                    el.naturalWidth / el.naturalHeight,
                  )
                  setAspectBySrc((prev) =>
                    prev[src] === ratio ? prev : { ...prev, [src]: ratio },
                  )
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2d1b0e]/25 via-transparent to-transparent"
                aria-hidden="true"
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}

function CultureLedger() {
  const reduceMotion = useReducedMotion()
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    fetchPublicCulture()
      .then((data) => {
        if (cancelled) return
        const urls = (data.items ?? [])
          .map((item: CultureImageDto) =>
            resolveDisplayImageUrl(item.viewUrl || item.driveUrl),
          )
          .filter(Boolean)
        setImages(urls)
      })
      .catch(() => {
        if (!cancelled) setImages([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      id="culture"
      className="scroll-mt-[140px] border-t border-line/60 bg-cream-dark sm:scroll-mt-[148px]"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div>
            <FadeIn>
              <p
                className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase"
                style={{ color: MAHOGANY }}
              >
                Life At Prabhakar
              </p>
              <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
                {careersPage.culture.title}
              </h2>
              <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
                {careersPage.culture.body}
              </p>
            </FadeIn>

            <ul className="mt-10 list-none space-y-0 p-0">
              {careersPage.culture.moments.map((moment, i) => (
                <li key={moment.title}>
                  <FadeIn delay={reduceMotion ? 0 : 0.03 * i}>
                    <article className="relative border-t border-mahogany/15 py-6 md:py-7">
                      <span
                        className="pointer-events-none absolute top-6 right-0 font-serif text-4xl font-light leading-none tracking-tight select-none md:top-7 md:text-5xl"
                        style={{ color: 'rgba(103,68,56,0.14)' }}
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="relative pr-14 font-serif text-xl font-medium tracking-tight text-ink md:text-2xl">
                        {moment.title}
                      </h3>
                      <p className="relative mt-2 max-w-md font-sans text-sm leading-relaxed text-ink-muted">
                        {moment.description}
                      </p>
                    </article>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </div>

          {images.length > 0 && (
            <FadeIn delay={0.08} className="lg:sticky lg:top-28">
              <CulturePhotoStack images={images} />
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  )
}

function ApplySection() {
  return (
    <section
      id="apply"
      className="scroll-mt-[140px] border-t border-line/60 sm:scroll-mt-[148px]"
    >
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <FadeIn>
          <p
            className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase"
            style={{ color: MAHOGANY }}
          >
            Join The Team
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
            {careersPage.form.title}
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {careersPage.form.body}
          </p>
        </FadeIn>

        <FadeIn delay={0.08} className="mt-10">
          <JobApplicationForm />
        </FadeIn>
      </div>
    </section>
  )
}

function CareersClosing() {
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
          src={careersPage.closing.texture}
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
            {careersPage.closing.headline[0]}
            <br />
            {careersPage.closing.headline[1]}
          </h2>
          <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {careersPage.closing.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <SectionCta
              label={careersPage.closing.primaryCta}
              to={careersPage.closing.primaryHref}
            />
            <SectionCta
              label={careersPage.closing.secondaryCta}
              to={`mailto:${company.email}`}
              variant="outline"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export function CareersPage() {
  return (
    <main className="bg-cream">
      <CareersHero />
      <CareersRail />
      <ProofRibbon />
      <BenefitPillars />
      <CultureLedger />
      <ApplySection />
      <CareersClosing />
    </main>
  )
}
