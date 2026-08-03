import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { quality } from '../data/content'
import { SectionCta } from './SectionCta'

const AMBER = '#D69A2D'
const GOLD_WIRE = '#C9A24A'

/**
 * Arc in % of the full desktop section.
 * Shifted left into the cream mid-zone; endpoints still top-right → bottom-right.
 */
const ARC = { cx: 94, cy: 50, r: 52 } as const

const ANNOTATION_IDS = ['colour', 'print', 'surface', 'inspection', 'delivery'] as const

/** Mid-arc pins only — clear of top/bottom section edges. */
const PIN_ANGLES = [222, 201, 180, 159, 138] as const

/** Entrance timing — arc draws first, then cards/pins rise. */
const ARC_DURATION = 1.3
const ARC_DELAY = 0.15
const CARD_BASE_DELAY = ARC_DELAY + ARC_DURATION
const CARD_STAGGER = 0.14
const CARD_DURATION = 0.45

/** Mobile thin gold bow — end-to-end, deeper arch (viewBox 0 0 100 28). */
const MOBILE_ARC = {
  p0: { x: 0, y: 22 },
  p1: { x: 50, y: -6 },
  p2: { x: 100, y: 22 },
} as const
const MOBILE_ARC_PATH = `M ${MOBILE_ARC.p0.x} ${MOBILE_ARC.p0.y} Q ${MOBILE_ARC.p1.x} ${MOBILE_ARC.p1.y} ${MOBILE_ARC.p2.x} ${MOBILE_ARC.p2.y}`
const MOBILE_CARD_COUNT = quality.annotations.length
/** Full marquee cycle (one set of cards). */
const MOBILE_MARQUEE_MS = 32000
const MOBILE_PIN_MS = MOBILE_MARQUEE_MS / MOBILE_CARD_COUNT

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
          compact ? 'text-xl' : 'text-lg lg:text-xl'
        }`}
        style={{ color: active ? '#14110C' : '#1F1A14' }}
      >
        {title}
      </h3>
      <span
        className="mt-2 block h-px transition-colors duration-300"
        style={{
          width: compact ? '2.75rem' : '2.5rem',
          backgroundColor: active ? AMBER : 'rgba(214,154,45,0.7)',
        }}
        aria-hidden="true"
      />
      <p
        className={`font-sans leading-relaxed ${
          compact ? 'mt-3 text-sm' : 'mt-2.5 text-[11px] lg:text-xs'
        }`}
        style={{ color: 'rgba(44,44,44,0.6)' }}
      >
        {description}
      </p>
    </div>
  )
}

function MobileQuality({ reduceMotion }: { reduceMotion: boolean | null }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const resumeTimer = useRef<number | null>(null)

  const marqueeRunning = inView && !reduceMotion && !userPaused

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

  useEffect(() => {
    if (!marqueeRunning) return
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % MOBILE_CARD_COUNT)
    }, MOBILE_PIN_MS)
    return () => window.clearInterval(id)
  }, [marqueeRunning])

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
        @keyframes qualityMarquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .quality-marquee-track {
          animation: qualityMarquee ${MOBILE_MARQUEE_MS}ms linear infinite;
          will-change: transform;
        }
        .quality-marquee-track.is-paused {
          animation-play-state: paused;
        }
      `}</style>

      <img
        src={quality.mobileImage}
        alt=""
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
        <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-[#2C2C2C]/70">
          {quality.body}
        </p>
        <div className="mt-6">
          <SectionCta label={quality.cta} to={quality.ctaHref} />
        </div>
      </motion.div>

      {/* Thin gold arc — under cards */}
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
            stroke={GOLD_WIRE}
            strokeWidth={0.85}
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
                  'radial-gradient(circle at 35% 30%, #F3E0A8 0%, #C9A24A 45%, #8F6A1F 100%)',
                boxShadow: isActive
                  ? '0 0 0 3px rgba(214,154,45,0.35), 0 0 10px rgba(201,162,74,0.4)'
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

      {/* Cards above the wire — infinite marquee */}
      <div
        className="relative z-[10] flex-1 overflow-hidden pt-2 pb-8"
        onTouchStart={pauseForUser}
        onPointerDown={pauseForUser}
      >
        <div
          className={`quality-marquee-track flex w-max ${
            marqueeRunning ? '' : 'is-paused'
          }`}
        >
          {[0, 1].map((copy) => (
            <div
              key={`copy-${copy}`}
              className="flex shrink-0 gap-4 pr-4 pl-5"
              aria-hidden={copy === 1}
            >
              {cardSet.map((item, i) => {
                const active = i === activeIndex
                return (
                  <div key={`${copy}-${item.id}`} className="w-[16.5rem] shrink-0">
                    <motion.div
                      animate={{
                        scale: active ? 1 : 0.94,
                        opacity: active ? 1 : 0.62,
                      }}
                      transition={{ duration: 0.35, ease: easeOutQuart }}
                      className="rounded-xl border px-4 py-4 backdrop-blur-md"
                      style={{
                        backgroundColor: active
                          ? 'rgba(250,240,230,0.9)'
                          : 'rgba(250,240,230,0.68)',
                        borderColor: active
                          ? 'rgba(214,154,45,0.5)'
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
          ))}
        </div>
      </div>
    </div>
  )
}

export function Quality() {
  const reduceMotion = useReducedMotion()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="quality" className="scroll-mt-24" style={{ color: '#2C2C2C' }}>
      <MobileQuality reduceMotion={reduceMotion} />

      {/* Desktop — full-bleed image across the whole section */}
      <div className="relative hidden min-h-svh overflow-hidden md:block">
        <motion.img
          src={quality.desktopImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-right"
          draggable={false}
          initial={reduceMotion ? false : { scale: 0.98 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.4, ease: easeOutQuart }}
        />

        {/* Soft left wash for editorial copy */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(90deg, rgba(250,240,230,0.92) 0%, rgba(250,240,230,0.72) 28%, rgba(250,240,230,0.28) 48%, transparent 68%)',
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
          <p className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-[#2C2C2C]/75 lg:text-[15px]">
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
            stroke={GOLD_WIRE}
            strokeWidth={0.6}
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
          const active = hovered === pin.id
          const itemDelay = CARD_BASE_DELAY + i * CARD_STAGGER

          return (
            <div key={pin.id}>
              <motion.div
                className="pointer-events-none absolute z-[3]"
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportOnce}
                transition={{
                  duration: CARD_DURATION,
                  delay: itemDelay,
                  ease: easeOutQuart,
                }}
              >
                <span
                  className="relative block h-3 w-3 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle at 35% 30%, #F3E0A8 0%, #C9A24A 45%, #8F6A1F 100%)',
                    boxShadow: active
                      ? '0 0 0 4px rgba(214,154,45,0.35), 0 0 12px rgba(201,162,74,0.45)'
                      : '0 0 0 2px rgba(250,240,230,0.9), 0 1px 4px rgba(143,106,31,0.35)',
                    transition: 'box-shadow 0.3s ease',
                  }}
                />
              </motion.div>

              <div
                className="absolute z-[4] w-[13.5rem] lg:w-[15.5rem]"
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: 'translate(calc(-100% - 14px), -50%)',
                }}
              >
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
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
                    className="rounded-xl border px-4 py-3.5 backdrop-blur-md transition-[transform,border-color,box-shadow,background-color] duration-300 outline-none lg:px-4 lg:py-4"
                    style={{
                      backgroundColor: active
                        ? 'rgba(250,240,230,0.9)'
                        : 'rgba(250,240,230,0.74)',
                      borderColor: active
                        ? 'rgba(214,154,45,0.5)'
                        : 'rgba(45,27,14,0.14)',
                      boxShadow: active
                        ? '0 10px 28px rgba(45,27,14,0.14)'
                        : '0 6px 20px rgba(45,27,14,0.08)',
                      transform: active ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                    onMouseEnter={() => setHovered(pin.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(pin.id)}
                    onBlur={() => setHovered(null)}
                  >
                    <AnnotationCopy
                      index={pin.index}
                      title={content.title}
                      description={content.description}
                      active={active}
                    />
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
