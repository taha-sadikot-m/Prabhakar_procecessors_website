import { useEffect, useRef, useState } from 'react'

export default function BrandStorySection({ onVisible }) {
  const sectionRef = useRef(null)
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
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="brand-v2" ref={sectionRef}>

      {/* Full-bleed threads image */}
      <img
        className="brand-threads-img"
        src="/assets/main-brand-story-threads.png"
        alt=""
        aria-hidden="true"
      />

      {/* Dark warm overlay so text reads on the threads image */}
      <div className="brand-overlay" />

      {/* Content */}
      <div className="brand-content">

        {/* LEFT: Year monument */}
        <div
          className="brand-year-col"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1.2s ease 0.2s, transform 1.2s ease 0.2s',
          }}
        >
          <div className="brand-big-year">17</div>
          <div className="brand-year-label">YEARS</div>
        </div>

        {/* Vertical divider */}
        <div
          className="brand-divider"
          style={{
            transform: visible ? 'scaleY(1)' : 'scaleY(0)',
            transition: 'transform 1.1s ease 0.4s',
          }}
        />

        {/* RIGHT: Story */}
        <div className="brand-text-col">

          <div
            className="brand-eyebrow"
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.7s ease 0.5s',
            }}
          >
            ❁&nbsp;&nbsp;EST. 2009 · SURAT, GUJARAT
          </div>

          <h2
            className="brand-headline"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 1.1s ease 0.6s, transform 1.1s ease 0.6s',
            }}
          >
            One Company.<br />
            Every Process.<br />
            No Second Vendor.
          </h2>

          <div
            className="brand-gold-rule"
            style={{
              transform: visible ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 0.9s ease 0.9s',
            }}
          />

          <p
            className="brand-body"
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 1s ease 1.05s',
            }}
          >
            Since 2009, Prabhakar Processors has run the entire textile
            processing chain under one roof — dyeing, printing, finishing,
            delivery. No handoffs. No quality loss between vendors. Just
            grey fabric in, finished cloth out, on time, every time.
          </p>

          <div
            className="brand-stats-row"
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.9s ease 1.3s',
            }}
          >
            <div className="brand-stat">
              <span className="brand-stat-num">6,00,000</span>
              <span className="brand-stat-unit">metres / day capacity</span>
            </div>
            <div className="brand-stat-sep" />
            <div className="brand-stat">
              <span className="brand-stat-num">India's</span>
              <span className="brand-stat-unit">synthetic textile capital</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
