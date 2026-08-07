import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { blogPage, company } from '../data/content'
import { blogPosts, type BlogPost } from '../data/blogPosts'
import { FadeIn } from '../components/motion/FadeIn'
import { SectionCta } from '../components/SectionCta'
import { SeoHead, SITE_URL } from '../components/SeoHead'

const MAHOGANY = '#674438'
const HEADING = '#20222D'

function DiamondRule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-8 bg-mahogany/30" />
      <span className="h-1.5 w-1.5 rotate-45 bg-mahogany" />
      <span className="h-px w-8 bg-mahogany/30" />
    </div>
  )
}

function formatPostDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function BlogHero() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : ['0%', '10%'],
  )

  const [first, second] = blogPage.headline
  const highlight = blogPage.highlight
  const secondParts = second.split(highlight)

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[58svh] flex-col overflow-hidden bg-cream pt-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-[-8%] will-change-transform"
          style={{ y: bgY }}
        >
          <img
            src={blogPage.hero.texture}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[0.14]"
            draggable={false}
          />
        </motion.div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-cream via-cream/92 to-cream/70"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-14 md:px-8 lg:px-10 lg:py-20">
        <FadeIn className="max-w-xl">
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: MAHOGANY }}
          >
            {blogPage.eyebrow}
          </p>
          <h1 className="mt-5 font-serif text-[2.5rem] leading-[1.08] font-medium tracking-tight text-ink md:text-5xl lg:text-[3.35rem]">
            {first}
            <br />
            {secondParts[0]}
            <span className="text-mahogany">{highlight}</span>
            {secondParts[1] ?? ''}
          </h1>
          <DiamondRule className="mt-6" />
          <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {blogPage.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <SectionCta
              label={blogPage.hero.primaryCta}
              to={blogPage.hero.primaryHref}
            />
            <a
              href={blogPage.hero.secondaryHref}
              className="inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-ink uppercase transition-colors hover:border-mahogany hover:text-mahogany"
            >
              {blogPage.hero.secondaryCta}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function FeaturedPost({ post }: { post: BlogPost }) {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : ['-4%', '4%'],
  )

  return (
    <section
      ref={sectionRef}
      aria-labelledby="featured-heading"
      className="relative min-h-[70svh] overflow-hidden bg-ink"
    >
      <motion.div
        className="absolute inset-0"
        style={{ y: imgY }}
        aria-hidden="true"
      >
        <img
          src={post.coverImage}
          alt={post.coverAlt}
          className="h-full w-full scale-110 object-cover"
          draggable={false}
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#1a120e]/92 via-[#1a120e]/55 to-[#1a120e]/25"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl flex-col justify-end px-5 py-16 md:px-8 lg:px-10 lg:py-20">
        <FadeIn className="max-w-2xl">
          <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-cream/70 uppercase">
            Featured · {post.category} · {formatPostDate(post.date)}
          </p>
          <h2
            id="featured-heading"
            className="mt-4 font-serif text-3xl leading-[1.12] font-medium tracking-tight text-cream md:text-4xl lg:text-5xl"
          >
            <Link
              to={`/blog/${post.slug}`}
              className="transition-opacity hover:opacity-90"
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-5 max-w-lg font-sans text-sm leading-relaxed text-cream/75 md:text-base">
            {post.excerpt}
          </p>
          <div className="mt-8">
            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 border-b border-cream/50 pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-cream uppercase transition-colors hover:border-cream hover:text-cream"
            >
              {blogPage.featuredCta}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function ArchiveRow({ post }: { post: BlogPost }) {
  return (
    <article className="grid gap-6 border-t border-mahogany/15 py-10 md:grid-cols-[minmax(0,220px)_1fr] md:gap-10 md:py-12 lg:grid-cols-[minmax(0,280px)_1fr]">
      <Link
        to={`/blog/${post.slug}`}
        className="group relative aspect-[4/3] overflow-hidden md:aspect-[5/4]"
      >
        <img
          src={post.coverImage}
          alt={post.coverAlt}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
          draggable={false}
        />
      </Link>
      <div className="flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[10px] font-medium tracking-[0.16em] text-ink/45 uppercase">
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
        <h2 className="mt-3 max-w-xl font-serif text-2xl leading-snug font-medium tracking-tight text-ink md:text-[1.75rem]">
          <Link
            to={`/blog/${post.slug}`}
            className="transition-colors hover:text-mahogany"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 max-w-lg font-sans text-sm leading-relaxed text-ink-muted md:text-[15px]">
          {post.excerpt}
        </p>
        <Link
          to={`/blog/${post.slug}`}
          className="mt-5 inline-flex w-fit items-center gap-2 border-b border-ink/30 pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-ink uppercase transition-colors hover:border-mahogany hover:text-mahogany"
        >
          Read
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}

function PostArchive({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null

  return (
    <section id="posts" className="scroll-mt-24 bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">
        <FadeIn>
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: MAHOGANY }}
          >
            All Notes
          </p>
          <DiamondRule className="mt-4" />
        </FadeIn>
        <div className="mt-4">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={Math.min(i * 0.05, 0.2)}>
              <ArchiveRow post={post} />
            </FadeIn>
          ))}
          <div className="border-t border-mahogany/15" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

function BlogClosing() {
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
      className="relative flex min-h-[52svh] items-center justify-center overflow-hidden"
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

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-20 text-center md:px-8">
        <FadeIn>
          <h2
            className="font-serif text-3xl leading-[1.12] font-light tracking-tight italic md:text-4xl lg:text-[2.75rem]"
            style={{ color: HEADING }}
          >
            {blogPage.closing.headline[0]}
            <br />
            {blogPage.closing.headline[1]}
          </h2>
          <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {blogPage.closing.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            <SectionCta
              label={blogPage.closing.primaryCta}
              to={blogPage.closing.primaryHref}
            />
            <Link
              to={blogPage.closing.secondaryHref}
              className="inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-ink uppercase transition-colors hover:border-mahogany hover:text-mahogany"
            >
              {blogPage.closing.secondaryCta}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export function BlogPage() {
  const [featured, ...rest] = blogPosts

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: blogPage.seoTitle,
    description: blogPage.seoDescription,
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: company.name,
      url: SITE_URL,
    },
    blogPost: blogPosts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
      image: `${SITE_URL}${p.coverImage}`,
    })),
  }

  return (
    <main className="bg-cream">
      <SeoHead
        title={blogPage.seoTitle}
        description={blogPage.seoDescription}
        path="/blog"
        image={featured?.coverImage}
        imageAlt={featured?.coverAlt}
        jsonLd={jsonLd}
      />
      <BlogHero />
      {featured && <FeaturedPost post={featured} />}
      <PostArchive posts={rest} />
      {rest.length === 0 && (
        <div id="posts" className="scroll-mt-24" aria-hidden="true" />
      )}
      <BlogClosing />
    </main>
  )
}
