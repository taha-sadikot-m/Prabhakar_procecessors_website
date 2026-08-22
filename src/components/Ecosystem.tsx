import { useEffect, useMemo, useRef, type ComponentType } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Droplets,
  Handshake,
  Layers,
  Package,
  SearchCheck,
  Sparkles,
  Stamp,
  Truck,
  type LucideProps,
} from 'lucide-react'
import { ecosystem } from '../data/content'
import { SectionCta } from './SectionCta'

gsap.registerPlugin(ScrollTrigger)

const ACCENT = '#674438'
const MAHOGANY = '#674438'
const INK = '#2D1B0E'
const MILESTONE_COUNT = ecosystem.milestones.length

/** Square geometric orbital ring (viewBox units). */
const RING = {
  size: 1000,
  cx: 500,
  cy: 500,
  r: 248,
  rInner: 196,
  rLabel: 455,
  tickIn: 12,
  /** Extra outward nudge for label plates (px), clear of ring + dots. */
  labelNudgePx: 14,
} as const

const ICONS: Record<
  (typeof ecosystem.milestones)[number]['id'],
  ComponentType<LucideProps>
> = {
  customer: Handshake,
  grey: Layers,
  dyeing: Droplets,
  printing: Stamp,
  finishing: Sparkles,
  inspection: SearchCheck,
  packing: Package,
  delivery: Truck,
}

