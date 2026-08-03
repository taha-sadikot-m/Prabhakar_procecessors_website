import { useEffect, useState, useRef } from 'react'

export default function WarpThreadNav({ sections, activeSection }) {
  const [scrollPct, setScrollPct] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const threadColors = {
    hero:     '#F7941D',
    story:    '#168AAD',
    process:  '#CC2936',
    scale:    '#D4AF37',
    services: '#F7941D',
    trust:    '#F7941D',
    contact:  '#2D1B0E',
  }

  return (
    <nav className="warp-nav" aria-label="Page navigation">
      <div className="warp-nav-track">
        <div
          className="warp-nav-fill"
          style={{
            height: `${scrollPct}%`,
            background: threadColors[activeSection] || '#F7941D',
          }}
        />
        {sections.map((s, i) => (
          <button
            key={s.id}
            className="warp-nav-tag"
            style={{ top: `${(i / (sections.length - 1)) * 94 + 3}%` }}
            onClick={() => scrollTo(s.id)}
            aria-label={`Go to ${s.label}`}
          >
            <span className="tag-line" />
            <span className="tag-label">{s.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
