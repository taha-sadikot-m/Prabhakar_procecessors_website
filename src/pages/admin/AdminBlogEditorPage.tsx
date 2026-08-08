import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SectionCta } from '../../components/SectionCta'
import {
  adminGetBlogPosts,
  adminSaveBlogPost,
  type AdminBlogPostDto,
  type BlogCtaTheme,
  type BlogSectionDto,
} from '../../lib/cms-api'
import { resolveDisplayImageUrl } from '../../lib/media-url'
import {
  AdminActions,
  AdminButton,
  AdminError,
  AdminField,
  AdminLoading,
  AdminPageHeader,
  AdminSelect,
  AdminTextArea,
} from './admin-ui'
import { AdminMediaPreview } from './AdminMediaPreview'

const CTA_DESTINATIONS = [
  { value: '/contact', label: 'Contact' },
  { value: '/services', label: 'Services' },
  { value: '/about', label: 'About' },
  { value: '/gallery', label: 'Gallery' },
  { value: '/careers', label: 'Careers' },
  { value: '/blog', label: 'Blog' },
  { value: '__custom__', label: 'Custom URL' },
] as const

const CTA_THEMES: Array<{ value: BlogCtaTheme; label: string }> = [
  { value: 'accent', label: 'Filled mahogany' },
  { value: 'outline', label: 'Outline' },
  { value: 'light', label: 'Cream' },
]

const PRESET_HREFS: ReadonlySet<string> = new Set(
  CTA_DESTINATIONS.filter((d) => d.value !== '__custom__').map((d) => d.value),
)

function destinationKey(href: string): string {
  return PRESET_HREFS.has(href) ? href : '__custom__'
}

function asTheme(value: string | undefined, fallback: BlogCtaTheme): BlogCtaTheme {
  if (value === 'accent' || value === 'outline' || value === 'light') return value
  return fallback
}

type SectionForm = {
  heading: string
  paragraphsText: string
}

type FormState = {
  slug: string
  title: string
  excerpt: string
  date: string
  readMinutes: number
  category: string
  coverImage: string
  coverAlt: string
  seoTitle: string
  seoDescription: string
  keywordsText: string
  sections: SectionForm[]
  ctaHeadline: string
  ctaBody: string
  ctaPrimaryLabel: string
  ctaPrimaryHref: string
  ctaPrimaryTheme: BlogCtaTheme
  ctaSecondaryLabel: string
  ctaSecondaryHref: string
  ctaSecondaryTheme: BlogCtaTheme
  published: boolean
  sortOrder: number
}

const emptySection = (): SectionForm => ({ heading: '', paragraphsText: '' })

const emptyForm = (): FormState => ({
  slug: '',
  title: '',
  excerpt: '',
  date: new Date().toISOString().slice(0, 10),
  readMinutes: 5,
  category: '',
  coverImage: '',
  coverAlt: '',
  seoTitle: '',
  seoDescription: '',
  keywordsText: '',
  sections: [emptySection()],
  ctaHeadline: '',
  ctaBody: '',
  ctaPrimaryLabel: 'Discuss Your Requirements',
  ctaPrimaryHref: '/contact',
  ctaPrimaryTheme: 'accent',
  ctaSecondaryLabel: '',
  ctaSecondaryHref: '/services',
  ctaSecondaryTheme: 'outline',
  published: true,
  sortOrder: 0,
})

function postToForm(post: AdminBlogPostDto): FormState {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date.slice(0, 10),
    readMinutes: post.readMinutes,
    category: post.category,
    coverImage: post.coverImage,
    coverAlt: post.coverAlt,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    keywordsText: (post.keywords ?? []).join(', '),
    sections:
      post.sections.length > 0
        ? post.sections.map((s) => ({
            heading: s.heading,
            paragraphsText: s.paragraphs.join('\n\n'),
          }))
        : [emptySection()],
    ctaHeadline: post.cta?.headline ?? '',
    ctaBody: post.cta?.body ?? '',
    ctaPrimaryLabel: post.cta?.primaryLabel ?? 'Discuss Your Requirements',
    ctaPrimaryHref: post.cta?.primaryHref ?? '/contact',
    ctaPrimaryTheme: asTheme(post.cta?.primaryTheme, 'accent'),
    ctaSecondaryLabel: post.cta?.secondaryLabel ?? '',
    ctaSecondaryHref: post.cta?.secondaryHref ?? '/services',
    ctaSecondaryTheme: asTheme(post.cta?.secondaryTheme, 'outline'),
    published: post.published,
    sortOrder: post.sortOrder,
  }
}

