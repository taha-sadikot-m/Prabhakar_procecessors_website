import { useRef, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { hero } from '../data/content'

function DiamondEyebrow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-gold/50 sm:w-12" aria-hidden="true" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" />
      <p className="font-sans text-[10px] font-medium tracking-[0.22em] text-ink-muted uppercase sm:text-[11px]">
        {text}
      </p>
      <span className="h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" />
      <span className="h-px w-8 bg-gold/50 sm:w-12" aria-hidden="true" />
    </div>
  )
}

function MobileEyebrow({ text }: { text: string }) {
  const parts = text.split('. ').filter(Boolean)
  const lines =
    parts.length >= 2
      ? [parts[0].endsWith('.') ? parts[0] : `${parts[0]}.`, parts.slice(1).join('. ')]
      : [text]

  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-[0.45em] flex shrink-0 items-center gap-2" aria-hidden="true">
        <span className="h-px w-6 bg-gold/50" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
      </div>
      <p className="text-left font-sans text-[9px] font-medium leading-snug tracking-[0.16em] text-ink-muted uppercase">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 40, damping: 20 })
  const springY = useSpring(my, { stiffness: 40, damping: 20 })
  const bgX = useTransform(springX, [-0.5, 0.5], [-10, 10])
  const bgY = useTransform(springY, [-0.5, 0.5], [-8, 8])

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <section
      ref={sectionRef}
      id="top"
      onMouseMove={onMove}
      className="relative flex h-[100svh] min-h-[100svh] flex-col overflow-hidden bg-cream pt-24"
    >
      {/* Hard clip — image never bleeds past the hero */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-[-4%] will-change-transform"
          style={{ x: bgX, y: bgY }}
        >
          <picture className="absolute inset-0 block h-full w-full">
            <source
              media="(min-width: 1024px)"
              srcSet="/hero_section_image/desktop.png"
            />
            <source
              media="(min-width: 768px)"
              srcSet="/hero_section_image/tablet_version.png"
            />
            <img
              src="/hero_section_image/mobile_version.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_35%] md:object-center"
            />
          </picture>
        </motion.div>
        {/* Bottom fade only — side wash removed; mobile copy uses local scrim */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-cream/45 to-transparent md:h-40 md:from-cream/50" />
      </div>

      {/* —— Mobile layout: top-left copy, bottom-right CTA —— */}
      <div className="relative z-10 flex flex-1 flex-col md:hidden">
        <div className="relative mr-auto w-[min(20rem,92%)] px-4 pt-2 text-left sm:px-5">
          {/* Local cream scrim behind copy */}
          <div
            className="pointer-events-none absolute -inset-x-2 -inset-y-3 z-0 bg-gradient-to-r from-cream via-cream/95 to-transparent sm:-inset-x-3"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <MobileEyebrow text={hero.eyebrow} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-5 font-serif text-[2.35rem] leading-[1.08] font-medium tracking-tight text-ink"
            >
              {hero.headline[0]}
              <br />
              {hero.headline[1]}{' '}
              <span className="text-gold">{hero.highlight}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-4 max-w-[16rem] font-sans text-sm leading-relaxed text-ink/75"
            >
              {hero.subcopy}
            </motion.p>
          </div>
        </div>

        <motion.a
          href={hero.ctaHref}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="absolute right-4 bottom-24 z-20 inline-flex items-center gap-2 border-b border-gold pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-gold uppercase transition-colors hover:border-gold-dark hover:text-gold-dark sm:right-5"
        >
          {hero.cta}
          <span aria-hidden="true">→</span>
        </motion.a>
      </div>

      {/* —— Desktop / tablet layout (unchanged structure) —— */}
      <div className="relative z-10 mr-auto hidden w-full flex-1 flex-col justify-center px-4 pb-16 pl-4 sm:pl-6 md:flex md:px-6 md:pl-8 lg:pl-10 xl:pl-12">
        <div className="max-w-lg lg:max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <DiamondEyebrow text={hero.eyebrow} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-serif text-[2.6rem] leading-[1.08] font-medium tracking-tight text-ink sm:text-5xl md:mt-7 md:text-6xl lg:text-[4.1rem]"
          >
            {hero.headline[0]}
            <br />
            {hero.headline[1]}{' '}
            <span className="text-gold">{hero.highlight}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-md font-sans text-sm leading-relaxed text-ink-muted sm:text-base md:mt-6"
          >
            {hero.subcopy}
          </motion.p>

          <motion.a
            href={hero.ctaHref}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-8 inline-flex items-center gap-2 border-b border-gold pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-gold uppercase transition-colors hover:border-gold-dark hover:text-gold-dark md:mt-10"
          >
            {hero.cta}
            <span aria-hidden="true">→</span>
          </motion.a>
        </div>
      </div>

      <motion.a
        href={hero.scrollHref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute top-1/2 right-3 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 lg:right-6 lg:flex xl:right-10"
      >
        <span
          className="font-sans text-[9px] font-medium tracking-[0.28em] text-ink-muted uppercase"
          style={{ writingMode: 'vertical-rl' }}
        >
          {hero.scrollLabel}
        </span>
        <span className="relative flex h-8 w-5 items-start justify-center rounded-full border border-ink/25 pt-1.5">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-gold"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  )
}
