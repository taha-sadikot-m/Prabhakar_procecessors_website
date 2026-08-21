export type BlogSectionDto = {
  heading: string
  paragraphs: string[]
}

export type BlogCtaTheme = 'accent' | 'outline' | 'light'

export type BlogCtaDto = {
  headline: string
  body: string
  primaryLabel: string
  primaryHref: string
  primaryTheme?: BlogCtaTheme
  secondaryLabel?: string
  secondaryHref?: string
  secondaryTheme?: BlogCtaTheme
}

function asTheme(value: unknown): BlogCtaTheme | undefined {
  if (value === 'accent' || value === 'outline' || value === 'light') {
    return value
  }
  return undefined
}

/** Prefer local WebP when DB still stores a .png path after the asset migration. */
export function preferWebpCover(url: string): string {
  const trimmed = url.trim()
  if (!trimmed.startsWith('/') || !/\.png$/i.test(trimmed)) return trimmed
  return trimmed.replace(/\.png$/i, '.webp')
}

export type BlogPostDto = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  updatedAt?: string
  readMinutes: number
  category: string
  coverImage: string
  coverAlt: string
  seoTitle: string
  seoDescription: string
  keywords: string[]
  sections: BlogSectionDto[]
  cta?: BlogCtaDto
  published: boolean
  sortOrder: number
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function asSections(value: unknown): BlogSectionDto[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const row = item as Record<string, unknown>
      const heading = typeof row.heading === 'string' ? row.heading.trim() : ''
      const paragraphs = asStringArray(row.paragraphs)
        .map((p) => p.trim())
        .filter(Boolean)
      if (!heading || paragraphs.length === 0) return null
      return { heading, paragraphs }
    })
    .filter((s): s is BlogSectionDto => s != null)
}

function asCta(value: unknown): BlogCtaDto | undefined {
  if (!value || typeof value !== 'object') return undefined
  const row = value as Record<string, unknown>
  const headline = typeof row.headline === 'string' ? row.headline.trim() : ''
  const body = typeof row.body === 'string' ? row.body.trim() : ''
  const primaryLabel =
    typeof row.primaryLabel === 'string' ? row.primaryLabel.trim() : ''
  const primaryHref =
    typeof row.primaryHref === 'string' ? row.primaryHref.trim() : ''
  if (!headline || !body || !primaryLabel || !primaryHref) return undefined
  const cta: BlogCtaDto = { headline, body, primaryLabel, primaryHref }
  const primaryTheme = asTheme(row.primaryTheme)
  if (primaryTheme) cta.primaryTheme = primaryTheme
  if (typeof row.secondaryLabel === 'string' && row.secondaryLabel.trim()) {
    cta.secondaryLabel = row.secondaryLabel.trim()
  }
  if (typeof row.secondaryHref === 'string' && row.secondaryHref.trim()) {
    cta.secondaryHref = row.secondaryHref.trim()
  }
  const secondaryTheme = asTheme(row.secondaryTheme)
  if (secondaryTheme) cta.secondaryTheme = secondaryTheme
  return cta
}

function dateOnly(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') return value.slice(0, 10)
  return new Date().toISOString().slice(0, 10)
}

export function mapBlogRow(row: Record<string, unknown>): BlogPostDto {
  const keywords =
    typeof row.keywords === 'string'
      ? asStringArray(JSON.parse(row.keywords))
      : asStringArray(row.keywords)
  const sections =
    typeof row.sections === 'string'
      ? asSections(JSON.parse(row.sections))
      : asSections(row.sections)
  const cta =
    typeof row.cta === 'string'
      ? asCta(JSON.parse(row.cta))
      : asCta(row.cta)

  const updatedAt = row.updated_at
    ? dateOnly(row.updated_at)
    : undefined

  return {
    id: String(row.id ?? ''),
    slug: String(row.slug ?? ''),
    title: String(row.title ?? ''),
    excerpt: String(row.excerpt ?? ''),
    date: dateOnly(row.published_at),
    updatedAt,
    readMinutes: Number(row.read_minutes) || 5,
    category: String(row.category ?? ''),
    coverImage: preferWebpCover(String(row.cover_image ?? '')),
    coverAlt: String(row.cover_alt ?? ''),
    seoTitle: String(row.seo_title ?? ''),
    seoDescription: String(row.seo_description ?? ''),
    keywords,
    sections,
    cta,
    published: Boolean(row.published),
    sortOrder: Number(row.sort_order) || 0,
  }
}

export function toPublicBlogPost(post: BlogPostDto) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    updatedAt: post.updatedAt,
    readMinutes: post.readMinutes,
    category: post.category,
    coverImage: post.coverImage,
    coverAlt: post.coverAlt,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    keywords: post.keywords,
    sections: post.sections,
    cta: post.cta,
  }
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
