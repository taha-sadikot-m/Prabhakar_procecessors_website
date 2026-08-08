import { useEffect, useState } from 'react'
import {
  adminGetGallery,
  adminGetServices,
  adminGetTestimonials,
} from '../../lib/cms-api'
import { AdminError, AdminPageHeader, AdminStatCard } from './admin-ui'

export function AdminHomePage() {
  const [counts, setCounts] = useState({
    categories: 0,
    services: 0,
    sections: 0,
    media: 0,
    quotes: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      adminGetServices(),
      adminGetGallery(),
      adminGetTestimonials(),
    ])
      .then(([services, gallery, testimonials]) => {
        if (cancelled) return
        const categories = services.categories ?? []
        const sections = gallery.sections ?? []
        setCounts({
          categories: categories.length,
          services: categories.reduce(
            (n, c) => n + (c.services?.length ?? 0),
            0,
          ),
          sections: sections.length,
          media: sections.reduce((n, s) => n + (s.items?.length ?? 0), 0),
          quotes: testimonials.quotes?.length ?? 0,
        })
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load overview')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <AdminPageHeader title="Overview">
        Edit the public site content. Choose a module below to manage
        categories, media, or partner quotes.
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminStatCard
          label="Services"
          value={loading ? '—' : counts.services}
          description={
            loading
              ? 'Loading…'
              : `${counts.categories} categories · cards on /services`
          }
          to="/admin/services"
        />
        <AdminStatCard
          label="Gallery"
          value={loading ? '—' : counts.media}
          description={
            loading
              ? 'Loading…'
              : `${counts.sections} sections · Drive media on /gallery`
          }
          to="/admin/gallery"
        />
        <AdminStatCard
          label="Testimonials"
          value={loading ? '—' : counts.quotes}
          description="Partner quotes shown on /testimonials"
          to="/admin/testimonials"
        />
      </div>
    </div>
  )
}
