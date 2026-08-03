import { useEffect, useRef, useState } from 'react'

export default function KanthaLine({ color = '#F7941D', className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className={`kantha-line ${className}`} ref={ref}>
      <svg
        className={`kantha-svg ${visible ? 'visible' : ''}`}
        height="6"
        viewBox="0 0 400 6"
        preserveAspectRatio="none"
        style={{ display: 'block', height: '6px' }}
      >
        {/* Dashed running stitch */}
        <line
          x1="0" y1="3" x2="400" y2="3"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="8 5"
          strokeLinecap="round"
        />
        {/* Lotus dot at center */}
        <circle cx="200" cy="3" r="3.5" fill={color} />
        <circle cx="200" cy="3" r="5.5" fill="none" stroke={color} strokeWidth="1" />
      </svg>
    </div>
  )
}
