import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AdminLayout } from './pages/admin/AdminLayout'

const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })),
)
const ServicesPage = lazy(() =>
  import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })),
)
const GalleryPage = lazy(() =>
  import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage })),
)
const CareersPage = lazy(() =>
  import('./pages/CareersPage').then((m) => ({ default: m.CareersPage })),
)
const JournalPage = lazy(() =>
  import('./pages/JournalPage').then((m) => ({ default: m.JournalPage })),
)
const BlogPage = lazy(() =>
  import('./pages/BlogPage').then((m) => ({ default: m.BlogPage })),
)
const BlogPostPage = lazy(() =>
  import('./pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })),
)
const TestimonialsPage = lazy(() =>
  import('./pages/TestimonialsPage').then((m) => ({
    default: m.TestimonialsPage,
  })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)

const AdminLoginPage = lazy(() =>
  import('./pages/admin/AdminLoginPage').then((m) => ({
    default: m.AdminLoginPage,
  })),
)
const AdminHomePage = lazy(() =>
  import('./pages/admin/AdminHomePage').then((m) => ({
    default: m.AdminHomePage,
  })),
)
const AdminServicesPage = lazy(() =>
  import('./pages/admin/AdminServicesPage').then((m) => ({
    default: m.AdminServicesPage,
  })),
)
const AdminGalleryPage = lazy(() =>
  import('./pages/admin/AdminGalleryPage').then((m) => ({
    default: m.AdminGalleryPage,
  })),
)
const AdminTestimonialsPage = lazy(() =>
  import('./pages/admin/AdminTestimonialsPage').then((m) => ({
    default: m.AdminTestimonialsPage,
  })),
)
const AdminBlogPage = lazy(() =>
  import('./pages/admin/AdminBlogPage').then((m) => ({
    default: m.AdminBlogPage,
  })),
)
const AdminBlogEditorPage = lazy(() =>
  import('./pages/admin/AdminBlogEditorPage').then((m) => ({
    default: m.AdminBlogEditorPage,
  })),
)
const AdminCareersPage = lazy(() =>
  import('./pages/admin/AdminCareersPage').then((m) => ({
    default: m.AdminCareersPage,
  })),
)
const AdminContactPage = lazy(() =>
  import('./pages/admin/AdminContactPage').then((m) => ({
    default: m.AdminContactPage,
  })),
)

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-cream font-sans text-sm text-ink-muted">
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
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
            <Route path="careers" element={<AdminCareersPage />} />
            <Route path="contact" element={<AdminContactPage />} />
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
      </Suspense>
    </BrowserRouter>
  )
}
