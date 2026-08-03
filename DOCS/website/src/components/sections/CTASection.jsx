import { useEffect, useRef, useState } from 'react'
import KanthaLine from '../KanthaLine'

export default function CTASection({ onVisible }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          onVisible?.()
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="cta-section" ref={ref}>

      {/* Left */}
      <div
        className="cta-left"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(-40px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <div className="cta-headline">
          Let's Process<br />Your Next Order.
        </div>
        <KanthaLine color="rgba(45,27,14,0.4)" className="mb-4" style={{ maxWidth: 300 }} />
        <p className="cta-sub">
          From grey fabric to finished cloth — we handle everything.
          Tell us what you need.
        </p>
      </div>

      {/* Right */}
      <div
        className="cta-right"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(40px)',
          transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
        }}
      >
        <a href="tel:+919909970505" className="cta-contact-item">
          +91 9909970505
        </a>
        <a href="mailto:prabhakardyeing@gmail.com" className="cta-contact-item"
          style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1.4rem)' }}>
          prabhakardyeing@gmail.com
        </a>
        <div className="cta-location">
          Surat – Bardoli Road · Kadodara · Gujarat – 394327
        </div>

        {/* Rangoli dots decoration */}
        <div style={{
          marginTop: '2rem',
          fontSize: '10px',
          letterSpacing: '6px',
          color: 'rgba(45,27,14,0.25)',
        }}>
          · · · ❁ · · ·
        </div>
      </div>

      {/* Thread knot bottom left */}
      <div className="cta-rangoli">
        <span className="thread-knot">✦</span>
      </div>
    </div>
  )
}
