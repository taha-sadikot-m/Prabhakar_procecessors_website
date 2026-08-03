import { useEffect, useRef, useState } from 'react'

function Counter({ value, suffix = '', active, delay = 0 }) {
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current) return
    const t = setTimeout(() => {
      started.current = true
      let start = null
      const step = (ts) => {
        if (!start) start = ts
        const p = Math.min((ts - start) / 2000, 1)
        const eased = 1 - Math.pow(1 - p, 4)
        setCount(Math.floor(eased * value))
        if (p < 1) requestAnimationFrame(step)
        else setCount(value)
      }
      requestAnimationFrame(step)
    }, delay)
    return () => clearTimeout(t)
  }, [active, value, delay])

  return <>{count.toLocaleString('en-IN')}{suffix}</>
}

const STATS = [
  { value: 700,    suffix: '+', label: 'Active Clients', sub: 'Pan India', delay: 0 },
  { value: 17,     suffix: '',  label: 'Years in Business', sub: 'Est. 2009, Surat', delay: 200 },
  { value: 600000, suffix: '',  label: 'Metres / Day', sub: 'Combined capacity', delay: 400 },
]

const SECTORS = [
  'Fabric Traders', 'Garment Exporters', 'Fashion Brands',
  'Wholesalers', 'Retail Chains', 'Export Houses',
]

export default function ProofSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="proof-section" ref={ref}>

      {/* Threads background image — dark overlay makes it moody */}
      <img className="proof-bg-img" src="/assets/main-brand-story-threads.png" alt="" aria-hidden="true" />
      <div className="proof-overlay" />

      <div className="proof-inner">

        {/* Quote — top */}
        <div
          className="proof-quote"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s ease 0.15s, transform 1s ease 0.15s',
          }}
        >
          "Every Client Is a Thread<br />In Our Fabric."
        </div>

        {/* Horizontal gold rule */}
        <div
          className="proof-rule"
          style={{
            transform: visible ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1.1s ease 0.5s',
          }}
        />

        {/* Three numbers */}
        <div className="proof-stats">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="proof-stat"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.9s ease ${0.55 + i * 0.14}s, transform 0.9s ease ${0.55 + i * 0.14}s`,
              }}
            >
              <div className="proof-num">
                <Counter value={s.value} suffix={s.suffix} active={visible} delay={s.delay} />
              </div>
              <div className="proof-stat-label">{s.label}</div>
              <div className="proof-stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Sectors */}
        <div
          className="proof-sectors"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 1.2s',
          }}
        >
          <span className="proof-sectors-label">We serve&nbsp;—&nbsp;</span>
          {SECTORS.map((s, i) => (
            <span key={s}>
              {s}{i < SECTORS.length - 1 && <span className="proof-pip"> · </span>}
            </span>
          ))}
        </div>

      </div>
    </div>
  )
}
