import { Closing } from './components/Closing'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { WhatsAppButton } from './components/WhatsAppButton'
import { Hero } from './components/Hero'
import { Ecosystem } from './components/Ecosystem'
import { Serve } from './components/Serve'
import { Journey } from './components/Journey'
import { People } from './components/People'
import { Partnerships } from './components/Partnerships'
import { Quality } from './components/Quality'
import { Future } from './components/Future'
import { Transformation } from './components/Transformation'

export default function App() {
  return (
    <div className="min-h-svh bg-cream">
      <Header />
      <main>
        <Hero />
        <Journey />
        <Transformation />
        <Quality />
        <Ecosystem />
        <Serve />
        <Partnerships />
        <Future />
        <People />
        <Closing />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
