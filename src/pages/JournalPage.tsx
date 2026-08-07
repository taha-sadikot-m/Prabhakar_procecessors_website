import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { Images, Play } from 'lucide-react'
import { journalPage } from '../data/content'
import { FadeIn } from '../components/motion/FadeIn'
import { SectionCta } from '../components/SectionCta'
import {
  carouselPosterUrls,
  carouselSlideCount,
  fetchBeholdFeed,
  formatPostDate,
  instagramProfileUrl,
  postAspectRatio,
  postKind,
  postPosterUrl,
  type BeholdFeed,
  type BeholdPost,
} from '../lib/behold'

const MAHOGANY = '#674438'
const HEADING = '#20222D'

const spring = { type: 'spring' as const, stiffness: 280, damping: 28, mass: 0.85 }

const feedColumnsClass =
  'm-0 columns-2 gap-x-5 [column-fill:_balance] md:columns-3 md:gap-x-8'

function DiamondRule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-8 bg-mahogany/30" />
      <span className="h-1.5 w-1.5 rotate-45 bg-mahogany" />
      <span className="h-px w-8 bg-mahogany/30" />
    </div>
  )
}

function JournalHero({ username }: { username: string | null }) {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : ['0%', '12%'],
  )

  const [first, second] = journalPage.headline
  const highlight = journalPage.highlight
  const secondParts = second.split(highlight)
  const profileHref = username ? instagramProfileUrl(username) : null

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[72svh] flex-col overflow-hidden bg-cream pt-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-[-6%] will-change-transform"
          style={{ y: bgY }}
        >
          <picture className="absolute inset-0 block h-full w-full">
            <source
              media="(min-width: 768px)"
              srcSet={journalPage.hero.desktopImage}
            />
            <img
              src={journalPage.hero.mobileImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_30%] md:object-[center_40%]"
              draggable={false}
            />
          </picture>
        </motion.div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-transparent md:via-cream/80 md:to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cream to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <FadeIn className="max-w-xl">
          <p
            className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase"
            style={{ color: MAHOGANY }}
          >
            {journalPage.eyebrow}
          </p>
          <h1 className="mt-5 font-serif text-[2.5rem] leading-[1.08] font-medium tracking-tight text-ink md:text-5xl lg:text-[3.5rem]">
            {first}
            <br />
            {secondParts[0]}
            <span className="text-mahogany">{highlight}</span>
            {secondParts[1] ?? ''}
          </h1>
          <DiamondRule className="mt-6" />
          <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {journalPage.body}
          </p>
          <p className="mt-8 font-sans text-[10px] font-medium tracking-[0.18em] text-ink/45 uppercase">
            {username ? `@${username}` : 'Instagram'} · Live feed
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            {profileHref ? (
              <a
                href={profileHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-b border-mahogany pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-mahogany uppercase transition-opacity hover:opacity-75"
              >
                Follow On Instagram
                <span aria-hidden="true">→</span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 border-b border-mahogany/25 pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-mahogany/40 uppercase">
                Follow On Instagram
                <span aria-hidden="true">→</span>
              </span>
            )}
            <a
              href="#feed"
              className="inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-ink uppercase transition-colors hover:border-mahogany hover:text-mahogany"
            >
              View Feed
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </FadeIn>
      </div>

      <a
        href="#feed"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="font-sans text-[9px] font-medium tracking-[0.24em] text-ink-muted uppercase">
          Scroll
        </span>
        <span className="h-8 w-px bg-mahogany/40" aria-hidden="true" />
      </a>
    </section>
  )
}

function FeedSkeleton() {
  const ratios = [1, 9 / 16, 1, 4 / 5, 1, 1]
  return (
    <ul className={`list-none p-0 ${feedColumnsClass}`}>
      {ratios.map((ratio, i) => (
        <li
          key={i}
          className="mb-5 break-inside-avoid md:mb-8"
          aria-hidden="true"
        >
          <div
            className="w-full animate-pulse border border-line/50 bg-cream-dark"
            style={{ aspectRatio: String(ratio) }}
          />
          <div className="mt-3 h-3 w-12 animate-pulse bg-cream-dark" />
          <div className="mt-2 h-4 w-full animate-pulse bg-cream-dark" />
          <div className="mt-1.5 h-4 w-2/3 animate-pulse bg-cream-dark" />
        </li>
      ))}
    </ul>
  )
}

