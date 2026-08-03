import { useState } from 'react'

export default function SwatchCard({ swatch }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="swatch-v2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={swatch.name}
    >
      {/* Texture image — subtle zoom on hover */}
      <div
        className="swatch-v2-img"
        style={{
          backgroundImage: `url(${swatch.image})`,
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.65s ease',
        }}
      />

      {/* Indigo overlay — fades + slides up */}
      <div
        className="swatch-v2-overlay"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        <div className="swatch-v2-name">{swatch.name}</div>
        <div className="swatch-v2-rule" />
        <div className="swatch-v2-desc">{swatch.desc}</div>
      </div>

      {/* Persistent bottom label */}
      <div
        className="swatch-v2-bar"
        style={{
          opacity: hovered ? 0 : 1,
          transition: 'opacity 0.22s ease',
        }}
      >
        {swatch.name}
      </div>
    </div>
  )
}
