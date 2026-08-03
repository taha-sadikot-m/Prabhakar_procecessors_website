import { useEffect, useRef, useState } from 'react'

const SECTORS = [
  'Fabric Traders',
  'Garment Exporters',
  'Fashion Brands',
  'Wholesalers',
  'Retail Chains',
]

function Counter({ value, suffix = '', duration = 1800, active }) {
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current) return
    started.current = true
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(value)
    }
    requestAnimationFrame(step)
  }, [active, value, duration])

  return <>{count}{suffix}</>
}

export default function TrustSection({ onVisible }) {
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
    <div className="trust-v2" ref={ref}>

      {/* Subtle woven grid — actual fabric texture in CSS */}
      <div className="trust-weave-bg" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="weave-grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0"  x2="48" y2="0"  stroke="#F7941D" strokeWidth="0.5" strokeOpacity="0.1"/>
              <line x1="0" y1="24" x2="48" y2="24" stroke="#F7941D" strokeWidth="0.5" strokeOpacity="0.06"/>
              <line x1="0" y1="0"  x2="0"  y2="48" stroke="#1A237E" strokeWidth="0.5" strokeOpacity="0.07"/>
              <line x1="24" y1="0" x2="24" y2="48" stroke="#1A237E" strokeWidth="0.5" strokeOpacity="0.04"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#weave-grid)" />
        </svg>
      </div>

      <div className="trust-content-v2">

        {/* LEFT: Quote column */}
        <div className="trust-quote-side">
          <div
            className="trust-eyebrow"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.1s' }}
          >
            ❁&nbsp;&nbsp;CLIENT TRUST
          </div>

          <h2
            className="trust-quote-text"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(22px)',
              transition: 'opacity 1.1s ease 0.25s, transform 1.1s ease 0.25s',
            }}
          >
            Every Client<br />Is a Thread<br />In Our Fabric.
          </h2>

          <div
            className="trust-rule"
            style={{
              transform: visible ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 0.9s ease 0.65s',
            }}
          />

          <div
            className="trust-sectors-v2"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.95s' }}
          >
            {SECTORS.map((s, i) => (
              <span key={s}>
                {i > 0 && <span className="trust-sector-pip">·</span>}
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: Number monument */}
        <div className="trust-number-side">
          <div
            className="trust-big-number"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 1.2s ease 0.4s, transform 1.2s ease 0.4s',
            }}
          >
            <Counter value={700} suffix="+" active={visible} />
          </div>

          <div
            className="trust-number-label"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.85s' }}
          >
            ACTIVE CLIENTS<br />ACROSS INDIA
          </div>

          <div
            className="trust-years-block"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.9s ease 1.1s, transform 0.9s ease 1.1s',
            }}
          >
            <div className="trust-years-number">17</div>
            <div className="trust-years-label">YEARS IN<br />BUSINESS</div>
          </div>
        </div>

      </div>
    </div>
  )
}
