import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STAGES = [
  {
    id: 'intro',
    tag: 'THE PROCESS',
    headline: 'Grey to Brilliant.\nUnder One Roof.',
    sub: 'Dyeing · Printing · Finishing. Every step owned by us. Zero vendor handoffs.',
    bg: '/assets/landing/process-desktop.png',
    bgMobile: '/assets/landing/process-mobile.png',
    textPos: { left: '5%', top: '9%', width: '42%' },
    accent: '#D4AF37',
  },
  {
    id: 'S01',
    tag: '01 · Grey Fabric',
    headline: 'Grey Fabric.\nFull of Potential.',
    sub: "We collect from your location or from Surat's textile markets. The journey begins here.",
    bg: '/assets/main-process-01-intake-desktop.png',
    bgMobile: '/assets/main-process-01-intake-mobile.png',
    textPos: { left: '6%', bottom: '9%', width: '34%' },
    accent: '#F7941D',
  },
  {
    id: 'S02',
    tag: '02 · Dyeing',
    headline: '3,50,000 Metres\nTransformed Daily.',
    sub: 'Piece dyeing. Solid dyeing. Cationic dyeing. Every shade, consistent batch to batch.',
    bg: '/assets/main-process-02-dyeing-desktop.png',
    bgMobile: '/assets/main-process-02-dyeing-mobile.png',
    textPos: { left: '6%', top: '12%', width: '32%' },
    accent: '#CC2936',
  },
  {
    id: 'S03',
    tag: '03 · Printing',
    headline: '2,50,000 Metres\nPrinted Per Day.',
    sub: 'Screen. Discharge. Digital. Rotary. Flatbed. Pigment. Foil. Jari. Prism. Moorga.',
    bg: '/assets/main-process-03-printing-desktop.png',
    bgMobile: '/assets/main-process-03-printing-mobile.png',
    textPos: { left: '6%', top: '50%', transform: 'translateY(-50%)', width: '30%' },
    accent: '#FFB627',
  },
  {
    id: 'S04',
    tag: '04 · Finishing',
    headline: 'The Last 1%\nMatters as Much.',
    sub: 'Sueding. Shearing. Water repellency. Soil release. Surface that feels as right as it looks.',
    bg: '/assets/main-process-04-finishing-desktop.png',
    bgMobile: '/assets/main-process-04-finishing-mobile.png',
    textPos: { left: '6%', bottom: '11%', width: '34%' },
    accent: '#168AAD',
  },
  {
    id: 'S05',
    tag: '05 · Delivered',
    headline: 'Your Fabric.\nOn Time. Every Time.',
    sub: 'Quality inspected. Packed. Delivered to your door. The promise kept.',
    bg: '/assets/main-process-05-delivery-desktop.png',
    bgMobile: '/assets/main-process-05-delivery-mobile.png',
    textPos: { left: '6%', top: '50%', transform: 'translateY(-50%)', width: '28%' },
    accent: '#D4AF37',
  },
]

export default function ProcessSection() {
  const wrapperRef   = useRef(null)
  const containerRef = useRef(null)
  const trackRef     = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current
      const container = containerRef.current
      if (!track || !container) return

      // Use arrow functions so values recompute on resize/invalidate
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="process-wrapper" ref={wrapperRef}>
      <div className="process-pin-container" ref={containerRef}>
        <div className="process-track" ref={trackRef}>
          {STAGES.map((stage, idx) => (
            <div className="process-stage" key={stage.id}>

              <picture>
                <source media="(max-width: 768px)" srcSet={stage.bgMobile} />
                <img
                  className="process-stage-img"
                  src={stage.bg}
                  alt=""
                  aria-hidden="true"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </picture>

              <div className="process-stage-text" style={stage.textPos}>
                <div className="process-tag" style={{ color: stage.accent }}>
                  {stage.tag}
                </div>
                <div className="process-rule" style={{ background: stage.accent }} />
                <h2 className="process-headline">
                  {stage.headline.split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </h2>
                <p className="process-body">{stage.sub}</p>
              </div>

              <div className="process-counter" style={{ color: stage.accent }}>
                {String(idx + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(STAGES.length).padStart(2, '0')}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
