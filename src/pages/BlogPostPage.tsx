import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { blogPage, company } from '../data/content'
import {
  blogPosts,
  getAdjacentPosts,
  getPostBySlug,
  sortBlogPosts,
  type BlogPost,
  type BlogPostCta,
} from '../data/blogPosts'
import { FadeIn } from '../components/motion/FadeIn'
import { SectionCta } from '../components/SectionCta'
import { SeoHead, SITE_URL } from '../components/SeoHead'
import { fetchPublicBlogPosts } from '../lib/cms-api'

function absoluteCover(path: string) {
  if (path.startsWith('http')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

const MAHOGANY = '#674438'
const HEADING = '#20222D'

const DEFAULT_CTA: BlogPostCta = {
  headline: 'Ready To Specify Your Next Run?',
  body: 'Share your fabric, shade, and volume, we will map the right process.',
  primaryLabel: 'Discuss Your Requirements',
  primaryHref: '/contact',
  secondaryLabel: 'View Services',
  secondaryHref: '/services',
}

function formatPostDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function Breadcrumbs({ post }: { post: BlogPost }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="font-sans text-[10px] font-medium tracking-[0.14em] text-ink/45 uppercase"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="transition-colors hover:text-mahogany">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="text-mahogany/35">
          /
        </li>
        <li>
          <Link to="/blog" className="transition-colors hover:text-mahogany">
            Blog
          </Link>
        </li>
        <li aria-hidden="true" className="text-mahogany/35">
          /
        </li>
        <li className="max-w-[16rem] truncate text-ink/60 md:max-w-md">
          <span aria-current="page">{post.title}</span>
        </li>
      </ol>
    </nav>
  )
}

function Cover({ post }: { post: BlogPost }) {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const imgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : ['0%', '12%'],
  )

  return (
    <section
      ref={sectionRef}
      className="relative h-[42svh] min-h-[280px] overflow-hidden md:h-[52svh]"
    >
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <img
          src={post.coverImage}
          alt={post.coverAlt}
          className="h-full w-full scale-105 object-cover"
          fetchPriority="high"
          draggable={false}
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-cream via-cream/20 to-transparent"
        aria-hidden="true"
      />
    </section>
  )
}

function MidCtaBand({ cta }: { cta: BlogPostCta }) {
  return (
    <aside
      className="relative my-16 overflow-hidden md:my-20"
      aria-label="Call to action"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(103,68,56,0.09) 0%, rgba(250,240,230,0.95) 45%, rgba(103,68,56,0.06) 100%)',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl px-5 py-12 text-center md:px-8 md:py-14">
        <p
          className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
          style={{ color: MAHOGANY }}
        >
          Next Step
        </p>
        <h2
          className="mt-4 font-serif text-2xl leading-snug font-medium tracking-tight md:text-3xl"
          style={{ color: HEADING }}
        >
          {cta.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-ink-muted">
          {cta.body}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          <SectionCta
            label={cta.primaryLabel}
            to={cta.primaryHref}
            variant={cta.primaryTheme ?? 'accent'}
          />
          {cta.secondaryLabel && cta.secondaryHref && (
            <SectionCta
              label={cta.secondaryLabel}
              to={cta.secondaryHref}
              variant={cta.secondaryTheme ?? 'outline'}
            />
          )}
        </div>
      </div>
    </aside>
  )
}

