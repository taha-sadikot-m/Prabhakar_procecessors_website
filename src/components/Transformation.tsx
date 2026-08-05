import { useEffect, useRef, useState, type MouseEvent } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { transformation } from '../data/content'
import { SectionCta } from './SectionCta'

const IVORY = '#FFF8F2'
const CHARCOAL = '#20222D'
const ACCENT = '#674438'
const MAHOGANY = '#674438'

const stages = transformation.stages
const STAGE_COUNT = stages.length

function ProgressRail({
  progress,
  activeIndex,
}: {
  progress: number
  activeIndex: number
}) {
  const fill = Math.min(Math.max(progress, 0), 1)
  const edgeInset = `calc(100% / ${STAGE_COUNT} / 2)`

  return (
    <div
      className="w-full max-w-lg"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(fill * 100)}
      aria-label="Transformation progress"
    >
      <div className="relative h-3">
        {/* Track spans marker centers so fill and dots share one coordinate system */}
        <div
          className="absolute top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full"
          style={{ left: edgeInset, right: edgeInset }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: 'rgba(45,27,14,0.14)' }}
          />
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: ACCENT }}
            animate={{ width: `${fill * 100}%` }}
            transition={{ type: 'spring', stiffness: 110, damping: 24, mass: 0.6 }}
          />
        </div>

        <div
          className="relative grid h-full"
          style={{ gridTemplateColumns: `repeat(${STAGE_COUNT}, minmax(0, 1fr))` }}
        >
          {stages.map((stage, i) => {
            const reached = i <= activeIndex
            const active = i === activeIndex
            return (
              <div key={stage.label} className="flex items-center justify-center">
                <motion.span
                  className="relative z-10 block rounded-full border"
                  animate={{
                    width: active ? 11 : 8,
                    height: active ? 11 : 8,
                    backgroundColor: reached ? ACCENT : IVORY,
                    borderColor: reached ? ACCENT : 'rgba(45,27,14,0.28)',
                    boxShadow: active
                      ? `0 0 0 3px rgba(103,68,56,0.22)`
                      : '0 0 0 0px rgba(103,68,56,0)',
                  }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div
        className="mt-2.5 grid"
        style={{ gridTemplateColumns: `repeat(${STAGE_COUNT}, minmax(0, 1fr))` }}
      >
        {stages.map((stage, i) => {
          const active = i === activeIndex
          const reached = i <= activeIndex
          return (
            <span
              key={stage.label}
              className="text-center font-sans text-[9px] tracking-[0.14em] uppercase transition-colors duration-300 md:text-[10px]"
              style={{
                color: active
                  ? MAHOGANY
                  : reached
                    ? 'rgba(103,68,56,0.72)'
                    : 'rgba(45,27,14,0.4)',
                fontWeight: active ? 600 : 500,
              }}
            >
              {stage.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function StageCopy({
  stage,
  light = false,
}: {
  stage: (typeof stages)[number]
  light?: boolean
}) {
  const titleColor = light ? '#F7F4EE' : CHARCOAL
  const bodyColor = light ? 'rgba(247,244,238,0.82)' : 'rgba(45,27,14,0.72)'

  return (
    <div className="max-w-md text-left lg:max-w-lg">
      <p
        className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
        style={{ color: MAHOGANY }}
      >
        {stage.step}
      </p>
      <h3
        className="mt-2 font-serif text-4xl font-medium tracking-tight md:text-5xl lg:text-[3.4rem]"
        style={{ color: titleColor }}
      >
        {stage.heading}
      </h3>
      <p
        className="mt-1 font-serif text-2xl italic md:text-3xl"
        style={{ color: titleColor }}
      >
        {stage.subheading}
      </p>
      <p
        className="mt-4 max-w-md font-sans text-sm leading-relaxed md:text-base"
        style={{ color: bodyColor }}
      >
        {stage.description}
      </p>
    </div>
  )
}

function DesktopStickyStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    stages.forEach((s) => {
      const img = new Image()
      img.src = s.desktopImage
    })
  }, [])

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      setProgress(v)
      const idx = Math.min(STAGE_COUNT - 1, Math.floor(v * STAGE_COUNT + 0.001))
      setActiveIndex(idx)
    })
  }, [scrollYProgress])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 50, damping: 22 })
  const springY = useSpring(my, { stiffness: 50, damping: 22 })
  const imgX = useTransform(springX, [-0.5, 0.5], [-16, 16])
  const imgY = useTransform(springY, [-0.5, 0.5], [-10, 10])

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const stage = stages[activeIndex]

  return (
    <div ref={containerRef} className="relative hidden h-[500vh] md:block">
      <div
        className="sticky top-0 h-svh overflow-hidden"
        style={{ backgroundColor: IVORY, color: CHARCOAL }}
        onMouseMove={onMove}
        onMouseLeave={() => {
          mx.set(0)
          my.set(0)
        }}
      >
        {/* Full-bleed stage background */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence mode="sync">
            <motion.img
              key={stage.desktopImage}
              src={stage.desktopImage}
              alt=""
              className="absolute inset-[-3%] h-[106%] w-[106%] max-w-none select-none object-cover"
              style={{ x: imgX, y: imgY }}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              draggable={false}
            />
          </AnimatePresence>

          {/* Left readability wash */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(250,248,243,0.92) 0%, rgba(250,248,243,0.78) 28%, rgba(250,248,243,0.25) 52%, transparent 72%)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
            style={{
              background:
                'linear-gradient(to top, rgba(250,248,243,0.55), transparent)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Left editorial content */}
        <div className="relative z-10 flex h-full flex-col justify-between px-10 pt-24 pb-12 lg:px-16 lg:pt-28 lg:pb-14 xl:px-20">
          <div className="max-w-lg text-left">
            <h2 className="font-serif text-4xl font-medium tracking-tight lg:text-5xl">
              {transformation.title}
            </h2>
            <p className="mt-1 font-serif text-2xl italic lg:text-3xl" style={{ color: MAHOGANY }}>
              {transformation.subtitle}
            </p>
            <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-ink-muted">
              {transformation.intro}
            </p>
          </div>

          <div className="py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <StageCopy stage={stage} />
              </motion.div>
            </AnimatePresence>
          </div>

          <ProgressRail progress={progress} activeIndex={activeIndex} />
        </div>
      </div>
    </div>
  )
}

function MobileSnapStory() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    stages.forEach((s) => {
      const img = new Image()
      img.src = s.mobileImage
    })
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const onScroll = () => {
      const h = el.clientHeight || 1
      const maxScroll = el.scrollHeight - el.clientHeight
      const nextProgress =
        maxScroll > 0 ? Math.min(1, Math.max(0, el.scrollTop / maxScroll)) : 0
      setProgress(nextProgress)
      setActiveIndex(Math.min(STAGE_COUNT - 1, Math.round(el.scrollTop / h)))
    }

    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="relative md:hidden" style={{ color: CHARCOAL }}>
      <div
        ref={scrollerRef}
        className="h-[100svh] snap-y snap-mandatory overflow-y-auto"
      >
        {stages.map((stage, i) => (
          <article
            key={stage.step}
            className="relative h-[100svh] snap-start overflow-hidden"
          >
            <img
              src={stage.mobileImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(250,248,243,0.88) 0%, rgba(250,248,243,0.55) 38%, rgba(250,248,243,0.78) 100%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex h-full flex-col px-5 pt-24 pb-28">
              {i === 0 ? (
                <>
                  <div className="max-w-sm text-left">
                    <h2 className="font-serif text-3xl font-medium tracking-tight">
                      {transformation.title}
                    </h2>
                    <p className="mt-1 font-serif text-xl italic" style={{ color: MAHOGANY }}>
                      {transformation.subtitle}
                    </p>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
                      {transformation.intro}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <StageCopy stage={stage} />
                  </div>
                </>
              ) : (
                <StageCopy stage={stage} />
              )}
            </div>
          </article>
        ))}
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-30 px-5 pb-5 pt-6 backdrop-blur-md md:hidden"
        style={{
          background:
            'linear-gradient(to top, rgba(250,248,243,0.82) 35%, rgba(250,248,243,0.45) 70%, transparent 100%)',
        }}
      >
        <ProgressRail progress={progress} activeIndex={activeIndex} />
      </div>
    </div>
  )
}

export function Transformation() {
  return (
    <section id="transformation" className="scroll-mt-24">
      <DesktopStickyStory />
      <MobileSnapStory />
      <div className="flex justify-center bg-cream-light px-5 py-10 md:py-12">
        <SectionCta
          label={transformation.cta}
          to={transformation.ctaHref}
        />
      </div>
    </section>
  )
}
