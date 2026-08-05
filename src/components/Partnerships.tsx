import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
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

function PartnerCard({
  partner,
  index,
  expanded,
  onToggle,
  reduceMotion,
  isMobile,
}: {
  partner: Partner
  index: number
  expanded: boolean
  onToggle: () => void
  reduceMotion: boolean | null
  isMobile: boolean
}) {
  const Icon = ICONS[partner.id]
  const left = isMobile ? partner.mobileX : partner.x
  const top = isMobile ? partner.mobileY : partner.y

  const floatStyle = {
    ['--float-delay' as string]: `${index * 0.45}s`,
    ['--float-duration' as string]: `${3.2 + (index % 3) * 0.35}s`,
  } as CSSProperties

  return (
    <motion.div
      className="partner-float absolute z-[2]"
      style={{
        ...floatStyle,
        left: `${left}%`,
        top: `${top}%`,
      }}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: reduceMotion ? 0 : index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.button
        type="button"
        layout
        onClick={onToggle}
        aria-expanded={expanded}
        className={`rounded-xl border text-left backdrop-blur-md ${
          expanded
            ? 'z-[4] w-[min(88vw,17.5rem)]'
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
  const panelRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

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

        <div className="relative z-[2] h-full min-h-[70vh] w-full md:min-h-[72vh]">
          {partnerships.partners.map((partner, index) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              index={index}
              expanded={expanded === partner.id}
              onToggle={() =>
                setExpanded((id) => (id === partner.id ? null : partner.id))
              }
              reduceMotion={reduceMotion}
              isMobile={isMobile}
            />
          ))}
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
