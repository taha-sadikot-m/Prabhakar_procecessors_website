import { motion, useReducedMotion } from 'framer-motion'
import { future } from '../data/content'
import { SectionCta } from './SectionCta'

const SURFACE = '#FAF0E6'
const HEADING = '#20222D'
const MAHOGANY = '#674438'
const ACCENT = '#674438'
const DIVIDER = 'rgba(32,34,45,0.08)'
const BODY = 'rgba(45,27,14,0.6)'

export function Future() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="future"
      className="scroll-mt-24 py-20 md:py-28 lg:py-32"
      style={{ backgroundColor: SURFACE }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">
        <motion.div
          className="max-w-3xl"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: reduceMotion ? 0.2 : 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: MAHOGANY }}
          >
            {future.eyebrow}
          </p>
          <h2
            className="mt-5 font-serif text-4xl leading-[1.12] font-medium tracking-tight md:text-5xl lg:text-[3.25rem]"
            style={{ color: HEADING }}
          >
            {future.headline}
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:mt-20 md:grid-cols-3">
          {future.panels.map((panel, i) => (
            <motion.article
              key={panel.id}
              className={`flex flex-col py-10 md:px-6 md:py-2 md:border-t-0 lg:px-8 ${
                i > 0 ? 'border-t' : ''
              }`}
              style={i > 0 ? { borderColor: DIVIDER } : undefined}
              initial={reduceMotion ? false : { opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: reduceMotion ? 0.2 : 0.65,
                delay: reduceMotion ? 0 : i * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className={`flex h-full flex-col ${
                  i > 0 ? 'md:border-l md:pl-8 lg:pl-10' : ''
                }`}
                style={i > 0 ? { borderColor: DIVIDER } : undefined}
              >
                <div className="mb-8 aspect-[4/3] w-full overflow-hidden">
                  <motion.img
                    src={panel.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    initial={reduceMotion ? false : { scale: 0.97 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: reduceMotion ? 0.2 : 0.8,
                      delay: reduceMotion ? 0 : i * 0.2 + 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>

                <h3
                  className="font-serif text-[1.45rem] leading-snug font-normal tracking-tight md:text-[1.6rem]"
                  style={{ color: HEADING }}
                >
                  {panel.title}
                </h3>

                <motion.span
                  className="mt-3 mb-4 block h-px origin-left"
                  style={{ width: 28, backgroundColor: ACCENT }}
                  initial={reduceMotion ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: reduceMotion ? 0.15 : 0.8,
                    delay: reduceMotion ? 0 : i * 0.2 + 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  aria-hidden="true"
                />

                <p
                  className="font-sans text-[0.84rem] leading-[1.8]"
                  style={{ color: BODY }}
                >
                  {panel.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4 sm:gap-5 md:mt-16">
          <SectionCta label={future.cta} to={future.ctaHref} />
          {future.secondaryCta && future.secondaryHref && (
            <SectionCta
              label={future.secondaryCta}
              to={future.secondaryHref}
              variant="outline"
            />
          )}
        </div>
      </div>
    </section>
  )
}
