import { useMemo, useRef } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { people } from '../data/content'

const CREAM = '#FAF0E6'
const GOLD = '#D4AF37'

function QuoteReveal({
  quote,
  reduceMotion,
  inView,
}: {
  quote: string
  reduceMotion: boolean | null
  inView: boolean
}) {
  const words = useMemo(() => quote.split(' '), [quote])

  if (reduceMotion) {
    return (
      <p className="font-serif text-2xl leading-snug text-ink italic md:text-[1.85rem] lg:text-[2.05rem]">
        “{quote}”
      </p>
    )
  }

  return (
    <p
      className="font-serif text-2xl leading-snug text-ink italic md:text-[1.85rem] lg:text-[2.05rem]"
      aria-label={quote}
    >
      <span aria-hidden="true">“</span>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            className="inline-block pr-[0.28em]"
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3 + i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
      <span aria-hidden="true">”</span>
    </p>
  )
}

export function People() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(sectionRef, { once: true, amount: 0.35 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : ['-6%', '6%'],
  )

  return (
    <section
      ref={sectionRef}
      id="people"
      className="relative min-h-svh scroll-mt-24 overflow-hidden"
      style={{ backgroundColor: CREAM }}
    >
      {/* Full-bleed leadership image */}
      <div className="absolute inset-0" aria-hidden="true">
        <motion.div
          className="absolute inset-x-0 top-[-8%] h-[116%] w-full"
          style={{ y: imageY }}
        >
          <picture className="block h-full w-full">
            <source media="(min-width: 768px)" srcSet={people.desktopImage} />
            <img
              src={people.mobileImage}
              alt=""
              className="h-full w-full object-cover object-center md:object-right"
              draggable={false}
            />
          </picture>
        </motion.div>
      </div>

      {/* Soft left readability gradient — desktop only */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-full max-w-[52%] bg-gradient-to-r from-[#FAF0E6]/95 via-[#FAF0E6]/70 to-transparent md:block"
        aria-hidden="true"
      />

      {/* Text overlay — top-aligned */}
      <div className="relative z-10 flex min-h-svh items-start px-6 pt-20 pb-16 md:px-10 md:pt-28 md:pb-20 lg:px-14 lg:pt-32">
        <motion.div
          className="w-full max-w-md md:max-w-[42%]"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: reduceMotion ? 0.2 : 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: GOLD }}
          >
            {people.eyebrow}
          </p>
          <h2 className="mt-5 font-serif text-[2.35rem] leading-[1.08] font-medium tracking-tight text-ink md:text-4xl lg:text-[2.85rem]">
            {people.headline[0]}
            <br />
            {people.headline[1]}
          </h2>

          <div className="mt-10 md:mt-14">
            <QuoteReveal
              quote={people.quote}
              reduceMotion={reduceMotion}
              inView={inView}
            />
          </div>

          <p className="mt-8 font-sans text-xs tracking-[0.08em] text-ink/55 md:text-sm">
            {people.attribution}
          </p>
        </motion.div>
      </div>

      <span className="sr-only">
        Leadership — Anand, Vikas, and Shaleen Poddar
      </span>
    </section>
  )
}