function ArticleClosing() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [1, 1.06],
  )

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[48svh] items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={{ scale: bgScale }}
        aria-hidden="true"
      >
        <img
          src={blogPage.closing.texture}
          alt=""
          className="h-full w-full object-cover opacity-30"
          draggable={false}
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(250, 240, 230, 0.82)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 text-center md:px-8">
        <FadeIn>
          <h2
            className="font-serif text-3xl leading-[1.12] font-light tracking-tight italic md:text-4xl"
            style={{ color: HEADING }}
          >
            {blogPage.closing.headline[0]}
            <br />
            {blogPage.closing.headline[1]}
          </h2>
          <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {blogPage.closing.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <SectionCta
              label={blogPage.closing.primaryCta}
              to={blogPage.closing.primaryHref}
            />
            <SectionCta
              label={blogPage.closing.secondaryCta}
              to={blogPage.closing.secondaryHref}
              variant="outline"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [posts, setPosts] = useState<BlogPost[]>(() => blogPosts)
  const [post, setPost] = useState<BlogPost | undefined>(() =>
    slug ? getPostBySlug(slug) : undefined,
  )
  const [ready, setReady] = useState(() => Boolean(slug && getPostBySlug(slug)))

  useEffect(() => {
    let cancelled = false
    const fallback = slug ? getPostBySlug(slug) : undefined
    setReady(Boolean(fallback))
    setPost(fallback)
    fetchPublicBlogPosts()
      .then((data) => {
        if (cancelled) return
        if (data.posts?.length) {
          const sorted = sortBlogPosts(data.posts)
          setPosts(sorted)
          setPost(sorted.find((p) => p.slug === slug))
        }
      })
      .catch(() => {
        /* keep static fallback */
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (!ready) {
    return <main className="min-h-[40svh] bg-cream" aria-busy="true" />
  }

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const { prev, next } = getAdjacentPosts(post.slug, posts)
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3)
  const cta = post.cta ?? DEFAULT_CTA
  const midIndex = Math.max(1, Math.floor(post.sections.length / 2))

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription,
    image: [absoluteCover(post.coverImage)],
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: {
      '@type': 'Organization',
      name: company.name,
    },
    publisher: {
      '@type': 'Organization',
      name: company.name,
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    keywords: post.keywords.join(', '),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  }

  return (
    <main className="bg-cream">
      <SeoHead
        title={post.seoTitle}
        description={post.seoDescription}
        path={`/blog/${post.slug}`}
        image={post.coverImage}
        imageAlt={post.coverAlt}
        type="article"
        publishedTime={post.date}
        modifiedTime={post.updatedAt ?? post.date}
        keywords={post.keywords}
        jsonLd={[articleLd, breadcrumbLd]}
      />

      <div className="bg-cream pt-24">
        <div className="mx-auto max-w-3xl px-5 pb-6 md:px-8 lg:px-10">
          <FadeIn>
            <Breadcrumbs post={post} />
          </FadeIn>
        </div>
      </div>

      <Cover post={post} />

      <article className="mx-auto max-w-3xl px-5 pb-8 md:px-8 lg:px-10">
        <FadeIn>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-[10px] font-medium tracking-[0.16em] text-ink/45 uppercase">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true" className="text-mahogany/40">
              ·
            </span>
            <span style={{ color: MAHOGANY }}>{post.category}</span>
            <span aria-hidden="true" className="text-mahogany/40">
              ·
            </span>
            <span>{post.readMinutes} min read</span>
          </div>

          <h1 className="mt-5 font-serif text-[2.25rem] leading-[1.12] font-medium tracking-tight text-ink md:text-4xl lg:text-[2.85rem]">
            {post.title}
          </h1>
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ink-muted md:text-lg">
            {post.excerpt}
          </p>
        </FadeIn>

        <div className="mt-12 border-t border-mahogany/15 pt-12">
          {post.sections.map((section, i) => (
            <div key={section.heading}>
              {i === midIndex && <MidCtaBand cta={cta} />}
              <FadeIn delay={Math.min(i * 0.04, 0.16)}>
                <section className={i > 0 ? 'mt-12' : ''}>
                  <h2
                    className="font-serif text-xl leading-snug font-medium tracking-tight text-ink md:text-2xl"
                    style={{ color: HEADING }}
                  >
                    {section.heading}
                  </h2>
                  <div className="mt-5 space-y-5">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 48)}
                        className="font-sans text-[15px] leading-[1.8] text-ink/90 md:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              </FadeIn>
            </div>
          ))}
        </div>

        {(prev || next) && (
          <nav
            className="mt-16 flex flex-col gap-6 border-t border-mahogany/15 pt-10 sm:flex-row sm:justify-between"
            aria-label="Adjacent articles"
          >
            {prev ? (
              <Link
                to={`/blog/${prev.slug}`}
                className="group max-w-xs text-left"
              >
                <span className="font-sans text-[10px] font-medium tracking-[0.16em] text-ink/40 uppercase">
                  Earlier
                </span>
                <span className="mt-2 block font-serif text-lg leading-snug text-ink transition-colors group-hover:text-mahogany">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to={`/blog/${next.slug}`}
                className="group max-w-xs text-left sm:text-right sm:ml-auto"
              >
                <span className="font-sans text-[10px] font-medium tracking-[0.16em] text-ink/40 uppercase">
                  Newer
                </span>
                <span className="mt-2 block font-serif text-lg leading-snug text-ink transition-colors group-hover:text-mahogany">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </nav>
        )}

        {more.length > 0 && (
          <div className="mt-16 border-t border-mahogany/15 pt-10">
            <p
              className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
              style={{ color: MAHOGANY }}
            >
              More Insights
            </p>
            <ul className="mt-8 divide-y divide-mahogany/15 border-t border-mahogany/15">
              {more.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/blog/${item.slug}`}
                    className="group grid gap-4 py-6 sm:grid-cols-[120px_1fr] sm:items-center"
                  >
                    <img
                      src={item.coverImage}
                      alt=""
                      className="aspect-[4/3] w-full object-cover sm:h-[72px] sm:w-[120px]"
                      loading="lazy"
                      draggable={false}
                    />
                    <span>
                      <span className="font-sans text-[10px] font-medium tracking-[0.14em] text-ink/40 uppercase">
                        {item.category}
                      </span>
                      <span className="mt-1 block font-serif text-xl leading-snug text-ink transition-colors group-hover:text-mahogany">
                        {item.title}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/blog"
              className="mt-6 inline-flex items-center gap-2 font-sans text-[11px] font-semibold tracking-[0.18em] text-ink/50 uppercase transition-colors hover:text-mahogany"
            >
              <span aria-hidden="true">←</span>
              All Notes
            </Link>
          </div>
        )}
      </article>

      <ArticleClosing />
    </main>
  )
}
