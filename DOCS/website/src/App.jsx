import { useState, useEffect } from 'react'
import PageLoader from './components/PageLoader'
import CustomCursor from './components/CustomCursor'
import SiteNav from './components/SiteNav'
import HeroSection from './components/sections/HeroSection'
import StorySection from './components/sections/StorySection'
import ProcessSection from './components/sections/ProcessSection'
import CapabilitiesSection from './components/sections/CapabilitiesSection'
import ProofSection from './components/sections/ProofSection'
import ContactSection from './components/sections/ContactSection'
import Footer from './components/sections/Footer'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <PageLoader loaded={loaded} />
      <CustomCursor />
      <SiteNav />

      <main>
        {/* 1 — Who are you? */}
        <section id="hero">
          <HeroSection />
        </section>

        {/* 2 — Why us? */}
        <section id="story">
          <StorySection />
        </section>

        {/* 3 — How do you do it? */}
        <section id="process">
          <ProcessSection />
        </section>

        {/* 4 — What exactly can you do? */}
        <section id="capabilities">
          <CapabilitiesSection />
        </section>

        {/* 5 — Can you be trusted? */}
        <section id="proof">
          <ProofSection />
        </section>

        {/* 6 — How do I reach you? */}
        <section id="contact">
          <ContactSection />
        </section>

        <Footer />
      </main>
    </>
  )
}
