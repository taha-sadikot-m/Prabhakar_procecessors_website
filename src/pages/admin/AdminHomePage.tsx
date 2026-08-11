import { useEffect, useState } from 'react'
import {
  adminGetBlogPosts,
  adminGetContactMessages,
  adminGetGallery,
  adminGetJobApplications,
  adminGetServices,
  adminGetTestimonials,
} from '../../lib/cms-api'
import {
  AdminError,
  AdminLoading,
  AdminPageHeader,
  AdminStatCard,
} from './admin-ui'

export function AdminHomePage() {
  const [counts, setCounts] = useState({
    categories: 0,
    services: 0,
    media: 0,
    quotes: 0,
    posts: 0,
    publishedPosts: 0,
    applications: 0,
    messages: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      adminGetServices(),
      adminGetGallery(),
      adminGetTestimonials(),
      adminGetBlogPosts(),
      adminGetJobApplications(),
      adminGetContactMessages(),
    ])
      .then(
        ([
          services,
          gallery,
          testimonials,
          blog,
          careers,
          contact,
        ]) => {
        if (cancelled) return
        const categories = services.categories ?? []
        const posts = blog.posts ?? []
        setCounts({
          categories: categories.length,
          services: categories.reduce(
            (n, c) => n + (c.services?.length ?? 0),
            0,
          ),
          media: gallery.items?.length ?? 0,
          quotes: testimonials.quotes?.length ?? 0,
          posts: posts.length,
          publishedPosts: posts.filter((p) => p.published).length,
          applications: careers.applications?.length ?? 0,
          messages: contact.messages?.length ?? 0,
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
        categories, media, blog posts, or partner quotes.
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      {loading ? (
        <AdminLoading label="Loading overview…" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminStatCard
            label="Services"
            value={counts.services}
            description={`${counts.categories} categories · cards on /services`}
            to="/admin/services"
          />
          <AdminStatCard
            label="Gallery"
            value={counts.media}
            description="Drive media on /gallery"
            to="/admin/gallery"
          />
          <AdminStatCard
            label="Blog"
            value={counts.posts}
            description={`${counts.publishedPosts} published · SEO posts on /blog`}
            to="/admin/blog"
          />
          <AdminStatCard
            label="Testimonials"
            value={counts.quotes}
            description="Partner quotes shown on /testimonials"
            to="/admin/testimonials"
          />
          <AdminStatCard
            label="Careers"
            value={counts.applications}
            description="Job applications from /careers"
            to="/admin/careers"
          />
          <AdminStatCard
            label="Contact"
            value={counts.messages}
            description="Messages from the contact form"
            to="/admin/contact"
          />
        </div>
      )}
    </div>
  )
}
