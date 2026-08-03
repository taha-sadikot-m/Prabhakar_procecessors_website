import { useMemo, useRef } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { people } from '../data/content'
import { SectionCta } from './SectionCta'

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

function PeopleHeading({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.div
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
    </motion.div>
  )
}

function PeopleQuote({
  reduceMotion,
  inView,
}: {
  reduceMotion: boolean | null
  inView: boolean
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: reduceMotion ? 0.2 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <QuoteReveal
        quote={people.quote}
        reduceMotion={reduceMotion}
        inView={inView}
      />
      <p className="mt-8 font-sans text-xs tracking-[0.08em] text-ink/55 md:text-sm">
        {people.attribution}
      </p>
    </motion.div>
  )
}

export function People() {
  const sectionRef = useRef<HTMLElement>(null)
  const desktopImageRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(sectionRef, { once: true, amount: 0.35 })

  const { scrollYProgress } = useScroll({
    target: desktopImageRef,
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
      className="relative scroll-mt-24 overflow-hidden"
      style={{ backgroundColor: CREAM }}
    >
      {/* —— Mobile: headline on image, quote below —— */}
      <div className="md:hidden">
        <div className="relative h-[60vh] w-full overflow-hidden">
          <img
            src={people.mobileImage}
            alt="Leadership — Anand, Vikas, and Shaleen Poddar"
            className="h-full w-full object-cover object-center"
            draggable={false}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[48%] bg-gradient-to-b from-[#FAF0E6]/90 via-[#FAF0E6]/50 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 top-0 z-10 px-6 pt-20">
            <PeopleHeading reduceMotion={reduceMotion} />
          </div>
        </div>
        <div className="relative z-10 px-6 py-10">
          <PeopleQuote reduceMotion={reduceMotion} inView={inView} />
          <div className="mt-8">
            <SectionCta label={people.cta} to={people.ctaHref} />
          </div>
        </div>
      </div>

      {/* —— Desktop: full-bleed overlay —— */}
      <div className="relative hidden min-h-svh md:block">
        <div
          ref={desktopImageRef}
          className="absolute inset-0"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-x-0 top-[-8%] h-[116%] w-full"
            style={{ y: imageY }}
          >
            <img
              src={people.desktopImage}
              alt=""
              className="h-full w-full object-cover object-right"
              draggable={false}
            />
          </motion.div>
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-full max-w-[52%] bg-gradient-to-r from-[#FAF0E6]/95 via-[#FAF0E6]/70 to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-svh items-start px-10 pt-28 pb-20 lg:px-14 lg:pt-32">
          <div className="w-full max-w-[42%]">
            <PeopleHeading reduceMotion={reduceMotion} />
            <div className="mt-10 md:mt-14">
              <PeopleQuote reduceMotion={reduceMotion} inView={inView} />
            </div>
            <div className="mt-10">
              <SectionCta label={people.cta} to={people.ctaHref} />
            </div>
          </div>
        </div>

        <span className="sr-only">
          Leadership — Anand, Vikas, and Shaleen Poddar
        </span>
      </div>
    </section>
  )
}
