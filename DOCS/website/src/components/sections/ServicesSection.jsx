import { useEffect, useRef, useState } from 'react'
import SwatchCard from './SwatchCard'
import KanthaLine from '../KanthaLine'

const SWATCHES = [
  { name: 'Piece Dyeing',         desc: 'Colouring individual fabric lengths to perfectly uniform shades.',              image: '/assets/swatch-01-piece-dyeing.png' },
  { name: 'Solid Dyeing',         desc: 'Batch dyeing for consistent, high-volume colour application.',                  image: '/assets/swatch-02-solid-dyeing.png' },
  { name: 'Cationic Dyeing',      desc: 'Brilliant shades with excellent wash fastness for synthetic fibres.',           image: '/assets/swatch-03-cationic-dyeing.png' },
  { name: 'Screen Printing',      desc: 'Rich, vibrant designs applied through precision woven mesh screens.',           image: '/assets/swatch-04-screen-printing.png' },
  { name: 'Discharge Printing',   desc: 'Intricate soft-hand patterns via controlled discharge of colour from fabric.',  image: '/assets/swatch-05-discharge-printing.png' },
  { name: 'Digital Printing',     desc: 'Photographic quality, unlimited colour range, rapid sample development.',       image: '/assets/swatch-06-digital-printing.png' },
  { name: 'Shearing',             desc: 'Precision surface cutting for a clean, uniform, smooth fabric finish.',         image: '/assets/swatch-07-shearing.png' },
  { name: 'Sueding',              desc: 'Mechanical abrasion that imparts a suede-like, tactile soft texture.',          image: '/assets/swatch-08-sueding.png' },
  { name: 'Water Repellency',     desc: 'Hydrophobic treatment for durable moisture-resistant fabric performance.',      image: '/assets/swatch-09-water-repellency.png' },
  { name: 'Soil & Stain Release', desc: 'Chemical finish enabling effortless cleaning and long-term maintenance.',       image: '/assets/swatch-10-soil-release.png' },
  { name: 'Rotary Allover',       desc: 'Dense, consistent allover print patterns at high repeat and volume.',           image: '/assets/swatch-11-rotary-allover.png' },
  { name: 'Foil & Jari Print',    desc: 'Metallic gold and silver foil on fabric — the luxury zari effect.',            image: '/assets/swatch-12-foil-jari-print.png' },
]

export default function ServicesSection({ onVisible }) {
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
      { threshold: 0.08 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="services-v2" ref={ref}>

      {/* Header */}
      <div
        className="services-v2-header"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(18px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <div className="services-v2-eyebrow">❁&nbsp;&nbsp;WHAT WE DO</div>
        <div className="services-v2-title">The Swatch Book</div>
        <KanthaLine color="#F7941D" style={{ maxWidth: 200, margin: '1rem 0' }} />
        <p className="services-v2-sub">Hover each swatch to reveal the process behind it.</p>
      </div>

      {/* 4 × 3 grid — fabric sample book */}
      <div className="swatch-v2-grid">
        {SWATCHES.map((swatch, i) => (
          <div
            key={swatch.name}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.55s ease ${0.04 * i}s, transform 0.55s ease ${0.04 * i}s`,
            }}
          >
            <SwatchCard swatch={swatch} />
          </div>
        ))}
      </div>
    </div>
  )
}
