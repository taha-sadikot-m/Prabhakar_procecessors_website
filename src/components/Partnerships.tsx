import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type RefObject,
} from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import {
  Globe,
  Home,
  Package,
  Shirt,
  Sparkles,
  Store,
  type LucideProps,
} from 'lucide-react'
import { partnerships } from '../data/content'
import { SectionCta } from './SectionCta'

const ACCENT = '#674438'
const MAHOGANY = '#674438'
const PARCHMENT = '#F2E8D8'
const INK = '#2D1B0E'
const GAP = 14
const PAD = 12
const ITERATIONS = 3

const ICONS: Record<
  (typeof partnerships.partners)[number]['id'],
  ComponentType<LucideProps>
> = {
  garment: Shirt,
  fashion: Sparkles,
  exporter: Globe,
  home: Home,
  wholesale: Package,
  retail: Store,
}

type Partner = (typeof partnerships.partners)[number]

type Pos = { left: number; top: number }

type Rect = { x: number; y: number; w: number; h: number }

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isMobile
}

function usePanelSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      setSize({ w: r.width, h: r.height })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])

  return size
}

function cardSize(
  expanded: boolean,
  isMobile: boolean,
  panelW: number,
): { w: number; h: number } {
  if (expanded) {
    const w = Math.min(panelW * 0.88, 280)
    return { w, h: isMobile ? 220 : 200 }
  }
  return isMobile ? { w: 168, h: 68 } : { w: 200, h: 72 }
}

function intersects(a: Rect, b: Rect, gap: number) {
  return !(
    a.x + a.w + gap <= b.x ||
    b.x + b.w + gap <= a.x ||
    a.y + a.h + gap <= b.y ||
    b.y + b.h + gap <= a.y
  )
}

function clampRect(rect: Rect, panelW: number, panelH: number): Rect {
  const w = Math.min(rect.w, panelW - PAD * 2)
  const h = Math.min(rect.h, panelH - PAD * 2)
  return {
    w,
    h,
    x: Math.min(Math.max(rect.x, PAD), Math.max(PAD, panelW - w - PAD)),
    y: Math.min(Math.max(rect.y, PAD), Math.max(PAD, panelH - h - PAD)),
  }
}

function resolvePositions(
  partners: readonly Partner[],
  expandedId: string | null,
  isMobile: boolean,
  panelW: number,
  panelH: number,
): Record<string, Pos> {
  const base: Record<string, Pos> = {}
  for (const p of partners) {
    base[p.id] = {
      left: isMobile ? p.mobileX : p.x,
      top: isMobile ? p.mobileY : p.y,
    }
  }

  if (!expandedId || panelW < 1 || panelH < 1) return base

  const sizes = Object.fromEntries(
    partners.map((p) => [
      p.id,
      cardSize(p.id === expandedId, isMobile, panelW),
    ]),
  ) as Record<string, { w: number; h: number }>

  const rects: Record<string, Rect> = {}
  for (const p of partners) {
    const { w, h } = sizes[p.id]
    rects[p.id] = {
      x: (base[p.id].left / 100) * panelW,
      y: (base[p.id].top / 100) * panelH,
      w,
      h,
    }
  }

  rects[expandedId] = clampRect(rects[expandedId], panelW, panelH)

  for (let iter = 0; iter < ITERATIONS; iter++) {
    const expanded = rects[expandedId]
    for (const p of partners) {
      if (p.id === expandedId) continue
      const r = rects[p.id]
      if (!intersects(expanded, r, GAP)) continue

      const ex = expanded.x + expanded.w / 2
      const ey = expanded.y + expanded.h / 2
      const rx = r.x + r.w / 2
      const ry = r.y + r.h / 2
      let dx = rx - ex
      let dy = ry - ey
      const len = Math.hypot(dx, dy) || 1
      dx /= len
      dy /= len

      const overlapX =
        expanded.w / 2 + r.w / 2 + GAP - Math.abs(rx - ex)
      const overlapY =
        expanded.h / 2 + r.h / 2 + GAP - Math.abs(ry - ey)
      const push = Math.max(overlapX, overlapY, 8)

      r.x += dx * push
      r.y += dy * push
      const clamped = clampRect(r, panelW, panelH)
      r.x = clamped.x
      r.y = clamped.y
      r.w = clamped.w
      r.h = clamped.h
    }

    // Keep neighbors from stacking on each other after a push
    for (let i = 0; i < partners.length; i++) {
      for (let j = i + 1; j < partners.length; j++) {
        const aId = partners[i].id
        const bId = partners[j].id
        if (aId === expandedId || bId === expandedId) continue
        const a = rects[aId]
        const b = rects[bId]
        if (!intersects(a, b, GAP * 0.6)) continue
        const ax = a.x + a.w / 2
        const ay = a.y + a.h / 2
        const bx = b.x + b.w / 2
        const by = b.y + b.h / 2
        let dx = bx - ax
        let dy = by - ay
        const len = Math.hypot(dx, dy) || 1
        dx /= len
        dy /= len
        const push = 10
        a.x -= dx * push * 0.5
        a.y -= dy * push * 0.5
        b.x += dx * push * 0.5
        b.y += dy * push * 0.5
        Object.assign(a, clampRect(a, panelW, panelH))
        Object.assign(b, clampRect(b, panelW, panelH))
      }
    }
  }

  const out: Record<string, Pos> = {}
  for (const p of partners) {
    out[p.id] = {
      left: (rects[p.id].x / panelW) * 100,
      top: (rects[p.id].y / panelH) * 100,
    }
  }
  return out
}