function formToPayload(form: FormState) {
  const sections: BlogSectionDto[] = form.sections
    .map((s) => ({
      heading: s.heading.trim(),
      paragraphs: s.paragraphsText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
    }))
    .filter((s) => s.heading && s.paragraphs.length > 0)

  const keywords = form.keywordsText
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)

  const cta =
    form.ctaHeadline.trim() &&
    form.ctaBody.trim() &&
    form.ctaPrimaryLabel.trim() &&
    form.ctaPrimaryHref.trim()
      ? {
          headline: form.ctaHeadline.trim(),
          body: form.ctaBody.trim(),
          primaryLabel: form.ctaPrimaryLabel.trim(),
          primaryHref: form.ctaPrimaryHref.trim(),
          primaryTheme: form.ctaPrimaryTheme,
          ...(form.ctaSecondaryLabel.trim() && form.ctaSecondaryHref.trim()
            ? {
                secondaryLabel: form.ctaSecondaryLabel.trim(),
                secondaryHref: form.ctaSecondaryHref.trim(),
                secondaryTheme: form.ctaSecondaryTheme,
              }
            : {}),
        }
      : null

  return {
    slug: form.slug.trim().toLowerCase(),
    title: form.title.trim(),
    excerpt: form.excerpt.trim(),
    date: form.date,
    readMinutes: form.readMinutes,
    category: form.category.trim(),
    coverImage: form.coverImage.trim(),
    coverAlt: form.coverAlt.trim(),
    seoTitle: form.seoTitle.trim(),
    seoDescription: form.seoDescription.trim(),
    keywords,
    sections,
    cta,
    published: form.published,
    sortOrder: form.sortOrder,
  }
}

function formatPreviewDate(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 font-sans text-[11px] font-semibold tracking-[0.16em] text-mahogany uppercase">
      {children}
    </h2>
  )
}

