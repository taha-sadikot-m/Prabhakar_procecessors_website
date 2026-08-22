import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react'

type FadeInProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export function FadeIn({
  children,
  className = '',
  delay = 0,
  y = 28,
  style,
  ...rest
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.01 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const mergedStyle: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate3d(0,0,0)' : `translate3d(0,${y}px,0)`,
    transitionProperty: 'opacity, transform',
    transitionDuration: '0.75s',
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: visible ? `${delay}s` : '0s',
    willChange: visible ? undefined : 'opacity, transform',
    ...style,
  }

  return (
    <div ref={ref} className={className} style={mergedStyle} {...rest}>
      {children}
    </div>
  )
}
