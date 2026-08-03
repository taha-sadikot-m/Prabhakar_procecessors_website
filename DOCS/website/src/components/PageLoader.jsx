import { useEffect, useRef } from 'react'

export default function PageLoader({ loaded }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (loaded && overlayRef.current) {
      overlayRef.current.style.animation = 'loaderSlideUp 0.7s ease forwards'
      overlayRef.current.style.animationDelay = '0.1s'
      setTimeout(() => {
        if (overlayRef.current) overlayRef.current.style.display = 'none'
      }, 900)
    }
  }, [loaded])

  const threads = Array.from({ length: 14 }, (_, i) => i)

  return (
    <div className="loader-overlay" ref={overlayRef}>
      <div className="loader-loom">
        {threads.map((i) => (
          <div
            key={i}
            className="warp-thread"
            style={{
              left: `${(i / (threads.length - 1)) * 100}%`,
              animationDelay: `${i * 0.04}s`,
              height: '100%',
              animationDuration: '0.5s',
            }}
          />
        ))}
        <div className="weft-thread" />
      </div>
      <div className="loader-brand">PRABHAKAR</div>
      <div className="loader-sub">Processors Pvt Ltd · Surat, Gujarat</div>
    </div>
  )
}
