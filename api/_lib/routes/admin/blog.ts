import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  mapBlogRow,
  slugifyTitle,
  type BlogCtaDto,
  type BlogCtaTheme,
  type BlogSectionDto,
} from '../../blog'
import { requireAdmin } from '../../auth'
import { getDb } from '../../db'
import { handleOptions, json, newId, readJsonBody } from '../../http'

type BlogBody = {
  id?: string
  slug?: string
  title?: string
  excerpt?: string
  date?: string
  readMinutes?: number
  category?: string
  coverImage?: string
  coverAlt?: string
  seoTitle?: string
  seoDescription?: string
  keywords?: string[]
  sections?: BlogSectionDto[]
  cta?: BlogCtaDto | null
  published?: boolean
  sortOrder?: number
}

function normalizeSections(sections: unknown): BlogSectionDto[] {
  if (!Array.isArray(sections)) return []
  return sections
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const row = item as Record<string, unknown>
      const heading = typeof row.heading === 'string' ? row.heading.trim() : ''
      const paragraphs = Array.isArray(row.paragraphs)
        ? row.paragraphs
            .filter((p): p is string => typeof p === 'string')
            .map((p) => p.trim())
            .filter(Boolean)
        : []
      if (!heading || paragraphs.length === 0) return null
      return { heading, paragraphs }
    })
    .filter((s): s is BlogSectionDto => s != null)
}

function normalizeKeywords(keywords: unknown): string[] {
  if (!Array.isArray(keywords)) return []
  return keywords
    .filter((k): k is string => typeof k === 'string')
    .map((k) => k.trim())
    .filter(Boolean)
}

function asTheme(value: unknown): BlogCtaTheme | undefined {
  if (value === 'accent' || value === 'outline' || value === 'light') {
    return value
  }
  return undefined
}

function normalizeCta(cta: unknown): BlogCtaDto | null {
  if (!cta || typeof cta !== 'object') return null
  const row = cta as Record<string, unknown>
  const headline = typeof row.headline === 'string' ? row.headline.trim() : ''
  const body = typeof row.body === 'string' ? row.body.trim() : ''
  const primaryLabel =
    typeof row.primaryLabel === 'string' ? row.primaryLabel.trim() : ''
  const primaryHref =
    typeof row.primaryHref === 'string' ? row.primaryHref.trim() : ''
  if (!headline || !body || !primaryLabel || !primaryHref) return null
  const out: BlogCtaDto = { headline, body, primaryLabel, primaryHref }
  const primaryTheme = asTheme(row.primaryTheme)
  if (primaryTheme) out.primaryTheme = primaryTheme
  if (typeof row.secondaryLabel === 'string' && row.secondaryLabel.trim()) {
    out.secondaryLabel = row.secondaryLabel.trim()
  }
  if (typeof row.secondaryHref === 'string' && row.secondaryHref.trim()) {
    out.secondaryHref = row.secondaryHref.trim()
  }
  const secondaryTheme = asTheme(row.secondaryTheme)
  if (secondaryTheme) out.secondaryTheme = secondaryTheme
  return out
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return
  if (!(await requireAdmin(req))) {
    return json(res, 401, { error: 'Unauthorized' })
  }

  const sql = getDb()

  try {
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT *
        FROM blog_posts
        ORDER BY published_at DESC, sort_order ASC, title ASC
      `
      return json(res, 200, {
        posts: rows.map((row) => mapBlogRow(row as Record<string, unknown>)),
      })
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = readJsonBody<BlogBody>(req)
      const title = (body.title ?? '').trim()
      const excerpt = (body.excerpt ?? '').trim()
      const category = (body.category ?? '').trim()
      const coverImage = (body.coverImage ?? '').trim()
      const coverAlt = (body.coverAlt ?? '').trim()
      const seoTitle = (body.seoTitle ?? '').trim()
      const seoDescription = (body.seoDescription ?? '').trim()
      const date = (body.date ?? '').trim().slice(0, 10)
      const sections = normalizeSections(body.sections)
      const keywords = normalizeKeywords(body.keywords)
      const cta = normalizeCta(body.cta)
      let slug = (body.slug ?? '').trim().toLowerCase()

      if (!title) return json(res, 400, { error: 'title required' })
      if (!slug) slug = slugifyTitle(title)
      if (!slug) return json(res, 400, { error: 'slug required' })
      if (!date) return json(res, 400, { error: 'date required' })
      if (!seoTitle || !seoDescription) {
        return json(res, 400, { error: 'seoTitle and seoDescription required' })
      }
      if (sections.length === 0) {
        return json(res, 400, { error: 'at least one section required' })
      }

      const readMinutes = Number(body.readMinutes) || 5
      const published = body.published !== false
      const sortOrder = Number(body.sortOrder) || 0
      const keywordsJson = JSON.stringify(keywords)
      const sectionsJson = JSON.stringify(sections)
      const ctaJson = cta ? JSON.stringify(cta) : null

      if (req.method === 'POST') {
        const id = (body.id ?? newId('blog')).trim()
        try {
          await sql`
            INSERT INTO blog_posts (
              id, slug, title, excerpt, published_at, read_minutes, category,
              cover_image, cover_alt, seo_title, seo_description, keywords,
              sections, cta, published, sort_order
            )
            VALUES (
              ${id},
              ${slug},
              ${title},
              ${excerpt},
              ${date}::date,
              ${readMinutes},
              ${category},
              ${coverImage},
              ${coverAlt},
              ${seoTitle},
              ${seoDescription},
              ${keywordsJson}::jsonb,
              ${sectionsJson}::jsonb,
              ${ctaJson}::jsonb,
              ${published},
              ${sortOrder}
            )
          `
        } catch (err) {
          const message = err instanceof Error ? err.message : ''
          if (message.includes('blog_posts_slug_key') || message.includes('unique')) {
            return json(res, 409, { error: 'slug already exists' })
          }
          throw err
        }
        return json(res, 201, { id })
      }

      const id = (body.id ?? '').trim()
      if (!id) return json(res, 400, { error: 'id required' })
      try {
        await sql`
          UPDATE blog_posts
          SET
            slug = ${slug},
            title = ${title},
            excerpt = ${excerpt},
            published_at = ${date}::date,
            read_minutes = ${readMinutes},
            category = ${category},
            cover_image = ${coverImage},
            cover_alt = ${coverAlt},
            seo_title = ${seoTitle},
            seo_description = ${seoDescription},
            keywords = ${keywordsJson}::jsonb,
            sections = ${sectionsJson}::jsonb,
            cta = ${ctaJson}::jsonb,
            published = ${published},
            sort_order = ${sortOrder},
            updated_at = NOW()
          WHERE id = ${id}
        `
      } catch (err) {
        const message = err instanceof Error ? err.message : ''
        if (message.includes('blog_posts_slug_key') || message.includes('unique')) {
          return json(res, 409, { error: 'slug already exists' })
        }
        throw err
      }
      return json(res, 200, { ok: true })
    }

    if (req.method === 'DELETE') {
      const id =
        typeof req.query.id === 'string'
          ? req.query.id
          : readJsonBody<{ id?: string }>(req).id
      if (!id) return json(res, 400, { error: 'id required' })
      await sql`DELETE FROM blog_posts WHERE id = ${id}`
      return json(res, 200, { ok: true })
    }

    return json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Blog admin error'
    return json(res, 500, { error: message })
  }
}
