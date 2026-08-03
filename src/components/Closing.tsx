import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { closing } from '../data/content'

const CREAM = '#FFF8F0'
const GOLD = '#D4AF37'
const OVERLAY = 'rgba(20, 10, 4, 0.55)'

export function Closing() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [1, 1.06],
  )

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-svh scroll-mt-24 items-center justify-center overflow-hidden"
    >
      {/* Full-bleed background + Ken Burns */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: bgScale }}
        aria-hidden="true"
      >
        <picture className="block h-full w-full">
          <source media="(min-width: 768px)" srcSet={closing.desktopImage} />
          <img
            src={closing.mobileImage}
            alt=""
            className="h-full w-full object-cover object-center"
            draggable={false}
          />
        </picture>
      </motion.div>

      <div
        className="absolute inset-0"
        style={{ backgroundColor: OVERLAY }}
        aria-hidden="true"
      />

      {/* Centered content */}
      <div className="relative z-10 mx-auto max-w-[680px] px-6 py-24 text-center md:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: reduceMotion ? 0.25 : 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: GOLD }}
          >
            {closing.eyebrow}
          </p>
          <h2
            className="mt-6 font-serif text-4xl leading-[1.12] font-light tracking-tight italic md:text-5xl lg:text-[3.4rem]"
            style={{ color: CREAM }}
          >
            {closing.headline[0]}
            <br />
            {closing.headline[1]}
          </h2>
          <p
            className="mx-auto mt-7 max-w-lg font-sans text-sm leading-relaxed md:text-base"
            style={{ color: 'rgba(255,248,240,0.78)' }}
          >
            {closing.body}
          </p>
        </motion.div>

        <ul className="mt-10 space-y-3">
          {closing.contacts.map((item, i) => (
            <motion.li
              key={item.label}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: reduceMotion ? 0.2 : 0.5,
                delay: reduceMotion ? 0 : 0.45 + i * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <a
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  item.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="font-sans text-[11px] font-medium tracking-[0.16em] uppercase transition-opacity hover:opacity-80 md:text-xs"
                style={{ color: CREAM }}
              >
                {item.label}
              </a>
            </motion.li>
          ))}
        </ul>

        <motion.div
          className="mt-10"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: reduceMotion ? 0.2 : 0.4,
            delay: reduceMotion ? 0 : 1,
          }}
        >
          <a
            href={`mailto:prabhakardyeing@gmail.com?subject=${encodeURIComponent(
              'Contact Prabhakar Processors',
            )}`}
            className="relative inline-block font-sans text-[0.9rem] font-medium tracking-[0.12em] uppercase"
            style={{ color: GOLD }}
          >
            {closing.cta}
            <span aria-hidden="true"> →</span>
            <motion.span
              className="absolute inset-x-0 -bottom-0.5 h-px origin-left"
              style={{ backgroundColor: GOLD }}
              initial={reduceMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: reduceMotion ? 0.15 : 0.7,
                delay: reduceMotion ? 0 : 1,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-hidden="true"
            />
          </a>
        </motion.div>

        <motion.address
          className="mx-auto mt-12 max-w-sm font-sans text-[11px] leading-relaxed not-italic md:text-xs"
          style={{ color: 'rgba(255,248,240,0.45)' }}
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: reduceMotion ? 0.2 : 0.5,
            delay: reduceMotion ? 0 : 1.15,
          }}
        >
          {closing.address.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.address>
      </div>
    </section>
  )
}
