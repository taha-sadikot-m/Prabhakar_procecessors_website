import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { quality } from '../data/content'
import { SectionCta } from './SectionCta'

const AMBER = '#674438'
const ACCENT = '#674438'
const HEADING = '#20222D'

/**
 * Desktop arc — right side; pins carry titles (descriptions on hover).
 */
const ARC = { cx: 118, cy: 50, r: 46 } as const

const ANNOTATION_IDS = ['colour', 'print', 'surface', 'inspection', 'delivery'] as const

/** Equal vertical slots (~14/32/50/68/86%). */
const PIN_ANGLES = [232, 203, 180, 157, 128] as const

/** Entrance timing — arc draws first, then pin labels rise. */
const ARC_DURATION = 1.3
const ARC_DELAY = 0.15
const CARD_BASE_DELAY = ARC_DELAY + ARC_DURATION
const CARD_STAGGER = 0.1
const CARD_DURATION = 0.45

/** Mobile thin mahogany bow — end-to-end, deeper arch (viewBox 0 0 100 28). */
const MOBILE_ARC = {
  p0: { x: 0, y: 22 },
  p1: { x: 50, y: -6 },
  p2: { x: 100, y: 22 },
} as const
const MOBILE_ARC_PATH = `M ${MOBILE_ARC.p0.x} ${MOBILE_ARC.p0.y} Q ${MOBILE_ARC.p1.x} ${MOBILE_ARC.p1.y} ${MOBILE_ARC.p2.x} ${MOBILE_ARC.p2.y}`
const MOBILE_CARD_COUNT = quality.annotations.length
/** Dwell time on each centered card before auto-advancing. */
const MOBILE_AUTOPLAY_MS = 3500
const MOBILE_CARD_WIDTH = 'min(16.5rem, 78vw)'

function quadPoint(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
) {
  const u = 1 - t
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  }
}

/** Five pin dots along the mobile arc (aligned with card indices). */
const MOBILE_DOTS = Array.from({ length: MOBILE_CARD_COUNT }, (_, i) => {
  const t = MOBILE_CARD_COUNT === 1 ? 0.5 : i / (MOBILE_CARD_COUNT - 1)
  return quadPoint(t, MOBILE_ARC.p0, MOBILE_ARC.p1, MOBILE_ARC.p2)
})

function polar(angleDeg: number, arc: { cx: number; cy: number; r: number }) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: arc.cx + arc.r * Math.cos(rad),
    y: arc.cy + arc.r * Math.sin(rad),
  }
}

const PINS = ANNOTATION_IDS.map((id, i) => {
  const { x, y } = polar(PIN_ANGLES[i], ARC)
  return {
    id,
    index: String(i + 1).padStart(2, '0'),
    x,
    y,
  }
})

function leftSemicirclePath() {
  const start = polar(270, ARC)
  const end = polar(90, ARC)
  return `M ${start.x} ${start.y} A ${ARC.r} ${ARC.r} 0 0 0 ${end.x} ${end.y}`
}

const ARC_PATH = leftSemicirclePath()

const easeOutQuart: [number, number, number, number] = [0.25, 1, 0.5, 1]
const viewportOnce = { once: true, amount: 0.2 } as const

function AnnotationCopy({
  index,
  title,
  description,
  active = false,
  compact = false,
}: {
  index: string
  title: string
  description: string
  active?: boolean
  compact?: boolean
}) {
  return (
    <div>
      <p
        className="font-sans font-semibold tracking-[0.2em]"
        style={{
          color: AMBER,
          fontSize: compact ? '11px' : '12px',
        }}
      >
        {index}
      </p>
      <h3
        className={`mt-1 font-serif font-medium tracking-tight transition-colors duration-300 ${
          compact ? 'text-xl' : 'text-base lg:text-lg'
        }`}
        style={{ color: HEADING }}
      >
        {title}
      </h3>
      <span
        className="mt-1.5 block h-px transition-colors duration-300 lg:mt-2"
        style={{
          width: compact ? '2.75rem' : '2.5rem',
          backgroundColor: active ? ACCENT : 'rgba(103,68,56,0.7)',
        }}
        aria-hidden="true"
      />
      <p
        className={`font-sans leading-relaxed ${
          compact ? 'mt-3 text-sm' : 'mt-2.5 text-[11px] lg:text-xs'
        }`}
        style={{ color: 'rgba(45,27,14,0.6)' }}
      >
        {description}
      </p>
    </div>
  )
}

