import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToHash } from './ScrollToHash'
import { WhatsAppButton } from './WhatsAppButton'

export function Layout() {
  return (
    <div className="min-h-svh bg-cream">
      <ScrollToHash />
      <Header />
      <Outlet />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