type Station = {
  angleDeg: number
  dotX: number
  dotY: number
  labelX: number
  labelY: number
  tickX1: number
  tickY1: number
  tickX2: number
  tickY2: number
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function buildStations(): Station[] {
  return Array.from({ length: MILESTONE_COUNT }, (_, i) => {
    // Start at top (−90°), equal 45° steps clockwise
    const angleDeg = -90 + i * (360 / MILESTONE_COUNT)
    const dot = polar(RING.cx, RING.cy, RING.r, angleDeg)
    const label = polar(RING.cx, RING.cy, RING.rLabel, angleDeg)
    const tickOuter = polar(RING.cx, RING.cy, RING.r, angleDeg)
    const tickInner = polar(RING.cx, RING.cy, RING.r - RING.tickIn, angleDeg)
    return {
      angleDeg,
      dotX: dot.x,
      dotY: dot.y,
      labelX: label.x,
      labelY: label.y,
      tickX1: tickInner.x,
      tickY1: tickInner.y,
      tickX2: tickOuter.x,
      tickY2: tickOuter.y,
    }
  })
}

function JewelDot({ active, className = '' }: { active: boolean; className?: string }) {
  return (
    <span
      className={`eco-dot relative block size-3 rounded-full md:size-3.5 ${
        active ? 'eco-dot--active' : ''
      } ${className}`}
      style={{
        background:
          'radial-gradient(circle at 35% 30%, #C4A192 0%, #674438 48%, #3A241C 100%)',
        boxShadow: active
          ? '0 0 0 3px rgba(250,240,230,0.95), 0 0 14px rgba(103,68,56,0.55)'
          : '0 0 0 2px rgba(250,240,230,0.95), 0 1px 4px rgba(45,27,14,0.18)',
      }}
    />
  )
}

export function Ecosystem() {
  const sectionRef = useRef<HTMLElement>(null)
  const desktopBoardRef = useRef<HTMLDivElement>(null)
  const desktopCircleRef = useRef<SVGCircleElement>(null)
  const desktopInnerRef = useRef<SVGCircleElement>(null)
  const desktopTicksRef = useRef<SVGGElement>(null)
  const desktopCentreRef = useRef<HTMLDivElement>(null)
  const desktopDotRefs = useRef<(HTMLSpanElement | null)[]>([])
  const desktopLabelRefs = useRef<(HTMLDivElement | null)[]>([])
  const mobileJourneyRef = useRef<HTMLDivElement>(null)
  const mobileSpineRef = useRef<HTMLDivElement>(null)
  const mobileItemRefs = useRef<(HTMLLIElement | null)[]>([])

  const stations = useMemo(() => buildStations(), [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const ctx = gsap.context(() => {
      const desktopCircle = desktopCircleRef.current
      const desktopBoard = desktopBoardRef.current
      const desktopInner = desktopInnerRef.current
      const desktopTicks = desktopTicksRef.current
      const desktopCentre = desktopCentreRef.current
      const mobileSpine = mobileSpineRef.current
      const mobileJourney = mobileJourneyRef.current
      const desktopDots = desktopDotRefs.current.filter(Boolean) as HTMLSpanElement[]
      const desktopLabels = desktopLabelRefs.current.filter(
        Boolean,
      ) as HTMLDivElement[]
      const mobileItems = mobileItemRefs.current.filter(
        Boolean,
      ) as HTMLLIElement[]

      if (desktopCircle) {
        const length = desktopCircle.getTotalLength()
        gsap.set(desktopCircle, {
          strokeDasharray: length,
          strokeDashoffset: reduceMotion ? 0 : length,
        })
      }

      if (mobileSpine) {
        gsap.set(mobileSpine, {
          scaleY: reduceMotion ? 1 : 0,
          transformOrigin: 'top center',
        })
      }

      if (reduceMotion) {
        gsap.set(desktopLabels, { opacity: 1, y: 0 })
        gsap.set(desktopDots, { opacity: 1, scale: 1 })
        gsap.set(desktopCentre, { opacity: 1, y: 0 })
        gsap.set(desktopInner, { opacity: 0.28 })
        gsap.set(desktopTicks, { opacity: 0.55 })
        gsap.set(mobileItems, { opacity: 1, y: 0 })
        return
      }

      gsap.set(desktopCentre, { opacity: 0, y: 10 })
      gsap.set(desktopInner, { opacity: 0 })
      gsap.set(desktopTicks, { opacity: 0 })
      gsap.set(desktopDots, { opacity: 0, scale: 0.7 })
      gsap.set(desktopLabels, { opacity: 0, y: 14 })
      gsap.set(mobileItems, { opacity: 0, y: 18 })

      // Desktop — one-shot enter: ring + all stations together
      if (desktopCircle && desktopBoard) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: desktopBoard,
            start: 'top 78%',
            once: true,
            toggleActions: 'play none none none',
          },
        })

        tl.to(
          desktopCentre,
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          0,
        )
        tl.to(
          desktopCircle,
          { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' },
          0.1,
        )
        tl.to(
          desktopInner,
          { opacity: 0.28, duration: 0.5, ease: 'power2.out' },
          0.25,
        )
        tl.to(
          desktopTicks,
          { opacity: 0.55, duration: 0.45, ease: 'power2.out' },
          0.3,
        )
        tl.to(
          desktopDots,
          {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            stagger: 0.06,
            ease: 'power2.out',
          },
          0.45,
        )
        tl.to(
          desktopLabels,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.out',
          },
          0.5,
        )
      }

      // Mobile — one-shot enter: continuous spine + all rows together
      if (mobileSpine && mobileJourney) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: mobileJourney,
            start: 'top 80%',
            once: true,
            toggleActions: 'play none none none',
          },
        })

        tl.to(
          mobileSpine,
          { scaleY: 1, duration: 0.85, ease: 'power2.out' },
          0,
        )
        tl.to(
          mobileItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: 'power2.out',
          },
          0.2,
        )
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="ecosystem"
      className="relative min-h-svh scroll-mt-24 overflow-hidden"
      style={{ color: INK }}
    >
      <picture className="pointer-events-none absolute inset-0 z-0 block h-full w-full">
        <source
          media="(min-width: 768px)"
          srcSet={ecosystem.desktopBackground}
        />
        <img
          src={ecosystem.mobileBackground}
          alt=""
          width={768}
          height={1024}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      </picture>
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(250,240,230,0.52) 0%, rgba(250,240,230,0.38) 40%, rgba(250,240,230,0.48) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-[2] mx-auto flex min-h-svh w-full max-w-[100rem] flex-col justify-center px-5 py-16 md:px-10 md:py-20 lg:px-14 xl:px-16">
        {/* Pin copy to left edge, ring to right — open space in the middle */}
        <div className="md:flex md:items-center md:justify-between md:gap-16 lg:gap-24 xl:gap-32">
          <header className="mx-auto max-w-2xl text-center md:mx-0 md:w-full md:max-w-sm md:shrink-0 md:text-left lg:max-w-md">
            <p
              className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
              style={{ color: MAHOGANY }}
            >
              {ecosystem.eyebrow}
            </p>
            <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-[#20222D] md:text-4xl md:leading-[1.12] md:text-[#20222D] lg:text-5xl">
              {ecosystem.headline[0]}
              <br />
              <span className="italic" style={{ color: MAHOGANY }}>
                {ecosystem.headline[1]}
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-sans text-sm leading-relaxed text-[#20222D]/70 md:mx-0 md:max-w-md md:text-base">
              {ecosystem.body}
            </p>
            <div className="mt-8 flex justify-center md:justify-start">
              <SectionCta label={ecosystem.cta} to={ecosystem.ctaHref} />
            </div>
          </header>

          {/* ── Desktop geometric orbital ring ── */}
          <div
            ref={desktopBoardRef}
            className="eco-journey-desktop relative mx-auto mt-12 hidden aspect-square w-full max-w-[min(100%,520px)] shrink-0 md:mt-0 md:ml-auto md:block md:w-[min(48vw,560px)] lg:max-w-[560px]"
          >
          {/* Soft cream vignette so the orbit sits quieter than the patterned BG */}
          <div
            className="pointer-events-none absolute inset-[-6%] z-0"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(250,240,230,0.72) 0%, rgba(250,240,230,0.45) 42%, rgba(250,240,230,0) 72%)',
            }}
            aria-hidden="true"
          />

          <svg
            className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
            viewBox={`0 0 ${RING.size} ${RING.size}`}
            aria-hidden="true"
          >
            {/* Inner concentric ring — geometric depth only */}
            <circle
              ref={desktopInnerRef}
              cx={RING.cx}
              cy={RING.cy}
              r={RING.rInner}
              fill="none"
              stroke={ACCENT}
              strokeWidth={0.9}
              strokeDasharray="4 7"
              opacity={0.28}
            />

            {/* Outer orbit / thread */}
            <circle
              ref={desktopCircleRef}
              cx={RING.cx}
              cy={RING.cy}
              r={RING.r}
              fill="none"
              stroke={ACCENT}
              strokeWidth={1.35}
              strokeLinecap="round"
              opacity={0.5}
            />

            {/* Short radial ticks at each station */}
            <g ref={desktopTicksRef} opacity={0.55}>
              {stations.map((s, i) => (
                <line
                  key={`tick-${ecosystem.milestones[i].id}`}
                  x1={s.tickX1}
                  y1={s.tickY1}
                  x2={s.tickX2}
                  y2={s.tickY2}
                  stroke={ACCENT}
                  strokeWidth={1.1}
                  strokeLinecap="round"
                />
              ))}
            </g>
          </svg>

          {/* Centre typographic mark */}
          <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
            <div
              ref={desktopCentreRef}
              className="rounded-full px-6 py-5 text-center backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(250,240,230,0.88)',
                boxShadow: '0 6px 20px rgba(45,27,14,0.06)',
              }}
            >
              <p
                className="font-serif text-5xl font-medium leading-none tracking-tight"
                style={{ color: MAHOGANY }}
              >
                8
              </p>
              <p className="mt-2 font-sans text-[10px] font-medium tracking-[0.28em] text-[#674438] uppercase">
                Stages
              </p>
            </div>
          </div>

          {stations.map((station, i) => {
            const milestone = ecosystem.milestones[i]
            const Icon = ICONS[milestone.id]
            const indexLabel = String(i + 1).padStart(2, '0')

            const rad = (station.angleDeg * Math.PI) / 180
            const nudgeX = Math.cos(rad) * RING.labelNudgePx
            const nudgeY = Math.sin(rad) * RING.labelNudgePx

            return (
              <div key={milestone.id} className="contents">
                <span
                  ref={(el) => {
                    desktopDotRefs.current[i] = el
                  }}
                  className="absolute z-[5] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${(station.dotX / RING.size) * 100}%`,
                    top: `${(station.dotY / RING.size) * 100}%`,
                  }}
                >
                  <JewelDot active={false} />
                </span>

                <div
                  className="absolute z-[3] w-[9.5rem] lg:w-[10.5rem]"
                  style={{
                    left: `${(station.labelX / RING.size) * 100}%`,
                    top: `${(station.labelY / RING.size) * 100}%`,
                    transform: `translate(calc(-50% + ${nudgeX}px), calc(-50% + ${nudgeY}px))`,
                  }}
                >
                  <div
                    ref={(el) => {
                      desktopLabelRefs.current[i] = el
                    }}
                    className="flex flex-col items-center gap-1.5 rounded-xl px-2.5 py-2.5 text-center backdrop-blur-md"
                    style={{
                      backgroundColor: 'rgba(250,240,230,0.97)',
                      border: '1px solid rgba(103,68,56,0.35)',
                      boxShadow: '0 8px 24px rgba(45,27,14,0.1)',
                    }}
                  >
                    <span
                      className="inline-flex size-11 items-center justify-center rounded-full border lg:size-12"
                      style={{
                        borderColor: 'rgba(103,68,56,0.65)',
                        backgroundColor: 'rgba(255,252,247,0.98)',
                        color: ACCENT,
                      }}
                    >
                      <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <p
                      className="font-sans text-[10px] font-medium tracking-[0.22em] uppercase"
                      style={{ color: MAHOGANY }}
                    >
                      {indexLabel}
                    </p>
                    <div className="flex flex-col items-center">
                      <p className="font-serif text-base font-semibold tracking-tight text-[#20222D] lg:text-lg">
                        {milestone.name}
                      </p>
                      <span
                        className="mt-1.5 block h-[1.5px] w-8"
                        style={{ backgroundColor: ACCENT }}
                        aria-hidden="true"
                      />
                    </div>
                    <p
                      className="font-sans text-[11px] leading-snug lg:text-xs"
                      style={{ color: 'rgba(45,27,14,0.78)' }}
                    >
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
          </div>
        </div>

        {/* ── Mobile vertical journey ── */}
        <div ref={mobileJourneyRef} className="relative mt-10 md:hidden">
          {/* Continuous mahogany spine — CSS rail (no broken SVG stretch) */}
          <div
            ref={mobileSpineRef}
            className="pointer-events-none absolute top-6 bottom-6 left-3 z-0 w-[1.5px] -translate-x-1/2 origin-top"
            style={{ backgroundColor: 'rgba(103,68,56,0.3)' }}
            aria-hidden="true"
          />

          <ol className="relative z-[1] flex flex-col gap-10">
            {ecosystem.milestones.map((milestone, i) => {
              const Icon = ICONS[milestone.id]

              return (
                <li
                  key={milestone.id}
                  ref={(el) => {
                    mobileItemRefs.current[i] = el
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative z-[2] mt-5 flex w-6 shrink-0 justify-center">
                      <JewelDot active={false} />
                    </div>
                    <MilestoneCopy
                      Icon={Icon}
                      name={milestone.name}
                      description={milestone.description}
                    />
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <style>{`
        .eco-dot::after {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 9999px;
          border: 1px solid rgba(103, 68, 56, 0.5);
          opacity: 0;
          transform: scale(0.55);
          pointer-events: none;
        }
        .eco-dot--active::after {
          animation: ecoDotPulse 2.5s ease-out infinite;
        }
        .eco-dot--active {
          transform: scale(1.12);
        }
        @keyframes ecoDotPulse {
          0% {
            opacity: 0.75;
            transform: scale(0.6);
          }
          70% {
            opacity: 0;
            transform: scale(2.35);
          }
          100% {
            opacity: 0;
            transform: scale(2.35);
          }
        }
      `}</style>
    </section>
  )
}

function MilestoneCopy({
  Icon,
  name,
  description,
}: {
  Icon: ComponentType<LucideProps>
  name: string
  description: string
}) {
  return (
    <div
      className="flex max-w-[18rem] flex-1 items-start gap-3 rounded-xl border px-3 py-3 backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(250,240,230,0.97)',
        borderColor: 'rgba(103,68,56,0.35)',
        boxShadow: '0 8px 20px rgba(45,27,14,0.08)',
      }}
    >
      <span
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border"
        style={{
          borderColor: 'rgba(103,68,56,0.6)',
          backgroundColor: 'rgba(255,252,247,0.98)',
          color: ACCENT,
        }}
      >
        <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <div className="min-w-0 text-left">
        <p className="font-serif text-base font-semibold tracking-tight text-[#20222D]">
          {name}
        </p>
        <span
          className="mt-1 block h-[1.5px] w-7"
          style={{ backgroundColor: ACCENT }}
          aria-hidden="true"
        />
        <p
          className="mt-1.5 font-sans text-sm leading-relaxed"
          style={{ color: 'rgba(45,27,14,0.78)' }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
