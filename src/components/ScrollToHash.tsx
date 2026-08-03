import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scrolls to hash targets after client-side navigation (e.g. /about#leadership). */
export function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    const id = hash.replace('#', '')
    const el = document.getElementById(id)
    if (!el) return

    const frame = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