function useCanHover() {
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setCanHover(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return canHover
}

function PartnerCard({
  partner,
  index,
  expanded,
  onToggle,
  onHoverStart,
  onHoverEnd,
  canHover,
  reduceMotion,
  left,
  top,
  floatPaused,
}: {
  partner: Partner
  index: number
  expanded: boolean
  onToggle: () => void
  onHoverStart: () => void
  onHoverEnd: () => void
  canHover: boolean
  reduceMotion: boolean | null
  left: number
  top: number
  floatPaused: boolean
}) {
  const Icon = ICONS[partner.id]

  const floatStyle = {
    ['--float-delay' as string]: `${index * 0.45}s`,
    ['--float-duration' as string]: `${3.2 + (index % 3) * 0.35}s`,
  } as CSSProperties

  return (
    <motion.div
      className={`absolute ${floatPaused ? '' : 'partner-float'} ${
        expanded ? 'z-[5]' : 'z-[2]'
      }`}
      style={floatStyle}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      animate={{
        left: `${left}%`,
        top: `${top}%`,
      }}
      transition={{
        left: {
          type: 'spring',
          stiffness: reduceMotion ? 400 : 220,
          damping: reduceMotion ? 40 : 26,
        },
        top: {
          type: 'spring',
          stiffness: reduceMotion ? 400 : 220,
          damping: reduceMotion ? 40 : 26,
        },
        opacity: {
          duration: 0.45,
          delay: reduceMotion ? 0 : index * 0.15,
          ease: [0.22, 1, 0.36, 1],
        },
        y: {
          duration: 0.45,
          delay: reduceMotion ? 0 : index * 0.15,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      onMouseEnter={canHover ? onHoverStart : undefined}
      onMouseLeave={canHover ? onHoverEnd : undefined}
    >
      <motion.button
        type="button"
        layout
        onClick={onToggle}
        aria-expanded={expanded}
        className={`rounded-xl border text-left backdrop-blur-md transition-[box-shadow,width] ${
          expanded
            ? 'w-[min(88vw,17.5rem)]'
            : 'w-[10.5rem] md:w-[12.5rem]'
        }`}
        style={{
          backgroundColor: 'rgba(250,240,230,0.88)',
          borderColor: 'rgba(103,68,56,0.3)',
          boxShadow: expanded
            ? '0 16px 40px rgba(45,27,14,0.14)'
            : '0 8px 24px rgba(45,27,14,0.08)',
          transform: expanded ? 'rotate(0deg)' : `rotate(${partner.rot}deg)`,
        }}
      >
        <div className="relative px-3.5 py-3 md:px-4 md:py-3.5">
          <AnimatePresence mode="wait" initial={false}>
            {expanded ? (
              <motion.div
                key="expanded"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p
                  className="font-sans text-[10px] font-medium tracking-[0.18em] uppercase"
                  style={{ color: MAHOGANY }}
                >
                  {partner.years} Years
                </p>
                <p className="mt-1.5 font-serif text-lg font-semibold tracking-tight text-heading">
                  {partner.type}
                </p>
                <span
                  className="mt-2 block h-[1.5px] w-8"
                  style={{ backgroundColor: ACCENT }}
                  aria-hidden="true"
                />
                <p className="mt-2.5 font-sans text-sm leading-relaxed text-ink-muted italic">
                  “{partner.quote}”
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <span
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border"
                  style={{
                    borderColor: 'rgba(103,68,56,0.45)',
                    backgroundColor: 'rgba(255,252,247,0.9)',
                    color: ACCENT,
                  }}
                >
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-sans text-[10px] font-medium tracking-[0.16em] text-mahogany uppercase">
                    Partner
                  </p>
                  <p className="mt-0.5 font-serif text-base font-semibold text-heading">
                    {partner.years} Years
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </motion.div>
  )
}

export function Partnerships() {
  const reduceMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const canHover = useCanHover()
  const panelRef = useRef<HTMLDivElement>(null)
  const scatterRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const panelSize = usePanelSize(scatterRef)

  const positions = useMemo(
    () =>
      resolvePositions(
        partnerships.partners,
        expanded,
        isMobile,
        panelSize.w,
        panelSize.h,
      ),
    [expanded, isMobile, panelSize.w, panelSize.h],
  )

  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : ['-8%', '8%'],
  )

  return (
    <section
      id="partnerships"
      className="scroll-mt-24"
      style={{ backgroundColor: PARCHMENT, color: INK }}
    >
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24 lg:px-10">
        <header className="max-w-xl">
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: MAHOGANY }}
          >
            {partnerships.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-heading md:text-5xl md:leading-[1.12]">
            {partnerships.headline[0]}
            <br />
            <span className="italic" style={{ color: MAHOGANY }}>
              {partnerships.headline[1]}
            </span>
          </h2>
        </header>
      </div>

      <div
        ref={panelRef}
        className="relative min-h-[70vh] w-full overflow-hidden md:min-h-[72vh]"
      >
        <motion.div className="absolute inset-[-12%] z-0" style={{ y: bgY }}>
          <picture className="block h-full w-full">
            <source
              media="(min-width: 768px)"
              srcSet={partnerships.desktopBackground}
            />
            <img
              src={partnerships.mobileBackground}
              alt=""
              className="h-full w-full object-cover object-center"
              draggable={false}
            />
          </picture>
        </motion.div>

        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(180deg, rgba(250,240,230,0.35) 0%, rgba(250,240,230,0.12) 45%, rgba(250,240,230,0.4) 100%)',
          }}
          aria-hidden="true"
        />

        <div
          ref={scatterRef}
          className="relative z-[2] h-full min-h-[70vh] w-full md:min-h-[72vh]"
        >
          {partnerships.partners.map((partner, index) => {
            const pos = positions[partner.id]
            return (
              <PartnerCard
                key={partner.id}
                partner={partner}
                index={index}
                expanded={expanded === partner.id}
                onToggle={() =>
                  setExpanded((id) => (id === partner.id ? null : partner.id))
                }
                onHoverStart={() => setExpanded(partner.id)}
                onHoverEnd={() =>
                  setExpanded((id) => (id === partner.id ? null : id))
                }
                canHover={canHover}
                reduceMotion={reduceMotion}
                left={pos.left}
                top={pos.top}
                floatPaused={Boolean(expanded) || Boolean(reduceMotion)}
              />
            )
          })}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-14 text-center md:px-8 md:py-16">
        <p className="font-sans text-sm leading-relaxed text-ink-muted md:text-base">
          {partnerships.body}
        </p>
        <div className="mt-8 flex justify-center">
          <SectionCta label={partnerships.cta} to={partnerships.ctaHref} />
        </div>
      </div>

      <style>{`
        .partner-float {
          animation: partnerFloat var(--float-duration, 3.5s) ease-in-out infinite;
          animation-delay: var(--float-delay, 0s);
        }
        @media (prefers-reduced-motion: reduce) {
          .partner-float {
            animation: none;
          }
        }
        @keyframes partnerFloat {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -2px; }
        }
      `}</style>
    </section>
  )
}
