import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Three cinematic moments — each image has a cream zone for its text
const MOMENTS = [
  {
    id: 'M1',
    desktop: '/assets/landing/hero-desktop.png',
    mobile: '/assets/landing/hero-mobile.png',
    // Text sits in the left-centre cream zone of the hero image
    textPos: { left: '5%', top: '14%', width: '34%' },
    lines: [
      { text: 'PRABHAKAR', cls: 'land-line-eyebrow' },
      { text: 'PROCESSORS', cls: 'land-line-eyebrow' },
      { text: 'Where Grey', cls: 'land-line-h1' },
      { text: 'Becomes', cls: 'land-line-h1' },
      { text: 'Brilliant.', cls: 'land-line-h1 land-line-italic' },
    ],
  },
  {
    id: 'M2',
    desktop: '/assets/landing/fabric-desktop.png',
    mobile: '/assets/landing/fabric-mobile.png',
    // Text sits in the left cream zone of the grey fabric image
    textPos: { left: '5%', top: '50%', transform: 'translateY(-50%)', width: '38%' },
    lines: [
      { text: 'Surat, Gujarat', cls: 'land-line-eyebrow' },
      { text: 'Every Metre', cls: 'land-line-h2' },
      { text: 'Carries Our', cls: 'land-line-h2' },
      { text: 'Signature.', cls: 'land-line-h2 land-line-italic' },
    ],
  },
  {
    id: 'M3',
    desktop: '/assets/landing/process-desktop.png',
    mobile: '/assets/landing/process-mobile.png',
    // Text sits in the upper-left cream zone, between the ribbon waves
    textPos: { left: '5%', top: '10%', width: '42%' },
    lines: [
      { text: 'Dyeing · Printing · Finishing', cls: 'land-line-eyebrow' },
      { text: 'One Company.', cls: 'land-line-h2' },
      { text: 'Every Process.', cls: 'land-line-h2' },
    ],
    showEnter: true,
  },
]

export default function LandingPage({ onEnter }) {
  const pageRef = useRef(null)
  const [entered, setEntered] = useState(false)
  const [currentMoment, setCurrentMoment] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      MOMENTS.forEach((moment, idx) => {
        const panel = document.querySelector(`[data-moment="${idx}"]`)
        if (!panel) return

        // Animate text in when each moment scrolls into view
        const textEls = panel.querySelectorAll('.land-animate')
        gsap.fromTo(
          textEls,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
              onEnter: () => setCurrentMoment(idx),
            },
          }
        )
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  const handleEnter = () => {
    if (entered) return
    setEntered(true)
    // Fade page out, then call onEnter
    gsap.to(pageRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: onEnter,
    })
  }

  return (
    <div className="landing-page" ref={pageRef}>

      {/* Progress dots */}
      <div className="landing-progress">
        {MOMENTS.map((_, i) => (
          <div
            key={i}
            className={`landing-dot ${i === currentMoment ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* The three moments */}
      {MOMENTS.map((moment, idx) => (
        <div
          key={moment.id}
          className="landing-moment"
          data-moment={idx}
        >
          {/* Full-bleed illustration */}
          <picture>
            <source media="(max-width: 768px)" srcSet={moment.mobile} />
            <img
              className="landing-img"
              src={moment.desktop}
              alt=""
              aria-hidden="true"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </picture>

          {/* Text in the cream zone */}
          <div className="landing-text" style={moment.textPos}>
            {moment.lines.map((line, li) => (
              <div
                key={li}
                className={`land-animate ${line.cls}`}
              >
                {line.text}
              </div>
            ))}

            {moment.showEnter && (
              <button
                className="land-animate landing-enter-btn"
                onClick={handleEnter}
                aria-label="Enter the website"
              >
                <span className="enter-btn-text">Enter</span>
                <span className="enter-btn-arrow">→</span>
              </button>
            )}
          </div>

        </div>
      ))}

      {/* Scroll cue — shown only at top */}
      <div className="landing-scroll-cue">
        <div className="landing-scroll-line" />
        <span className="landing-scroll-label">SCROLL</span>
      </div>

    </div>
  )
}
