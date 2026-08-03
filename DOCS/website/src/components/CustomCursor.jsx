import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef    = useRef(null)
  const needleRef = useRef(null)
  const trailsRef = useRef([])
  const posRef    = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) return

    const NUM_TRAILS = 8
    const trails = []
    for (let i = 0; i < NUM_TRAILS; i++) {
      const el = document.createElement('div')
      el.className = 'cursor-trail'
      el.style.cssText = `
        position:fixed; pointer-events:none; z-index:9997;
        width:2px; height:${6 + i * 3}px;
        background:rgba(247,148,29,${0.5 - i * 0.05});
        border-radius:2px; transform-origin:top center;
      `
      document.body.appendChild(el)
      trails.push({ el, x: 0, y: 0 })
    }
    trailsRef.current = trails

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top  = e.clientY + 'px'
      }
      if (needleRef.current) {
        needleRef.current.style.left = e.clientX + 'px'
        needleRef.current.style.top  = e.clientY + 'px'
      }
    }

    let animId
    let prevX = 0, prevY = 0
    const animate = () => {
      const { x, y } = posRef.current
      let lx = x, ly = y
      trails.forEach((t, i) => {
        const lag = 1 - i * 0.08
        t.x += (lx - t.x) * lag * 0.3
        t.y += (ly - t.y) * lag * 0.3
        const dx = lx - t.x, dy = ly - t.y
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
        t.el.style.left      = t.x + 'px'
        t.el.style.top       = t.y + 'px'
        t.el.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`
        lx = t.x; ly = t.y
      })
      prevX = x; prevY = y
      animId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    animId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
      trails.forEach(t => t.el.remove())
    }
  }, [])

  return (
    <>
      <div className="cursor-dot"    ref={dotRef} />
      <div className="cursor-needle" ref={needleRef} />
    </>
  )
}
