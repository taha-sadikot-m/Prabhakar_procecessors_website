import { useEffect, useRef, useState } from 'react'

const STATS = [
  {
    label: 'DYEING CAPACITY',
    value: 350000,
    unit: 'METRES / DAY',
    suffix: '',
    delay: 0,
  },
  {
    label: 'PRINTING CAPACITY',
    value: 250000,
    unit: 'METRES / DAY',
    suffix: '',
    delay: 260,
  },
  {
    label: 'CLIENTS SERVED',
    value: 850,
    unit: 'PAN INDIA',
    suffix: '+',
    delay: 520,
  },
]

function Counter({ value, suffix = '', duration = 2400, active, delay = 0 }) {
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current) return
    const timer = setTimeout(() => {
      started.current = true
      let startTime = null
      const step = (ts) => {
        if (!startTime) startTime = ts
        const elapsed = ts - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(eased * value))
        if (progress < 1) requestAnimationFrame(step)
        else setCount(value)
      }
      requestAnimationFrame(step)
    }, delay)
    return () => clearTimeout(timer)
  }, [active, value, delay, duration])

  return <>{count.toLocaleString('en-IN')}{suffix}</>
}

export default function ScaleSection({ onVisible }) {
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
      { threshold: 0.25 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="scale-v2" ref={ref}>

      {/* Decorative top rule */}
      <div
        className="scale-h-rule scale-h-rule--top"
        style={{
          transform: visible ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1.3s ease',
        }}
      />

      {/* Section eyebrow */}
      <div
        className="scale-eyebrow"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.35s',
        }}
      >
        ❁&nbsp;&nbsp;THE SCALE OF OUR OPERATION
      </div>

      {/* Three-column stat monument */}
      <div className="scale-stats-row">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="scale-stat-block">
            {i > 0 && <div className="scale-vert-divider" />}
            <div
              className="scale-stat-inner"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.9s ease ${0.25 + i * 0.18}s, transform 0.9s ease ${0.25 + i * 0.18}s`,
              }}
            >
              <div className="scale-stat-label">{stat.label}</div>
              <div className="scale-stat-number">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  active={visible}
                  delay={stat.delay}
                />
              </div>
              <div className="scale-stat-unit">{stat.unit}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom rule */}
      <div
        className="scale-h-rule scale-h-rule--bottom"
        style={{
          transform: visible ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1.3s ease 0.45s',
        }}
      />

      {/* Footnote */}
      <div
        className="scale-footnote"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 1.4s',
        }}
      >
        700+ active clients&nbsp;&nbsp;·&nbsp;&nbsp;Surat's largest integrated processor
      </div>
    </div>
  )
}
