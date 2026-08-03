import { useEffect, useRef, useState } from 'react'

const CAPABILITIES = [
  {
    num: '01',
    name: 'Dyeing',
    tagline: '3,50,000 metres transformed daily.',
    techniques: [
      'Piece Dyeing',
      'Solid Dyeing',
      'Cationic Dyeing',
      'Reactive Dyeing',
      'Disperse Dyeing',
    ],
    swatches: [
      '/assets/swatch-01-piece-dyeing.png',
      '/assets/swatch-02-solid-dyeing.png',
      '/assets/swatch-03-cationic-dyeing.png',
    ],
    accent: '#F7941D',
  },
  {
    num: '02',
    name: 'Printing',
    tagline: '2,50,000 metres printed per day.',
    techniques: [
      'Screen Printing',
      'Discharge Printing',
      'Digital Printing',
      'Rotary Allover',
      'Flatbed Printing',
      'Pigment · Foil · Jari · Prism · Moorga',
    ],
    swatches: [
      '/assets/swatch-04-screen-printing.png',
      '/assets/swatch-05-discharge-printing.png',
      '/assets/swatch-06-digital-printing.png',
    ],
    accent: '#CC2936',
  },
  {
    num: '03',
    name: 'Finishing',
    tagline: 'Surface that feels as right as it looks.',
    techniques: [
      'Sueding',
      'Shearing',
      'Water Repellency',
      'Soil Release',
      'Anti-static Treatment',
    ],
    swatches: [
      '/assets/swatch-07-shearing.png',
      '/assets/swatch-08-sueding.png',
      '/assets/swatch-09-water-repellency.png',
    ],
    accent: '#168AAD',
  },
]

function CapCol({ cap, visible, delay }) {
  return (
    <div
      className="cap-col"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.95s ease ${delay}s, transform 0.95s ease ${delay}s`,
      }}
    >
      <div className="cap-ghost-num">{cap.num}</div>

      <div className="cap-accent-rule" style={{ background: cap.accent }} />

      <h3 className="cap-name" style={{ color: '#2D1B0E' }}>{cap.name}</h3>

      <p className="cap-tagline">{cap.tagline}</p>

      <ul className="cap-list">
        {cap.techniques.map(t => (
          <li key={t} className="cap-list-item">
            <span className="cap-pip" style={{ background: cap.accent }} />
            {t}
          </li>
        ))}
      </ul>

      {/* Fabric swatch thumbnails — showing what this process produces */}
      <div className="cap-swatches">
        {cap.swatches.map((src, i) => (
          <div
            key={i}
            className="cap-swatch-thumb"
            style={{ backgroundImage: `url(${src})` }}
            title={`${cap.name} example`}
          />
        ))}
        <div className="cap-swatch-label">Sample outputs</div>
      </div>
    </div>
  )
}

export default function CapabilitiesSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="cap-section" ref={ref}>
      <div
        className="cap-header"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.1s' }}
      >
        <span className="cap-eyebrow">❁ &nbsp;What We Do</span>
        <h2 className="cap-title">
          Every process.<br />
          <em>Under one roof.</em>
        </h2>
      </div>

      <div className="cap-grid">
        {CAPABILITIES.map((cap, i) => (
          <CapCol key={cap.num} cap={cap} visible={visible} delay={0.2 + i * 0.15} />
        ))}
      </div>
    </div>
  )
}