function PostTile({
  post,
  index,
  reduceMotion,
}: {
  post: BeholdPost
  index: number
  reduceMotion: boolean | null
}) {
  const kind = postKind(post)
  const aspect = postAspectRatio(post)
  const slideCount = carouselSlideCount(post)
  const posters = useMemo(
    () =>
      kind === 'carousel'
        ? carouselPosterUrls(post, 3)
        : ([postPosterUrl(post)].filter(Boolean) as string[]),
    [kind, post],
  )
  const cover = posters[0] ?? null

  const [hovering, setHovering] = useState(false)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    if (reduceMotion || kind !== 'carousel' || posters.length < 2 || !hovering) {
      setSlide(0)
      return
    }
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % posters.length)
    }, 1200)
    return () => window.clearInterval(id)
  }, [hovering, kind, posters, reduceMotion])

  const activeSrc = posters[slide] ?? cover
  const caption = post.prunedCaption || post.caption || ''
  const truncated =
    caption.length > 96 ? `${caption.slice(0, 93).trimEnd()}…` : caption
  const altText = truncated || 'Instagram post'
  const typeLabel =
    kind === 'video' ? 'Reel' : kind === 'carousel' ? 'Carousel' : 'Photo'
  const accessibleName = truncated
    ? `${typeLabel}: ${truncated}`
    : `${typeLabel} on Instagram`

  return (
    <FadeIn delay={reduceMotion ? 0 : 0.04 * (index % 6)}>
      <motion.a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={accessibleName}
        className="group flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-mahogany/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        initial={false}
        whileHover={
          reduceMotion
            ? undefined
            : {
                y: -6,
                transition: spring,
              }
        }
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div
          className="relative w-full overflow-hidden border border-mahogany/20 bg-cream-dark transition-shadow duration-500 group-hover:shadow-[0_16px_40px_rgba(45,27,14,0.14)]"
          style={{ aspectRatio: String(aspect) }}
        >
          {activeSrc ? (
            posters.length > 1 ? (
              posters.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={i === slide ? altText : ''}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                    i === slide ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading={i === 0 ? 'lazy' : 'eager'}
                  draggable={false}
                  aria-hidden={i !== slide}
                />
              ))
            ) : (
              <img
                src={activeSrc}
                alt={altText}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.03]"
                loading="lazy"
                draggable={false}
              />
            )
          ) : (
            <div className="absolute inset-0 bg-cream-dark" />
          )}

          <div
            className="pointer-events-none absolute inset-[5px] border border-cream/55"
            aria-hidden="true"
          />

          {kind === 'video' && (
            <span
              className="absolute top-0 right-0 z-10 flex h-7 w-7 items-center justify-center text-cream"
              style={{ backgroundColor: MAHOGANY }}
              aria-hidden="true"
            >
              <Play className="h-3 w-3 fill-current" strokeWidth={1.5} />
            </span>
          )}

          {kind === 'carousel' && (
            <span
              className="absolute top-0 right-0 z-10 flex h-7 min-w-7 items-center justify-center gap-1 px-1.5 text-cream"
              style={{ backgroundColor: MAHOGANY }}
              aria-hidden="true"
            >
              <Images className="h-3 w-3 shrink-0" strokeWidth={1.5} />
              {slideCount > 0 && (
                <span className="font-sans text-[9px] font-semibold tracking-wide">
                  {slideCount}
                </span>
              )}
            </span>
          )}
        </div>

        <div className="mt-3.5 flex flex-col px-0.5">
          <div className="flex items-baseline gap-2.5">
            <span
              className="font-sans text-[10px] font-semibold tracking-[0.16em] uppercase"
              style={{ color: MAHOGANY }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-sans text-[10px] font-medium tracking-[0.14em] text-ink/40 uppercase">
              {formatPostDate(post.timestamp)}
            </span>
          </div>

          {truncated && (
            <p className="mt-2 line-clamp-2 font-serif text-[15px] leading-snug font-medium tracking-tight text-ink md:text-base">
              {truncated}
            </p>
          )}

          <span
            className="mt-3 block h-px w-7 origin-left bg-mahogany transition-transform duration-500 ease-out group-hover:scale-x-[2.2]"
            aria-hidden="true"
          />
          <span className="mt-2 font-sans text-[10px] font-semibold tracking-[0.16em] text-ink/45 uppercase transition-colors group-hover:text-mahogany">
            View on Instagram
          </span>
        </div>
      </motion.a>
    </FadeIn>
  )
}

