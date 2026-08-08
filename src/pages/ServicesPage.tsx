import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { servicesPage } from '../data/content'
import { CountUp } from '../components/motion/CountUp'
import { FadeIn } from '../components/motion/FadeIn'
import { SectionCta } from '../components/SectionCta'
import { SwatchFan } from '../components/SwatchFan'
import {
  fetchPublicServices,
  type ServiceCategoryDto,
} from '../lib/cms-api'

const MAHOGANY = '#674438'
const HEADING = '#20222D'

type Category = ServiceCategoryDto

function DiamondRule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-8 bg-mahogany/30" />
      <span className="h-1.5 w-1.5 rotate-45 bg-mahogany" />
      <span className="h-px w-8 bg-mahogany/30" />
    </div>
  )
}

function ServicesHero() {
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

  const [before, after] = servicesPage.headline
  const highlight = servicesPage.highlight
  // Headline is ["The", "Swatch Book."] — highlight "Swatch" inside second part
  const secondParts = after.split(highlight)

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[78svh] flex-col overflow-hidden bg-cream pt-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div className="absolute inset-[-6%] will-change-transform" style={{ y: bgY }}>
          <picture className="absolute inset-0 block h-full w-full">
            <source
              media="(min-width: 768px)"
              srcSet={servicesPage.hero.desktopImage}
            />
            <img
              src={servicesPage.hero.mobileImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_35%] md:object-[center_40%]"
              draggable={false}
            />
          </picture>
        </motion.div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-transparent md:via-cream/75"
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
            {servicesPage.eyebrow}
          </p>
          <h1 className="mt-5 font-serif text-[2.5rem] leading-[1.08] font-medium tracking-tight text-ink md:text-5xl lg:text-[3.5rem]">
            {before}{' '}
            <span className="text-mahogany">{highlight}</span>
            {secondParts[1] ?? ''}
          </h1>
          <DiamondRule className="mt-6" />
          <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {servicesPage.body}
          </p>
          <p className="mt-8 font-sans text-[10px] font-medium tracking-[0.18em] text-ink/45 uppercase">
            {servicesPage.meta}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

function CategoryRail({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(categories[0]?.id ?? '')

  useEffect(() => {
    setActive(categories[0]?.id ?? '')
  }, [categories])

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(c.id))
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
  }, [categories])

  return (
    <nav
      aria-label="Service categories"
      className="sticky top-[68px] z-40 border-b border-mahogany/20 bg-cream/95 backdrop-blur-md sm:top-[72px]"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-5 py-3 [-ms-overflow-style:none] [scrollbar-width:none] md:px-8 lg:px-10 [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const isActive = active === category.id
          const count = category.services.length
          return (
            <a
              key={category.id}
              href={`#${category.id}`}
              className={`relative shrink-0 px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors ${
                isActive ? 'text-mahogany' : 'text-ink/55 hover:text-ink'
              }`}
            >
              {category.title}
              <span className="ml-1.5 font-medium opacity-60">({count})</span>
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

function CategorySection({
  category,
  index,
}: {
  category: Category
  index: number
}) {
  // Alternate: even index → fan left / panel right; odd → fan right / panel left
  const fanOnRight = index % 2 === 1

  return (
    <section
      id={category.id}
      className="scroll-mt-[140px] overflow-x-clip border-t border-line/60 sm:scroll-mt-[148px]"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <FadeIn>
          <div className="flex flex-wrap items-end gap-4 md:gap-6">
            <p
              className="font-serif text-6xl font-light leading-none tracking-tight md:text-7xl"
              style={{ color: 'rgba(103,68,56,0.16)' }}
              aria-hidden="true"
            >
              {category.numeral}
            </p>
            <div className="pb-1">
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
                  {category.title}
                </h2>
                <span className="font-sans text-[11px] font-medium tracking-[0.16em] text-ink/40 uppercase">
                  {category.services.length} services
                </span>
              </div>
              <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
                {category.intro}
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <SwatchFan category={category} fanOnRight={fanOnRight} />
        </FadeIn>
      </div>
    </section>
  )
}

function CapabilityStrip() {
  return (
    <section className="border-y border-line/70 bg-cream-dark">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 py-14 md:grid-cols-4 md:gap-0 md:px-8 md:py-16 lg:px-10">
        {servicesPage.specs.map((stat, i) => (
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

function AlsoAvailable() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-20">
        <FadeIn>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
            {servicesPage.alsoAvailable.title}
          </h2>
          <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {servicesPage.alsoAvailable.body}
          </p>
        </FadeIn>
        <ul className="mt-10 flex list-none flex-wrap gap-2.5 p-0 md:gap-3">
          {servicesPage.alsoAvailable.items.map((item, i) => (
            <li key={item}>
              <FadeIn delay={0.03 * i}>
                <span className="inline-block rounded-lg border border-mahogany/25 bg-cream-light px-3.5 py-2 font-sans text-[12px] tracking-[0.04em] text-ink/75 transition-colors hover:border-mahogany/50 hover:text-ink md:text-sm">
                  {item}
                </span>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ServicesClosing() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [1, 1.05],
  )

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[64svh] items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={{ scale: bgScale }}
        aria-hidden="true"
      >
        <picture className="block h-full w-full">
          <source
            media="(min-width: 768px)"
            srcSet={servicesPage.closing.desktopImage}
          />
          <img
            src={servicesPage.closing.mobileImage}
            alt=""
            className="h-full w-full object-cover object-center"
            draggable={false}
          />
        </picture>
      </motion.div>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(250, 240, 230, 0.7)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-20 text-center md:px-8">
        <FadeIn>
          <h2
            className="font-serif text-3xl leading-[1.12] font-light tracking-tight italic md:text-4xl lg:text-[2.75rem]"
            style={{ color: HEADING }}
          >
            {servicesPage.closing.headline[0]}
            <br />
            {servicesPage.closing.headline[1]}
          </h2>
          <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {servicesPage.closing.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <SectionCta
              label={servicesPage.closing.primaryCta}
              to={servicesPage.closing.primaryHref}
            />
            <SectionCta
              label={servicesPage.closing.secondaryCta}
              to={servicesPage.closing.secondaryHref}
              variant="outline"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>(
    () => servicesPage.categories as Category[],
  )

  useEffect(() => {
    let cancelled = false
    fetchPublicServices()
      .then((data) => {
        if (cancelled) return
        if (data.categories?.length) setCategories(data.categories)
      })
      .catch(() => {
        /* keep static fallback */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="bg-cream">
      <ServicesHero />
      <CategoryRail categories={categories} />
      {categories.map((category, index) => (
        <CategorySection
          key={category.id}
          category={category}
          index={index}
        />
      ))}
      <CapabilityStrip />
      <AlsoAvailable />
      <ServicesClosing />
    </main>
  )
}
