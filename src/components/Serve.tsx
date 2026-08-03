import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { serve } from '../data/content'

const GOLD = '#D4AF37'
const CREAM = '#FAF0E6'
const AUTO_MS = 5000
const PAUSE_MS = 4500

export function Serve() {
  const sectionRef = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [inView, setInView] = useState(false)
  const pauseUntilRef = useRef(0)
  const reduceMotion = useReducedMotion()
  const count = serve.slides.length
  const slide = serve.slides[current]

  const goTo = useCallback(
    (index: number, fromUser = false) => {
      const next = ((index % count) + count) % count
      if (next === current) return
      const wrappingForward = current === count - 1 && next === 0
      const wrappingBack = current === 0 && next === count - 1
      setDirection(
        wrappingForward ? 1 : wrappingBack ? -1 : next > current ? 1 : -1,
      )
      setCurrent(next)
      if (fromUser) pauseUntilRef.current = Date.now() + PAUSE_MS
    },
    [count, current],
  )

  const next = useCallback(
    (fromUser = false) => goTo(current + 1, fromUser),
    [current, goTo],
  )
  const prev = useCallback(
    (fromUser = false) => goTo(current - 1, fromUser),
    [current, goTo],
  )

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5, 1] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduceMotion || !inView) return
    const id = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return
      setCurrent((c) => {
        const n = (c + 1) % count
        setDirection(1)
        return n
      })
    }, AUTO_MS)
    return () => window.clearInterval(id)
  }, [reduceMotion, inView, count])

  const touchStartX = useRef<number | null>(null)

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current == null) return
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 48) return
    if (dx < 0) next(true)
    else prev(true)
  }

  const textDuration = reduceMotion ? 0.15 : 0.45
  const imageDuration = reduceMotion ? 0.2 : 0.6

  return (
    <section
      ref={sectionRef}
      id="serve"
      className="relative min-h-svh scroll-mt-24 overflow-hidden"
      style={{ backgroundColor: CREAM }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Full-bleed image stack */}
      <div className="absolute inset-0" aria-hidden="true">
        {serve.slides.map((s) => (
          <motion.div
            key={s.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: s.id === slide.id ? 1 : 0 }}
            transition={{ duration: imageDuration, ease: 'easeInOut' }}
          >
            <picture>
              <source media="(min-width: 768px)" srcSet={s.desktopImage} />
              <img
                src={s.mobileImage}
                alt=""
                className="h-full w-full object-cover object-left md:object-left"
                draggable={false}
              />
            </picture>
          </motion.div>
        ))}
      </div>

      {/* Soft left readability gradient */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-full max-w-xl bg-gradient-to-r from-[#FAF0E6]/92 via-[#FAF0E6]/55 to-transparent md:max-w-[48%]"
        aria-hidden="true"
      />

      {/* Text overlay */}
      <div className="relative z-10 flex min-h-svh items-center px-6 py-14 md:px-10 md:py-16 lg:px-14">
        <div className="w-full max-w-md md:max-w-[38%]">
          <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-ink/50 uppercase">
            {serve.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-[2.35rem] leading-[1.08] font-medium tracking-tight text-ink/90 md:text-4xl lg:text-[2.65rem]">
            {serve.headline[0]}
            <br />
            {serve.headline[1]}
          </h2>

          <div className="relative mt-10 min-h-[9.5rem] md:mt-12 md:min-h-[10.5rem]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -16 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 12 }
                }
                transition={{
                  duration: textDuration,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p
                  className="font-sans text-xs font-semibold tracking-[0.2em] uppercase md:text-[13px]"
                  style={{ color: GOLD }}
                >
                  {slide.category}
                </p>
                <span
                  className="mt-3 block h-px w-8"
                  style={{ backgroundColor: GOLD }}
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-serif text-3xl leading-tight font-medium tracking-tight text-ink md:text-[2.35rem]">
                  {slide.headline}
                </h3>
                <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-ink/70 md:text-[0.95rem]">
                  {slide.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center gap-4 md:mt-12">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => prev(true)}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-[#FAF0E6]/40 text-ink/70 backdrop-blur-sm transition hover:border-ink/30 hover:text-ink md:inline-flex"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <div
              className="flex items-center gap-2.5"
              role="tablist"
              aria-label="Who we serve slides"
            >
              {serve.slides.map((s, i) => {
                const active = i === current
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Show ${s.category}`}
                    onClick={() => goTo(i, true)}
                    className="relative flex h-3 w-3 items-center justify-center"
                  >
                    <motion.span
                      className="block rounded-full"
                      animate={{
                        scale: active ? 1.15 : 1,
                        backgroundColor: active
                          ? GOLD
                          : 'rgba(44,44,44,0.28)',
                      }}
                      transition={{ duration: reduceMotion ? 0.1 : 0.25 }}
                      style={{ width: 8, height: 8 }}
                    />
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              aria-label="Next slide"
              onClick={() => next(true)}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-[#FAF0E6]/40 text-ink/70 backdrop-blur-sm transition hover:border-ink/30 hover:text-ink md:inline-flex"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