function MobileQuality({ reduceMotion }: { reduceMotion: boolean | null }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [inView, setInView] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const resumeTimer = useRef<number | null>(null)
  const activeIndexRef = useRef(0)

  const autoplayRunning = inView && !reduceMotion && !userPaused

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.28 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const syncActiveFromScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const center = scroller.scrollLeft + scroller.clientWidth / 2
    let best = 0
    let bestDist = Number.POSITIVE_INFINITY
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(cardCenter - center)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    setActiveIndex(best)
  }

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    syncActiveFromScroll()
    scroller.addEventListener('scroll', syncActiveFromScroll, { passive: true })
    scroller.addEventListener('scrollend', syncActiveFromScroll)
    return () => {
      scroller.removeEventListener('scroll', syncActiveFromScroll)
      scroller.removeEventListener('scrollend', syncActiveFromScroll)
    }
  }, [])

  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const card = cardRefs.current[index]
    const scroller = scrollerRef.current
    if (!card || !scroller) return
    const left =
      card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2
    scroller.scrollTo({ left, behavior })
    setActiveIndex(index)
  }

  useEffect(() => {
    if (!autoplayRunning) return
    const id = window.setInterval(() => {
      const next = (activeIndexRef.current + 1) % MOBILE_CARD_COUNT
      scrollToIndex(next, 'smooth')
    }, MOBILE_AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [autoplayRunning])

  const pauseForUser = () => {
    setUserPaused(true)
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => {
      setUserPaused(false)
    }, 4500)
  }

  useEffect(
    () => () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current)
    },
    [],
  )

  const cardSet = quality.annotations

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden md:hidden"
    >
      <style>{`
        .quality-snap-scroller {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .quality-snap-scroller::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <img
        src={quality.mobileImage}
        alt=""
        width={768}
        height={1024}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center"
        draggable={false}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(250,240,230,0.94) 0%, rgba(250,240,230,0.55) 36%, rgba(250,240,230,0.22) 58%, rgba(250,240,230,0.5) 100%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-[5] px-5 pt-24"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.9, ease: easeOutQuart }}
      >
        <p
          className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
          style={{ color: AMBER }}
        >
          {quality.eyebrow}
        </p>
        <h2 className="mt-3 max-w-sm font-serif text-3xl font-medium tracking-tight">
          {quality.headline[0]}
          <br />
          <span className="italic" style={{ color: AMBER }}>
            {quality.headline[1]}
          </span>
        </h2>
        <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-ink-muted">
          {quality.body}
        </p>
        <div className="mt-6">
          <SectionCta label={quality.cta} to={quality.ctaHref} />
        </div>
      </motion.div>

      {/* Thin mahogany arc — under cards */}
      <div className="pointer-events-none relative z-[5] mt-5 w-full">
        <svg
          className="h-14 w-full"
          viewBox="0 0 100 28"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d={MOBILE_ARC_PATH}
            fill="none"
            stroke={ACCENT}
            strokeWidth={0.85}
            strokeOpacity={0.5}
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1.15, delay: 0.15, ease: easeOutQuart }}
          />
        </svg>
        {MOBILE_DOTS.map((dot, i) => {
          const isActive = i === activeIndex
          return (
            <motion.span
              key={`mobile-dot-${i}`}
              className="pointer-events-none absolute z-[1] block size-2.5 rounded-full"
              style={{
                left: `${dot.x}%`,
                top: `${(dot.y / 28) * 100}%`,
                background:
                  'radial-gradient(circle at 35% 30%, #C4A192 0%, #674438 45%, #3A241C 100%)',
                boxShadow: isActive
                  ? '0 0 0 3px rgba(103,68,56,0.35), 0 0 10px rgba(103,68,56,0.4)'
                  : '0 0 0 2px rgba(250,240,230,0.9)',
              }}
              initial={false}
              animate={{
                x: '-50%',
                y: '-50%',
                scale: isActive ? 1.25 : 1,
                opacity: isActive ? 1 : 0.7,
              }}
              transition={{ duration: 0.3, ease: easeOutQuart }}
            />
          )
        })}
      </div>

      {/* Snap carousel — one centered card at a time */}
      <div
        ref={scrollerRef}
        className="quality-snap-scroller relative z-[10] flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pt-2 pb-8"
        style={{
          scrollPaddingInline: `calc((100% - ${MOBILE_CARD_WIDTH}) / 2)`,
          paddingInline: `calc((100% - ${MOBILE_CARD_WIDTH}) / 2)`,
        }}
        onTouchStart={pauseForUser}
        onPointerDown={pauseForUser}
        onScroll={syncActiveFromScroll}
      >
        {cardSet.map((item, i) => {
          const active = i === activeIndex
          return (
            <div
              key={item.id}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              className="snap-center shrink-0"
              style={{ width: MOBILE_CARD_WIDTH }}
            >
              <motion.div
                animate={{
                  scale: active ? 1 : 0.92,
                  opacity: active ? 1 : 0.55,
                }}
                transition={{ duration: 0.35, ease: easeOutQuart }}
                className="rounded-xl border px-4 py-4 backdrop-blur-md"
                style={{
                  backgroundColor: active
                    ? 'rgba(250,240,230,0.92)'
                    : 'rgba(250,240,230,0.62)',
                  borderColor: active
                    ? 'rgba(103,68,56,0.55)'
                    : 'rgba(45,27,14,0.12)',
                  boxShadow: active
                    ? '0 12px 32px rgba(45,27,14,0.14)'
                    : '0 6px 18px rgba(45,27,14,0.07)',
                }}
              >
                <AnnotationCopy
                  index={String(i + 1).padStart(2, '0')}
                  title={item.title}
                  description={item.description}
                  active={active}
                  compact
                />
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Quality() {
  const reduceMotion = useReducedMotion()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section id="quality" className="scroll-mt-24" style={{ color: HEADING }}>
      <MobileQuality reduceMotion={reduceMotion} />

      {/* Desktop — pins + titles; description opens on hover */}
      <div className="relative hidden min-h-svh overflow-hidden md:block">
        <motion.img
          src={quality.desktopImage}
          alt=""
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-right"
          draggable={false}
          initial={reduceMotion ? false : { scale: 0.98 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.4, ease: easeOutQuart }}
        />

        <div
          className="pointer-events-none absolute inset-0 z-[1] backdrop-blur-[3px]"
          style={{
            background:
              'linear-gradient(90deg, rgba(250,240,230,0.82) 0%, rgba(250,240,230,0.48) 40%, rgba(250,240,230,0.28) 100%)',
          }}
          aria-hidden="true"
        />

        <motion.div
          className="relative z-[5] flex h-full min-h-svh max-w-md flex-col justify-center px-10 py-24 lg:max-w-lg lg:px-14 xl:px-16"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: easeOutQuart }}
        >
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: AMBER }}
          >
            {quality.eyebrow}
          </p>
          <h2 className="mt-5 font-serif text-4xl font-medium tracking-tight lg:text-5xl">
            {quality.headline[0]}
            <br />
            <span className="italic" style={{ color: AMBER }}>
              {quality.headline[1]}
            </span>
          </h2>
          <p className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-ink-muted lg:text-[15px]">
            {quality.body}
          </p>
          <div className="mt-8">
            <SectionCta label={quality.cta} to={quality.ctaHref} />
          </div>
        </motion.div>

        <svg
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d={ARC_PATH}
            fill="none"
            stroke={ACCENT}
            strokeWidth={0.55}
            strokeOpacity={0.45}
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={viewportOnce}
            transition={{
              duration: ARC_DURATION,
              delay: ARC_DELAY,
              ease: easeOutQuart,
            }}
          />
        </svg>

        {PINS.map((pin, i) => {
          const content = quality.annotations.find((item) => item.id === pin.id)
          if (!content) return null
          const active = hoveredId === pin.id
          const itemDelay = CARD_BASE_DELAY + i * CARD_STAGGER

          return (
            <div
              key={pin.id}
              className={`absolute ${active ? 'z-[6]' : 'z-[4]'}`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              onMouseEnter={() => setHoveredId(pin.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <motion.button
                type="button"
                aria-label={content.title}
                className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#674438]/60"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportOnce}
                transition={{
                  duration: CARD_DURATION,
                  delay: itemDelay,
                  ease: easeOutQuart,
                }}
                onFocus={() => setHoveredId(pin.id)}
                onBlur={() => setHoveredId(null)}
              >
                <span
                  className="block h-3 w-3 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle at 35% 30%, #C4A192 0%, #674438 45%, #3A241C 100%)',
                    boxShadow: active
                      ? '0 0 0 4px rgba(103,68,56,0.35), 0 0 12px rgba(103,68,56,0.45)'
                      : '0 0 0 2px rgba(250,240,230,0.9), 0 1px 4px rgba(143,106,31,0.35)',
                    transition: 'box-shadow 0.3s ease',
                  }}
                />
              </motion.button>

              <div
                className="absolute w-[12rem] lg:w-[14rem]"
                style={{
                  left: '-12px',
                  top: 0,
                  transform: 'translate(calc(-100% - 0px), -50%)',
                }}
              >
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{
                    duration: CARD_DURATION,
                    delay: itemDelay,
                    ease: easeOutQuart,
                  }}
                >
                  <div
                    role="group"
                    tabIndex={0}
                    className="rounded-xl border px-3.5 py-2.5 text-left backdrop-blur-md outline-none transition-[border-color,box-shadow,background-color] duration-300 lg:px-4 lg:py-3"
                    style={{
                      backgroundColor: active
                        ? 'rgba(250,240,230,0.95)'
                        : 'rgba(250,240,230,0.88)',
                      borderColor: active
                        ? 'rgba(103,68,56,0.45)'
                        : 'rgba(45,27,14,0.14)',
                      boxShadow: active
                        ? '0 10px 28px rgba(45,27,14,0.14)'
                        : '0 6px 18px rgba(45,27,14,0.08)',
                    }}
                    onFocus={() => setHoveredId(pin.id)}
                    onBlur={() => setHoveredId(null)}
                    aria-expanded={active}
                    aria-describedby={
                      active ? `quality-desc-${pin.id}` : undefined
                    }
                  >
                    <span
                      className="block font-sans text-[10px] font-semibold tracking-[0.2em] lg:text-[11px]"
                      style={{ color: AMBER }}
                    >
                      {pin.index}
                    </span>
                    <span
                      className="mt-0.5 block font-serif text-base font-medium tracking-tight lg:text-lg"
                      style={{ color: HEADING }}
                    >
                      {content.title}
                    </span>

                    <div
                      id={`quality-desc-${pin.id}`}
                      className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
                      style={{
                        maxHeight: active ? '4.5rem' : '0',
                        opacity: active ? 1 : 0,
                      }}
                    >
                      <span
                        className="mt-2 block h-px w-10"
                        style={{ backgroundColor: ACCENT }}
                        aria-hidden="true"
                      />
                      <p
                        className="mt-2 font-sans text-[11px] leading-relaxed lg:text-xs"
                        style={{ color: 'rgba(45,27,14,0.65)' }}
                      >
                        {content.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