function FeedSection({
  feed,
  loading,
  error,
  onRetry,
}: {
  feed: BeholdFeed | null
  loading: boolean
  error: string | null
  onRetry: () => void
}) {
  const reduceMotion = useReducedMotion()
  const posts = feed?.posts ?? []

  return (
    <section
      id="feed"
      className="scroll-mt-[100px] border-t border-line/60 sm:scroll-mt-[108px]"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-10 lg:py-24">
        <FadeIn>
          <p
            className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase"
            style={{ color: MAHOGANY }}
          >
            On Instagram
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink md:text-4xl">
            Recent Posts
          </h2>
        </FadeIn>

        <div className="mt-10 md:mt-14">
          {loading && (
            <div role="status" aria-live="polite" aria-busy="true">
              <span className="sr-only">Loading Instagram feed</span>
              <FeedSkeleton />
            </div>
          )}

          {!loading && error && (
            <div
              role="alert"
              className="border border-mahogany/30 bg-cream-dark px-6 py-10 text-center md:px-10"
            >
              <p className="font-serif text-2xl font-medium text-ink">
                Feed unavailable
              </p>
              <p className="mx-auto mt-3 max-w-md font-sans text-sm text-ink-muted">
                {error}
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-8 inline-flex items-center gap-2 border-b border-mahogany pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-mahogany uppercase transition-opacity hover:opacity-75"
              >
                Try Again
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <p className="font-sans text-sm text-ink-muted">
              No posts to show yet. Check back soon.
            </p>
          )}

          {!loading && !error && posts.length > 0 && (
            <ul className={`list-none p-0 ${feedColumnsClass}`}>
              {posts.map((post, i) => (
                <li key={post.id} className="mb-5 break-inside-avoid md:mb-8">
                  <PostTile
                    post={post}
                    index={i}
                    reduceMotion={reduceMotion}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

function JournalClosing({ username }: { username: string | null }) {
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
  const profileHref = username ? instagramProfileUrl(username) : null

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[56svh] items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={{ scale: bgScale }}
        aria-hidden="true"
      >
        <img
          src={journalPage.closing.texture}
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
            {journalPage.closing.headline[0]}
            <br />
            {journalPage.closing.headline[1]}
          </h2>
          <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {journalPage.closing.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            {profileHref ? (
              <a
                href={profileHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-b border-mahogany pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-mahogany uppercase transition-opacity hover:opacity-75"
              >
                {journalPage.closing.primaryCta}
                <span aria-hidden="true">→</span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 border-b border-mahogany/25 pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-mahogany/40 uppercase">
                {journalPage.closing.primaryCta}
              </span>
            )}
            <SectionCta
              label={journalPage.closing.secondaryCta}
              to={journalPage.closing.secondaryHref}
              variant="dark"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export function JournalPage() {
  const [feed, setFeed] = useState<BeholdFeed | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBeholdFeed(journalPage.feedUrl, signal)
      if (signal?.aborted) return
      setFeed(data)
    } catch (err) {
      if (signal?.aborted) return
      if (err instanceof DOMException && err.name === 'AbortError') return
      setFeed(null)
      setError(
        err instanceof Error
          ? err.message
          : 'Could not load the Instagram feed.',
      )
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void load(controller.signal)
    return () => controller.abort()
  }, [load, reloadKey])

  const onRetry = () => setReloadKey((k) => k + 1)
  const username = feed?.username ?? null

  return (
    <main className="bg-cream">
      <JournalHero username={username} />
      <FeedSection
        feed={feed}
        loading={loading}
        error={error}
        onRetry={onRetry}
      />
      <JournalClosing username={username} />
    </main>
  )
}
