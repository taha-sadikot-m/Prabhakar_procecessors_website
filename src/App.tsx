import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AboutPage } from './pages/AboutPage'
import { CareersPage } from './pages/CareersPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { ServicesPage } from './pages/ServicesPage'
import { TestimonialsPage } from './pages/TestimonialsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
