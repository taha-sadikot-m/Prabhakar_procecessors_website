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

type Counts = {
  categories: number
  services: number
  media: number
  quotes: number
  posts: number
  publishedPosts: number
  applications: number
  messages: number
}

const emptyCounts: Counts = {
  categories: 0,
  services: 0,
  media: 0,
  quotes: 0,
  posts: 0,
  publishedPosts: 0,
  applications: 0,
  messages: 0,
}

export function AdminHomePage() {
  const [counts, setCounts] = useState<Counts>(emptyCounts)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const labels = [
        'Services',
        'Gallery',
        'Testimonials',
        'Blog',
        'Careers',
        'Contact',
      ] as const
      const results = await Promise.allSettled([
        adminGetServices(),
        adminGetGallery(),
        adminGetTestimonials(),
        adminGetBlogPosts(),
        adminGetJobApplications(),
        adminGetContactMessages(),
      ])

      if (cancelled) return

      const next = { ...emptyCounts }
      const failures: string[] = []

      results.forEach((result, index) => {
        const label = labels[index]
        if (result.status === 'rejected') {
          const msg =
            result.reason instanceof Error
              ? result.reason.message
              : 'Request failed'
          failures.push(`${label}: ${msg}`)
          return
        }

        const value = result.value
        switch (label) {
          case 'Services': {
            const categories = value.categories ?? []
            next.categories = categories.length
            next.services = categories.reduce(
              (n, c) => n + (c.services?.length ?? 0),
              0,
            )
            break
          }
          case 'Gallery':
            next.media = value.items?.length ?? 0
            break
          case 'Testimonials':
            next.quotes = value.quotes?.length ?? 0
            break
          case 'Blog': {
            const posts = value.posts ?? []
            next.posts = posts.length
            next.publishedPosts = posts.filter((p) => p.published).length
            break
          }
          case 'Careers':
            next.applications = value.applications?.length ?? 0
            break
          case 'Contact':
            next.messages = value.messages?.length ?? 0
            break
        }
      })

      setCounts(next)
      setError(failures.length > 0 ? failures.join(' · ') : null)
      setLoading(false)
    }

    void load()
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
