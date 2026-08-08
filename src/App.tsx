import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AboutPage } from './pages/AboutPage'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { CareersPage } from './pages/CareersPage'
import { ContactPage } from './pages/ContactPage'
import { GalleryPage } from './pages/GalleryPage'
import { HomePage } from './pages/HomePage'
import { JournalPage } from './pages/JournalPage'
import { ServicesPage } from './pages/ServicesPage'
import { TestimonialsPage } from './pages/TestimonialsPage'
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage'
import { AdminHomePage } from './pages/admin/AdminHomePage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminServicesPage } from './pages/admin/AdminServicesPage'
import { AdminBlogEditorPage } from './pages/admin/AdminBlogEditorPage'
import { AdminBlogPage } from './pages/admin/AdminBlogPage'
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="gallery" element={<AdminGalleryPage />} />
          <Route path="testimonials" element={<AdminTestimonialsPage />} />
          <Route path="blog" element={<AdminBlogPage />} />
          <Route path="blog/new" element={<AdminBlogEditorPage />} />
          <Route path="blog/:id/edit" element={<AdminBlogEditorPage />} />
        </Route>

        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
