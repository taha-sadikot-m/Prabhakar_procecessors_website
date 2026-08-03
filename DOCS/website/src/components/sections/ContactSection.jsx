import { useEffect, useRef, useState } from 'react'

export default function ContactSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="contact-section" ref={ref}>

      {/* Left — headline */}
      <div
        className="contact-left"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(-28px)',
          transition: 'opacity 0.95s ease 0.15s, transform 0.95s ease 0.15s',
        }}
      >
        <p className="contact-eyebrow">❁ &nbsp;Let's Work Together</p>
        <h2 className="contact-headline">
          Ready to process<br />
          your next order?
        </h2>
        <p className="contact-body">
          Grey fabric in. Finished cloth out.
          Tell us what you need — we handle the rest.
        </p>
        <div className="contact-address">
          Plot No. 13/14, Block No. 296<br />
          Village Tatithaiyya, Opp. Hotel Horizon Kadodara<br />
          Surat – Bardoli Road · Gujarat – 394327
        </div>
      </div>

      {/* Vertical divider */}
      <div
        className="contact-divider"
        style={{
          transform: visible ? 'scaleY(1)' : 'scaleY(0)',
          transition: 'transform 1s ease 0.4s',
        }}
      />

      {/* Right — contact details */}
      <div
        className="contact-right"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(28px)',
          transition: 'opacity 0.95s ease 0.3s, transform 0.95s ease 0.3s',
        }}
      >
        <a href="tel:+919909970505" className="contact-item contact-phone">
          +91 99099 70505
        </a>
        <a href="mailto:prabhakardyeing@gmail.com" className="contact-item contact-email">
          prabhakardyeing@gmail.com
        </a>
        <a href="https://prabhakarprocessors.com" className="contact-item contact-web" target="_blank" rel="noopener noreferrer">
          prabhakarprocessors.com
        </a>

        <div className="contact-lotus">❁</div>
      </div>

    </div>
  )
}