function BlogArticlePreview({ form }: { form: FormState }) {
  const payload = formToPayload(form)
  const coverSrc = form.coverImage.trim()
    ? resolveDisplayImageUrl(form.coverImage.trim())
    : ''

  return (
    <article className="overflow-hidden rounded-xl border border-ink/10 bg-cream shadow-[0_8px_28px_rgba(45,27,14,0.06)]">
      {coverSrc ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-cream-dark">
          <img
            src={coverSrc}
            alt={form.coverAlt || form.title || 'Cover'}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center bg-cream-dark font-sans text-sm text-ink-muted">
          No cover image
        </div>
      )}

      <div className="px-5 py-8 md:px-8 md:py-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[10px] font-medium tracking-[0.16em] text-ink/45 uppercase">
          {form.date && <time dateTime={form.date}>{formatPreviewDate(form.date)}</time>}
          {form.category.trim() && (
            <>
              <span aria-hidden="true" className="text-mahogany/40">
                ·
              </span>
              <span className="text-mahogany">{form.category.trim()}</span>
            </>
          )}
          <span aria-hidden="true" className="text-mahogany/40">
            ·
          </span>
          <span>{form.readMinutes || 5} min read</span>
          {!form.published && (
            <>
              <span aria-hidden="true" className="text-mahogany/40">
                ·
              </span>
              <span className="text-crimson">Draft</span>
            </>
          )}
        </div>

        <h1 className="mt-4 font-serif text-3xl leading-tight font-medium tracking-tight text-ink md:text-4xl">
          {form.title.trim() || 'Untitled post'}
        </h1>
        {form.excerpt.trim() && (
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-ink-muted">
            {form.excerpt.trim()}
          </p>
        )}

        <div className="mt-10 space-y-10 border-t border-mahogany/15 pt-10">
          {payload.sections.length === 0 ? (
            <p className="font-sans text-sm text-ink-muted">
              Add at least one section with a heading and paragraphs to preview body copy.
            </p>
          ) : (
            payload.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-xl font-medium tracking-tight text-ink md:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="font-sans text-[15px] leading-[1.8] text-ink/90"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        {payload.cta && (
          <aside className="mt-12 rounded-xl border border-mahogany/15 bg-cream-light/80 px-5 py-8 text-center md:px-8">
            <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-mahogany uppercase">
              Next Step
            </p>
            <h2 className="mt-3 font-serif text-2xl font-medium text-ink">
              {payload.cta.headline}
            </h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-ink-muted">
              {payload.cta.body}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <SectionCta
                label={payload.cta.primaryLabel}
                to={payload.cta.primaryHref}
                variant={payload.cta.primaryTheme ?? 'accent'}
              />
              {payload.cta.secondaryLabel && payload.cta.secondaryHref && (
                <SectionCta
                  label={payload.cta.secondaryLabel}
                  to={payload.cta.secondaryHref}
                  variant={payload.cta.secondaryTheme ?? 'outline'}
                />
              )}
            </div>
          </aside>
        )}
      </div>
    </article>
  )
}

export function AdminBlogEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [showPreview, setShowPreview] = useState(false)

  const loadPost = useCallback(async () => {
    if (!id) {
      setForm(emptyForm())
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await adminGetBlogPosts()
      const post = data.posts.find((p) => p.id === id)
      if (!post) {
        setError('Post not found')
        return
      }
      setForm(postToForm(post))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void loadPost()
  }, [loadPost])

  const payload = useMemo(() => formToPayload(form), [form])
  const canSave =
    Boolean(payload.title) &&
    Boolean(payload.date) &&
    Boolean(payload.seoTitle) &&
    Boolean(payload.seoDescription) &&
    payload.sections.length > 0

  async function save() {
    setBusy(true)
    setError(null)
    try {
      if (isEdit && id) {
        await adminSaveBlogPost('PUT', { id, ...payload })
      } else {
        await adminSaveBlogPost('POST', payload)
      }
      navigate('/admin/blog')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div>
        <AdminPageHeader title={isEdit ? 'Edit post' : 'Add post'}>
          Fetching post details.
        </AdminPageHeader>
        <AdminLoading label="Loading post…" />
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title={isEdit ? 'Edit post' : 'Add post'}
        meta={showPreview ? 'Preview' : isEdit ? 'Editor' : 'New'}
        busy={busy}
        actions={
          <AdminActions>
            <AdminButton
              variant="secondary"
              onClick={() => setShowPreview((v) => !v)}
            >
              {showPreview ? 'Back to editor' : 'Show preview'}
            </AdminButton>
            {!showPreview && (
              <AdminButton
                variant="primary"
                disabled={busy || !canSave}
                onClick={() => void save()}
              >
                {isEdit ? 'Save changes' : 'Save post'}
              </AdminButton>
            )}
          </AdminActions>
        }
      >
        <Link
          to="/admin/blog"
          className="font-sans text-sm text-ink-muted transition-colors hover:text-mahogany"
        >
          ← Back to blog list
        </Link>
      </AdminPageHeader>

      {error && <AdminError>{error}</AdminError>}

      {showPreview ? (
        <BlogArticlePreview form={form} />
      ) : (
        <div className="space-y-8">
          <section className="rounded-xl border border-ink/10 bg-cream px-4 py-5 md:px-6">
            <SectionLabel>Basics</SectionLabel>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField
                label="Title"
                value={form.title}
                onChange={(v) => setForm((s) => ({ ...s, title: v }))}
                className="md:col-span-2"
                required
              />
              <AdminField
                label="Slug"
                value={form.slug}
                onChange={(v) => setForm((s) => ({ ...s, slug: v }))}
                mono
                placeholder="auto from title if empty"
              />
              <AdminField
                label="Category"
                value={form.category}
                onChange={(v) => setForm((s) => ({ ...s, category: v }))}
                placeholder="Process, Quality…"
              />
              <AdminField
                label="Publish date"
                type="date"
                value={form.date}
                onChange={(v) => setForm((s) => ({ ...s, date: v }))}
              />
              <AdminField
                label="Read minutes"
                type="number"
                value={String(form.readMinutes)}
                onChange={(v) =>
                  setForm((s) => ({ ...s, readMinutes: Number(v) || 5 }))
                }
              />
              <AdminTextArea
                label="Excerpt"
                value={form.excerpt}
                onChange={(v) => setForm((s) => ({ ...s, excerpt: v }))}
                className="md:col-span-2"
              />
            </div>
          </section>

          <section className="rounded-xl border border-ink/10 bg-cream px-4 py-5 md:px-6">
            <SectionLabel>Cover</SectionLabel>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1 space-y-4">
                <AdminField
                  label="Cover image URL"
                  value={form.coverImage}
                  onChange={(v) => setForm((s) => ({ ...s, coverImage: v }))}
                  mono
                  placeholder="Site path or full https URL"
                />
                <p className="font-sans text-xs text-ink-muted">
                  Use a site path (`/about_section/…`) or any absolute image /
                  Drive URL.
                </p>
                <AdminField
                  label="Cover alt text"
                  value={form.coverAlt}
                  onChange={(v) => setForm((s) => ({ ...s, coverAlt: v }))}
                />
              </div>
              <AdminMediaPreview
                src={form.coverImage}
                alt={form.coverAlt}
                className="w-full max-w-[14rem] sm:w-40"
              />
            </div>
          </section>

          <section className="rounded-xl border border-ink/10 bg-cream px-4 py-5 md:px-6">
            <SectionLabel>SEO</SectionLabel>
            <div className="grid gap-4">
              <AdminField
                label="SEO title"
                value={form.seoTitle}
                onChange={(v) => setForm((s) => ({ ...s, seoTitle: v }))}
                required
              />
              <AdminTextArea
                label="SEO description"
                value={form.seoDescription}
                onChange={(v) => setForm((s) => ({ ...s, seoDescription: v }))}
              />
              <AdminField
                label="Keywords (comma-separated)"
                value={form.keywordsText}
                onChange={(v) => setForm((s) => ({ ...s, keywordsText: v }))}
              />
            </div>
          </section>

          <section className="rounded-xl border border-ink/10 bg-cream px-4 py-5 md:px-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <SectionLabel>Sections</SectionLabel>
              <AdminButton
                variant="secondary"
                onClick={() =>
                  setForm((s) => ({
                    ...s,
                    sections: [...s.sections, emptySection()],
                  }))
                }
              >
                Add section
              </AdminButton>
            </div>
            <div className="space-y-4">
              {form.sections.map((section, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-ink/10 bg-cream-light/60 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="font-sans text-[11px] font-semibold tracking-[0.12em] text-mahogany uppercase">
                      Section {index + 1}
                    </p>
                    {form.sections.length > 1 && (
                      <AdminButton
                        variant="ghost"
                        onClick={() =>
                          setForm((s) => ({
                            ...s,
                            sections: s.sections.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        Remove
                      </AdminButton>
                    )}
                  </div>
                  <AdminField
                    label="Heading"
                    value={section.heading}
                    onChange={(v) =>
                      setForm((s) => ({
                        ...s,
                        sections: s.sections.map((sec, i) =>
                          i === index ? { ...sec, heading: v } : sec,
                        ),
                      }))
                    }
                  />
                  <AdminTextArea
                    label="Paragraphs (blank line between)"
                    value={section.paragraphsText}
                    onChange={(v) =>
                      setForm((s) => ({
                        ...s,
                        sections: s.sections.map((sec, i) =>
                          i === index ? { ...sec, paragraphsText: v } : sec,
                        ),
                      }))
                    }
                    className="mt-3"
                    rows={6}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-ink/10 bg-cream px-4 py-5 md:px-6">
            <SectionLabel>Call to action (optional)</SectionLabel>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField
                label="CTA headline"
                value={form.ctaHeadline}
                onChange={(v) => setForm((s) => ({ ...s, ctaHeadline: v }))}
                className="md:col-span-2"
              />
              <AdminTextArea
                label="CTA body"
                value={form.ctaBody}
                onChange={(v) => setForm((s) => ({ ...s, ctaBody: v }))}
                className="md:col-span-2"
              />

              <div className="md:col-span-2">
                <p className="mb-3 font-sans text-[11px] font-semibold tracking-[0.12em] text-mahogany uppercase">
                  Primary button
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField
                    label="Label"
                    value={form.ctaPrimaryLabel}
                    onChange={(v) =>
                      setForm((s) => ({ ...s, ctaPrimaryLabel: v }))
                    }
                  />
                  <AdminSelect
                    label="Destination"
                    value={destinationKey(form.ctaPrimaryHref)}
                    onChange={(v) =>
                      setForm((s) => ({
                        ...s,
                        ctaPrimaryHref:
                          v === '__custom__'
                            ? PRESET_HREFS.has(s.ctaPrimaryHref)
                              ? ''
                              : s.ctaPrimaryHref
                            : v,
                      }))
                    }
                    options={[...CTA_DESTINATIONS]}
                  />
                  {destinationKey(form.ctaPrimaryHref) === '__custom__' && (
                    <AdminField
                      label="Custom URL"
                      value={form.ctaPrimaryHref}
                      onChange={(v) =>
                        setForm((s) => ({ ...s, ctaPrimaryHref: v }))
                      }
                      mono
                      className="md:col-span-2"
                      placeholder="/contact or https://…"
                    />
                  )}
                  <AdminSelect
                    label="Theme"
                    value={form.ctaPrimaryTheme}
                    onChange={(v) =>
                      setForm((s) => ({
                        ...s,
                        ctaPrimaryTheme: asTheme(v, 'accent'),
                      }))
                    }
                    options={CTA_THEMES}
                  />
                </div>
              </div>

              <div className="md:col-span-2 border-t border-ink/10 pt-4">
                <p className="mb-3 font-sans text-[11px] font-semibold tracking-[0.12em] text-mahogany uppercase">
                  Secondary button (optional)
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminField
                    label="Label"
                    value={form.ctaSecondaryLabel}
                    onChange={(v) =>
                      setForm((s) => ({ ...s, ctaSecondaryLabel: v }))
                    }
                    placeholder="Leave empty to hide"
                  />
                  <AdminSelect
                    label="Destination"
                    value={destinationKey(form.ctaSecondaryHref || '/services')}
                    onChange={(v) =>
                      setForm((s) => ({
                        ...s,
                        ctaSecondaryHref:
                          v === '__custom__'
                            ? PRESET_HREFS.has(s.ctaSecondaryHref)
                              ? ''
                              : s.ctaSecondaryHref
                            : v,
                      }))
                    }
                    options={[...CTA_DESTINATIONS]}
                  />
                  {destinationKey(form.ctaSecondaryHref || '/services') ===
                    '__custom__' && (
                    <AdminField
                      label="Custom URL"
                      value={form.ctaSecondaryHref}
                      onChange={(v) =>
                        setForm((s) => ({ ...s, ctaSecondaryHref: v }))
                      }
                      mono
                      className="md:col-span-2"
                      placeholder="/services or https://…"
                    />
                  )}
                  <AdminSelect
                    label="Theme"
                    value={form.ctaSecondaryTheme}
                    onChange={(v) =>
                      setForm((s) => ({
                        ...s,
                        ctaSecondaryTheme: asTheme(v, 'outline'),
                      }))
                    }
                    options={CTA_THEMES}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-ink/10 bg-cream px-4 py-5 md:px-6">
            <SectionLabel>Publish</SectionLabel>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField
                label="Sort order"
                type="number"
                value={String(form.sortOrder)}
                onChange={(v) =>
                  setForm((s) => ({ ...s, sortOrder: Number(v) || 0 }))
                }
              />
              <label className="flex items-center gap-2 self-end pb-2 font-sans text-sm text-ink">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, published: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-ink/20 text-mahogany focus:ring-mahogany"
                />
                Published (visible on /blog)
              </label>
            </div>
          </section>

          <AdminActions>
            <AdminButton
              disabled={busy || !canSave}
              onClick={() => void save()}
            >
              {isEdit ? 'Save changes' : 'Save post'}
            </AdminButton>
            <AdminButton
              variant="ghost"
              onClick={() => navigate('/admin/blog')}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="secondary"
              onClick={() => setShowPreview(true)}
            >
              Show preview
            </AdminButton>
          </AdminActions>
        </div>
      )}
    </div>
  )
}
