import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type TouchEvent,
} from 'react'
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import type { ServiceCategoryDto } from '../lib/cms-api'
import { resolveDisplayImageUrl } from '../lib/media-url'

const MAHOGANY = '#674438'

type Category = ServiceCategoryDto

type FlightSource = {
  rect: DOMRect
  angle: number
  serviceId: string
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

/** Weighted slot angles so the active card's slot collapses and neighbours close in. */
function computeFanAngles(
  count: number,
  activeIndex: number,
  arc: number,
): number[] {
  if (count <= 0) return []
  if (count === 1) return [0]

  const weights = Array.from({ length: count }, (_, i) =>
    i === activeIndex ? 0.3 : 1,
  )
  const total = weights.reduce((a, b) => a + b, 0)
  let cum = 0
  return weights.map((w) => {
    const center = cum + w / 2
    cum += w
    return arc * (center / total) - arc / 2
  })
}

function shadowForDist(dist: number) {
  if (dist < 0.75) return '0 14px 34px rgba(45,27,14,0.18)'
  if (dist < 1.75) return '0 10px 26px rgba(45,27,14,0.13)'
  return '0 6px 16px rgba(45,27,14,0.09)'
}

export function SwatchFan({
  category,
  fanOnRight,
}: {
  category: Category
  fanOnRight: boolean
}) {
  const services = category.services
  const reduceMotion = useReducedMotion()
  const [activeId, setActiveId] = useState(services[0]?.id ?? '')
  const [hovered, setHovered] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 1024px)').matches,
  )
  const [unfolded, setUnfolded] = useState(false)
  const [entranceDone, setEntranceDone] = useState(false)

  // Keep selection valid when CMS replaces category.services (or empties it).
  useEffect(() => {
    setActiveId((prev) => {
      if (services.some((s) => s.id === prev)) return prev
      return services[0]?.id ?? ''
    })
  }, [services])

  const fanRef = useRef<HTMLDivElement>(null)
  const inView = useInView(fanRef, { once: true, margin: '-80px' })
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const panelCardRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const mobileStripInView = useInView(mobileScrollRef, {
    amount: 0.45,
    once: true,
  })
  const pendingFlight = useRef<FlightSource | null>(null)
  const touchStartX = useRef<number | null>(null)
  const scrollingFromSelect = useRef(false)
  const mobileScrollRaf = useRef(0)
  const hintPlayed = useRef(false)
  const hintCancelled = useRef(false)
  const hintTimers = useRef<number[]>([])
  const controls = useAnimationControls()

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (inView) setUnfolded(true)
  }, [inView])

  useEffect(() => {
    if (!unfolded) return
    if (reduceMotion) {
      setEntranceDone(true)
      return
    }
    const ms = services.length * 50 + 450
    const t = window.setTimeout(() => setEntranceDone(true), ms)
    return () => window.clearTimeout(t)
  }, [unfolded, reduceMotion, services.length])

  const n = services.length
  const CARD_W = isDesktop ? 180 : 112
  const CARD_H = (CARD_W * 4) / 3
  const PIVOT_RATIO = isDesktop ? 1.25 : 1.5
  const PIVOT_Y = CARD_H * PIVOT_RATIO
  const CONTAINER_H = PIVOT_Y + (isDesktop ? 28 : 20)
  const originY = `${PIVOT_RATIO * 100}%`

  const largeDeck = n >= 7
  const TARGET_ARC = isDesktop
    ? largeDeck
      ? 88
      : 64
    : largeDeck
      ? 62
      : 46
  const MIN_STEP = isDesktop ? 14 : 10
  const MAX_STEP = isDesktop
    ? largeDeck
      ? 32
      : 26
    : largeDeck
      ? 24
      : 20
  const step =
    n <= 1 ? 0 : clamp(TARGET_ARC / (n - 1), MIN_STEP, MAX_STEP)
  const arc = step * Math.max(n - 1, 0)

  const activeIndex = Math.max(
    0,
    services.findIndex((s) => s.id === activeId),
  )
  const active = services[activeIndex] ?? services[0]
  const mid = (n - 1) / 2
  const hoverIndex = hovered
    ? services.findIndex((s) => s.id === hovered)
    : -1
  const focusIndex = hoverIndex >= 0 ? hoverIndex : activeIndex

  const baseAngles = useMemo(
    () => computeFanAngles(n, activeIndex, arc),
    [n, activeIndex, arc],
  )

  const panelId = (id: string) => `${category.id}-panel-${id}`
  const tabId = (id: string) => `${category.id}-tab-${id}`

  const spring = reduceMotion
    ? { duration: 0.01 }
    : { type: 'spring' as const, stiffness: 260, damping: 26, mass: 0.9 }

  const select = useCallback(
    (id: string, fromUser = false) => {
      if (id === activeId) return
      const index = services.findIndex((s) => s.id === id)
      if (index < 0) return

      hintCancelled.current = true
      for (const timerId of hintTimers.current) window.clearTimeout(timerId)
      hintTimers.current = []

      const el = cardRefs.current[id]
      if (el && !reduceMotion && fromUser && isDesktop) {
        pendingFlight.current = {
          rect: el.getBoundingClientRect(),
          angle: baseAngles[index] ?? 0,
          serviceId: id,
        }
      } else {
        pendingFlight.current = null
      }
      setActiveId(id)
    },
    [activeId, baseAngles, isDesktop, reduceMotion, services],
  )

  const stepBy = useCallback(
    (delta: number) => {
      const next = clamp(activeIndex + delta, 0, n - 1)
      if (next === activeIndex) return
      select(services[next].id, true)
      cardRefs.current[services[next].id]?.focus()
    },
    [activeIndex, n, select, services],
  )

  const scrollMobileToIndex = useCallback(
    (index: number, smooth: boolean) => {
      const root = mobileScrollRef.current
      if (!root) return
      const slide = root.children[index] as HTMLElement | undefined
      if (!slide) return
      scrollingFromSelect.current = true
      slide.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: smooth && !reduceMotion ? 'smooth' : 'auto',
      })
      window.setTimeout(() => {
        scrollingFromSelect.current = false
      }, reduceMotion ? 50 : 450)
    },
    [reduceMotion],
  )

  useEffect(() => {
    if (isDesktop || n === 0) return
    scrollMobileToIndex(activeIndex, true)
  }, [activeIndex, isDesktop, n, scrollMobileToIndex])

  const onMobileScroll = useCallback(() => {
    if (scrollingFromSelect.current || isDesktop) return
    const root = mobileScrollRef.current
    if (!root) return
    window.cancelAnimationFrame(mobileScrollRaf.current)
    mobileScrollRaf.current = window.requestAnimationFrame(() => {
      const center = root.scrollLeft + root.clientWidth / 2
      let best = 0
      let bestDist = Infinity
      for (let i = 0; i < root.children.length; i++) {
        const child = root.children[i] as HTMLElement
        const midX = child.offsetLeft + child.offsetWidth / 2
        const dist = Math.abs(midX - center)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      }
      const id = services[best]?.id
      if (id && id !== activeId) {
        pendingFlight.current = null
        setActiveId(id)
      }
    })
  }, [activeId, isDesktop, services])

  const cancelScrollHint = useCallback(() => {
    if (hintCancelled.current && hintTimers.current.length === 0) return
    hintCancelled.current = true
    for (const id of hintTimers.current) window.clearTimeout(id)
    hintTimers.current = []
    scrollingFromSelect.current = false
  }, [])

  useEffect(() => {
    hintPlayed.current = false
    hintCancelled.current = false
    for (const id of hintTimers.current) window.clearTimeout(id)
    hintTimers.current = []
  }, [category.id])

  useEffect(() => {
    if (
      isDesktop ||
      reduceMotion ||
      n < 2 ||
      !mobileStripInView ||
      hintPlayed.current
    ) {
      return
    }

    const root = mobileScrollRef.current
    if (!root) return

    hintPlayed.current = true
    hintCancelled.current = false

    const startId = window.setTimeout(() => {
      if (hintCancelled.current || isDesktop) return
      const width = root.clientWidth
      if (width <= 0) return

      const base = root.scrollLeft
      const peek = width * 0.15
      scrollingFromSelect.current = true
      root.scrollTo({ left: base + peek, behavior: 'smooth' })

      const backId = window.setTimeout(() => {
        if (hintCancelled.current) {
          scrollingFromSelect.current = false
          return
        }
        root.scrollTo({ left: base, behavior: 'smooth' })
        const doneId = window.setTimeout(() => {
          scrollingFromSelect.current = false
        }, 420)
        hintTimers.current.push(doneId)
      }, 560)
      hintTimers.current.push(backId)
    }, 700)
    hintTimers.current.push(startId)

    return () => {
      for (const id of hintTimers.current) window.clearTimeout(id)
      hintTimers.current = []
      scrollingFromSelect.current = false
    }
  }, [isDesktop, mobileStripInView, n, reduceMotion, category.id])

  useLayoutEffect(() => {
    if (!isDesktop) return
    const flight = pendingFlight.current
    pendingFlight.current = null
    const panel = panelCardRef.current
    if (!panel) return

    if (!flight || reduceMotion || flight.serviceId !== activeId) {
      controls.set({ x: 0, y: 0, scale: 1, rotate: 0 })
      return
    }

    const last = panel.getBoundingClientRect()
    const first = flight.rect
    const dx = first.left + first.width / 2 - (last.left + last.width / 2)
    const dy = first.top + first.height / 2 - (last.top + last.height / 2)
    const scale = Math.max(0.15, first.width / Math.max(last.width, 1))

    controls.set({ x: dx, y: dy, scale, rotate: flight.angle })
    void controls.start({
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    })
  }, [activeId, controls, isDesktop, reduceMotion])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      stepBy(1)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      stepBy(-1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      select(services[0].id, true)
      cardRefs.current[services[0].id]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      const last = services[n - 1]
      select(last.id, true)
      cardRefs.current[last.id]?.focus()
    }
  }

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current == null) return
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 40) return
    stepBy(dx < 0 ? 1 : -1)
  }

  if (n === 0 || !active) {
    return null
  }

  const fan = (
    <div
      ref={fanRef}
      role="tablist"
      aria-label={`${category.title} services`}
      aria-orientation="horizontal"
      className={`relative mx-auto w-full touch-pan-y overflow-visible ${
        isDesktop ? 'max-w-none' : 'max-w-md'
      }`}
      style={{ height: CONTAINER_H }}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Riveted spine at the pivot */}
      <div
        className="pointer-events-none absolute left-1/2 z-[60] -translate-x-1/2 -translate-y-1/2"
        style={{ top: PIVOT_Y }}
        aria-hidden="true"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-mahogany/10"
          style={{
            width: isDesktop ? 120 : 88,
            height: isDesktop ? 120 : 88,
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-mahogany/20"
          style={{
            width: isDesktop ? 88 : 64,
            height: isDesktop ? 88 : 64,
          }}
        />
        <div className="relative h-4 w-4">
          <span className="absolute inset-0 rounded-full bg-mahogany shadow-[0_2px_6px_rgba(45,27,14,0.25)]" />
          <span className="absolute inset-[-3px] rounded-full border border-mahogany/40" />
          <span className="absolute inset-[5px] rounded-full bg-cream/40" />
        </div>
      </div>

      {services.map((service, i) => {
        const selected = service.id === activeId
        const isHovered = hovered === service.id && !selected
        const isFocused = focused === service.id
        const dist = Math.abs(i - mid)
        const depthScale = 1 - dist * 0.02
        const veil = dist * 0.08

        let hoverBoost = 0
        if (hoverIndex >= 0 && !selected && i !== hoverIndex) {
          const d = i - hoverIndex
          hoverBoost = Math.sign(d) * Math.max(0, 6 - Math.abs(d) * 2)
        }

        const angle = (baseAngles[i] ?? 0) + hoverBoost
        const lift = isHovered ? -14 : 0
        const faceScale = isHovered ? 1.04 : 1
        const uniformScale = selected ? 1 : depthScale * faceScale

        const resting = {
          rotate: angle,
          y: lift,
          opacity: selected ? 0.22 : 1,
          scaleX: selected ? 0.1 : uniformScale,
          scaleY: selected ? 1 : uniformScale,
        }
        const entrance = {
          rotate: 0,
          y: 18,
          opacity: 0,
          scaleX: 1,
          scaleY: 1,
        }
        const open = reduceMotion || unfolded
        const stackRank = n - Math.abs(i - focusIndex)
        const cardZ = selected
          ? 2
          : isFocused || isHovered
            ? 50 + stackRank
            : 20 + stackRank

        return (
          <div
            key={service.id}
            className={`absolute top-0 left-1/2 -translate-x-1/2${
              selected ? ' pointer-events-none' : ''
            }`}
            style={{
              width: CARD_W,
              height: CARD_H,
              zIndex: cardZ,
            }}
          >
            <motion.button
              ref={(el) => {
                cardRefs.current[service.id] = el
              }}
              type="button"
              role="tab"
              id={tabId(service.id)}
              aria-selected={selected}
              aria-controls={panelId(service.id)}
              tabIndex={selected ? 0 : -1}
              disabled={selected}
              onClick={() => select(service.id, true)}
              onMouseEnter={() => setHovered(service.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setFocused(service.id)}
              onBlur={() => setFocused(null)}
              initial={reduceMotion ? resting : entrance}
              animate={open ? resting : entrance}
              transition={{
                ...spring,
                delay:
                  open && !reduceMotion && !entranceDone ? 0.05 * i : 0,
              }}
              className={`relative h-full w-full cursor-pointer overflow-hidden rounded-xl border bg-cream text-left outline-none ${
                selected
                  ? 'pointer-events-none border-mahogany/30'
                  : 'border-mahogany/25 hover:border-mahogany/45'
              } ${
                isFocused
                  ? 'ring-2 ring-mahogany/50 ring-offset-2 ring-offset-cream'
                  : ''
              }`}
              style={{
                transformOrigin: `50% ${originY}`,
                boxShadow: selected ? 'none' : shadowForDist(dist),
              }}
            >
              <motion.img
                src={resolveDisplayImageUrl(service.image)}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                animate={{ scale: isHovered ? 1.06 : 1 }}
                transition={spring}
                draggable={false}
              />

              {/* Depth veil */}
              <div
                className="pointer-events-none absolute inset-0 bg-cream"
                style={{ opacity: selected ? 0.5 : veil }}
                aria-hidden="true"
              />

              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(250,240,230,0.96)] via-[rgba(250,240,230,0.28)] to-transparent"
                aria-hidden="true"
              />

              {/* Inset hairline */}
              <div
                className="pointer-events-none absolute inset-[6px] border border-cream/55"
                aria-hidden="true"
              />

              {/* Mahogany index tab */}
              <div
                className="absolute top-0 left-1/2 z-10 -translate-x-1/2 px-2.5 py-1 font-sans text-[9px] font-semibold tracking-[0.16em] text-cream uppercase"
                style={{ backgroundColor: MAHOGANY }}
                aria-hidden="true"
              >
                {pad2(i + 1)}
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 px-2.5 py-2.5 md:px-3 md:py-3">
                <p className="font-serif text-sm leading-tight font-medium text-ink md:text-[15px]">
                  {service.name}
                </p>
                <span
                  className="mt-1.5 block h-px origin-left bg-mahogany transition-transform duration-300"
                  style={{
                    width: 28,
                    transform: `scaleX(${isHovered ? 1.55 : 1})`,
                  }}
                  aria-hidden="true"
                />
              </div>
            </motion.button>
          </div>
        )
      })}
    </div>
  )

  const navControls = (
    <>
      <button
        type="button"
        onClick={() => stepBy(-1)}
        disabled={activeIndex === 0}
        aria-label="Previous service"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-mahogany/30 font-serif text-lg text-mahogany transition-colors hover:border-mahogany hover:bg-mahogany hover:text-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-mahogany"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => stepBy(1)}
        disabled={activeIndex >= n - 1}
        aria-label="Next service"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-mahogany/30 font-serif text-lg text-mahogany transition-colors hover:border-mahogany hover:bg-mahogany hover:text-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-mahogany"
      >
        →
      </button>
    </>
  )

  const detailCaption = (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[rgba(45,27,14,0.55)] via-[rgba(45,27,14,0.2)] to-transparent px-4 pt-16 pb-3.5">
      <p className="font-sans text-[10px] font-semibold tracking-[0.18em] text-cream/90 uppercase">
        {category.title}
      </p>
      <p className="font-sans text-[10px] font-semibold tracking-[0.18em] text-cream/90 tabular-nums">
        {pad2(activeIndex + 1)} / {pad2(n)}
      </p>
    </div>
  )

  const detailPanel = (
    <div className="flex w-full flex-col">
      {/* Mobile: snap-scroll active image */}
      <div className="relative aspect-[4/5] w-full max-w-[12rem] overflow-hidden rounded-xl border border-mahogany/25 bg-cream-dark shadow-[0_16px_40px_rgba(45,27,14,0.1)] md:max-w-[11rem] lg:hidden">
        <div
          ref={mobileScrollRef}
          onScroll={onMobileScroll}
          onPointerDown={cancelScrollHint}
          onTouchStart={cancelScrollHint}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {services.map((service, i) => (
            <div
              key={service.id}
              className="relative h-full w-full min-w-full shrink-0 snap-center"
            >
              <img
                src={resolveDisplayImageUrl(service.image)}
                alt=""
                loading={i === activeIndex ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[rgba(45,27,14,0.55)] via-[rgba(45,27,14,0.2)] to-transparent px-4 pt-16 pb-3.5">
                <p className="font-sans text-[10px] font-semibold tracking-[0.18em] text-cream/90 uppercase">
                  {category.title}
                </p>
                <p className="font-sans text-[10px] font-semibold tracking-[0.18em] text-cream/90 tabular-nums">
                  {pad2(i + 1)} / {pad2(n)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex w-full max-w-[12rem] items-center justify-center gap-3 md:max-w-[11rem] lg:hidden">
        {navControls}
      </div>

      {/* Desktop: single image + flight */}
      <motion.div
        ref={panelCardRef}
        animate={controls}
        className="relative hidden aspect-[4/5] w-full max-w-[12rem] overflow-hidden rounded-xl border border-mahogany/25 bg-cream-dark shadow-[0_16px_40px_rgba(45,27,14,0.1)] md:max-w-[11rem] lg:block lg:max-w-[50%]"
        style={{ transformOrigin: '50% 50%' }}
        aria-hidden="true"
      >
        <AnimatePresence mode="wait" initial={false}>
          {active ? (
            <motion.img
              key={active.id}
              src={resolveDisplayImageUrl(active.image)}
              alt=""
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.12 : 0.25 }}
              draggable={false}
            />
          ) : null}
        </AnimatePresence>
        {detailCaption}
      </motion.div>

      <div className="relative mt-5 max-w-[12rem] md:mt-6 md:max-w-[11rem] lg:max-w-[50%]" aria-hidden="true">
        <p
          className="pointer-events-none absolute -top-8 -left-1 font-serif text-7xl leading-none font-light tracking-tight select-none md:-top-10 md:text-8xl"
          style={{ color: 'rgba(103,68,56,0.16)' }}
        >
          {pad2(activeIndex + 1)}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.3 }}
            className="relative"
          >
            <p
              className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase"
              style={{ color: MAHOGANY }}
            >
              {pad2(activeIndex + 1)} · {category.title}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-medium tracking-tight text-ink md:text-3xl lg:text-[2.15rem]">
              {active.name}
            </h3>
            <span
              className="mt-3 block h-px w-10 bg-mahogany"
              aria-hidden="true"
            />
            <p className="mt-4 font-sans text-sm leading-relaxed text-ink-muted md:text-base">
              {active.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {services.map((s, i) => (
        <div
          key={`panel-${s.id}`}
          id={panelId(s.id)}
          role="tabpanel"
          aria-labelledby={tabId(s.id)}
          hidden={s.id !== activeId}
          className="sr-only"
        >
          <h3>
            {pad2(i + 1)} · {s.name}
          </h3>
          <p>{s.description}</p>
        </div>
      ))}
    </div>
  )

  return (
    <div className="mt-12 flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-center lg:gap-14">
      <div
        className={`lg:col-span-6 ${fanOnRight ? 'lg:order-1' : 'lg:order-2'}`}
      >
        {detailPanel}
      </div>
      <div
        className={`flex flex-col items-center lg:col-span-6 ${fanOnRight ? 'lg:order-2' : 'lg:order-1'}`}
      >
        {fan}
        <div className="mt-10 hidden w-full items-center justify-center gap-3 md:mt-12 lg:flex">
          {navControls}
        </div>
      </div>
    </div>
  )
}
