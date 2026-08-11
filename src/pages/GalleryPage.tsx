import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { FadeIn } from '../components/motion/FadeIn'
import { SectionCta } from '../components/SectionCta'
import { fetchPublicGallery, type GalleryItemDto } from '../lib/cms-api'
import { driveVideoUrl, resolveDriveUrls } from '../lib/drive-client'
import { galleryPage, servicesPage } from '../data/content'

const MAHOGANY = '#674438'
const HEADING = '#20222D'

type GalleryEntry = {
  item: GalleryItemDto
}

const masonryClass =
  'm-0 columns-1 gap-x-5 [column-fill:_balance] sm:columns-2 sm:gap-x-6 lg:columns-3 lg:gap-x-7'

function isPlayableVideo(entry: GalleryEntry) {
  return entry.item.mediaType === 'video'
}

function DiamondRule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-8 bg-mahogany/30" />
      <span className="h-1.5 w-1.5 rotate-45 bg-mahogany" />
      <span className="h-px w-8 bg-mahogany/30" />
    </div>
  )
}

function GalleryHero({
  frameCount,
}: {
  frameCount: number | null
}) {
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

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[78svh] flex-col overflow-hidden bg-cream pt-24"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-[-6%] will-change-transform"
          style={{ y: bgY }}
        >
          <picture className="absolute inset-0 block h-full w-full">
            <source
              media="(min-width: 768px)"
              srcSet={galleryPage.hero.desktopImage}
            />
            <img
              src={galleryPage.hero.mobileImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_35%] md:object-[center_40%]"
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
            Gallery
          </p>
          <h1 className="mt-5 font-serif text-[2.5rem] leading-[1.08] font-medium tracking-tight text-ink md:text-5xl lg:text-[3.5rem]">
            Colour, print,
            <br />
            and <span className="text-mahogany">finish</span> in frame.
          </h1>
          <DiamondRule className="mt-6" />
          <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            A living lookbook from the mill floor — colour, print, and finish
            in frame.
          </p>
          {frameCount !== null && frameCount > 0 && (
            <p className="mt-5 font-sans text-[11px] font-medium tracking-[0.18em] text-mahogany/80 uppercase">
              {frameCount} frames
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  )
}

type PlayerStatus = 'loading' | 'playing' | 'paused' | 'error'

function InlineDrivePlayer({
  videoUrl,
  poster,
  label,
  wantPlaying,
  soundOn,
  reloadKey = 0,
  onStatusChange,
}: {
  videoUrl: string
  poster: string
  label: string
  wantPlaying: boolean
  soundOn: boolean
  reloadKey?: number
  onStatusChange?: (status: PlayerStatus) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<PlayerStatus>('loading')
  const statusRef = useRef<PlayerStatus>('loading')
  const soundOnRef = useRef(soundOn)
  soundOnRef.current = soundOn

  function setPlayerStatus(next: PlayerStatus) {
    statusRef.current = next
    setStatus(next)
    onStatusChange?.(next)
  }

  function applySound(el: HTMLVideoElement, withSound: boolean) {
    el.muted = !withSound
    el.defaultMuted = !withSound
    el.volume = withSound ? 1 : 0
  }

  function tryPlay(el: HTMLVideoElement) {
    applySound(el, soundOnRef.current)
    void el
      .play()
      .then(() => setPlayerStatus('playing'))
      .catch(() => {
        window.setTimeout(() => {
          const node = videoRef.current
          if (!node || !wantPlaying) return
          applySound(node, soundOnRef.current)
          void node
            .play()
            .then(() => setPlayerStatus('playing'))
            .catch(() => setPlayerStatus('error'))
        }, 250)
      })
  }

  useLayoutEffect(() => {
    const el = videoRef.current
    if (!el) return
    applySound(el, soundOn)
    if (wantPlaying) {
      if (el.readyState >= 2) tryPlay(el)
      else setPlayerStatus('loading')
    } else {
      el.pause()
      if (statusRef.current !== 'error') setPlayerStatus('paused')
    }
  }, [wantPlaying, videoUrl, reloadKey])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    applySound(el, soundOn)
  }, [soundOn])

  useEffect(() => {
    setPlayerStatus('loading')
  }, [videoUrl, reloadKey])

  if (status === 'error') {
    return (
      <>
        {poster ? (
          <img
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-cream-dark" />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-[#2d1b0e]/45 px-4 text-center">
          <span className="rounded-md border border-cream/25 bg-[#2d1b0e]/70 px-3 py-2 font-sans text-[10px] font-semibold tracking-[0.12em] text-cream uppercase backdrop-blur-sm">
            Tap to retry
          </span>
        </span>
        <span className="sr-only">{label} unavailable</span>
      </>
    )
  }

  return (
    <>
      {status === 'loading' && poster && (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <video
        ref={videoRef}
        key={`${videoUrl}-${reloadKey}`}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          status === 'loading' ? 'opacity-0' : 'opacity-100'
        }`}
        src={videoUrl}
        poster={poster || undefined}
        muted={!soundOn}
        loop
        playsInline
        preload="auto"
        controls={false}
        aria-label={label}
        onLoadStart={() => {
          if (wantPlaying) setPlayerStatus('loading')
        }}
        onCanPlay={() => {
          const el = videoRef.current
          if (el && wantPlaying) tryPlay(el)
        }}
        onLoadedData={() => {
          const el = videoRef.current
          if (el && wantPlaying) tryPlay(el)
        }}
        onPlaying={() => setPlayerStatus('playing')}
        onPause={() => {
          if (!wantPlaying) setPlayerStatus('paused')
        }}
        onError={() => setPlayerStatus('error')}
      />
    </>
  )
}

function GalleryTile({
  entry,
  playing,
  onTogglePlay,
  onOpenStill,
}: {
  entry: GalleryEntry
  playing: boolean
  onTogglePlay: () => void
  onOpenStill: () => void
}) {
  const [ratio, setRatio] = useState<string | null>(null)
  const [activated, setActivated] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>('loading')
  const [soundOn, setSoundOn] = useState(false)
  const [coverReady, setCoverReady] = useState(false)
  const urls = resolveDriveUrls(entry.item.driveUrl)
  const fileId = entry.item.fileId || urls.fileId
  const isVideo = entry.item.mediaType === 'video'
  const videoUrl = isVideo
    ? entry.item.videoUrl ||
      urls.videoUrl ||
      (fileId ? driveVideoUrl(fileId) : null)
    : null
  const imgSrc = isVideo
    ? urls.thumbUrl || entry.item.thumbUrl || urls.viewUrl
    : urls.viewUrl || entry.item.viewUrl || urls.thumbUrl
  const label = entry.item.description?.trim() || 'Gallery media'
  const showPlayer = Boolean(isVideo && activated && videoUrl)
  const showCoverLoading = !showPlayer && !coverReady

  useEffect(() => {
    setCoverReady(false)
  }, [imgSrc, videoUrl, isVideo])

  function activate() {
    if (!isVideo) {
      onOpenStill()
      return
    }
    if (!activated) {
      setActivated(true)
      setPlayerStatus('loading')
      if (!playing) onTogglePlay()
      return
    }
    if (playerStatus === 'error') {
      setReloadKey((k) => k + 1)
      setPlayerStatus('loading')
      if (!playing) onTogglePlay()
      return
    }
    onTogglePlay()
  }

  const chipLabel = !showPlayer
    ? null
    : playerStatus === 'error'
      ? 'Tap to retry'
      : playing
        ? playerStatus === 'loading'
          ? 'Loading…'
          : null
        : playerStatus === 'paused'
          ? 'Paused'
          : null

  return (
    <figure className="mb-5 break-inside-avoid sm:mb-6 lg:mb-7">
      <div
        role="button"
        tabIndex={0}
        onClick={activate}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            activate()
          }
        }}
        aria-label={
          isVideo
            ? playing
              ? `Pause ${label}`
              : `Play ${label}`
            : `Open ${label}`
        }
        aria-pressed={isVideo ? playing : undefined}
        aria-busy={showCoverLoading}
        className="group relative block w-full cursor-pointer overflow-hidden rounded-xl bg-cream-dark text-left shadow-[0_1px_2px_rgba(45,27,14,0.04),0_8px_24px_rgba(45,27,14,0.06)] outline-none focus-visible:ring-2 focus-visible:ring-mahogany/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream md:rounded-2xl"
        style={{ aspectRatio: ratio ?? '4 / 5' }}
      >
        {showPlayer ? (
          <InlineDrivePlayer
            videoUrl={videoUrl!}
            poster={imgSrc}
            label={label}
            wantPlaying={playing}
            soundOn={soundOn}
            reloadKey={reloadKey}
            onStatusChange={setPlayerStatus}
          />
        ) : isVideo && videoUrl ? (
          <video
            src={videoUrl}
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
            onLoadedMetadata={(e) => {
              const el = e.currentTarget
              if (el.videoWidth && el.videoHeight) {
                setRatio(`${el.videoWidth} / ${el.videoHeight}`)
              }
              if (el.currentTime < 0.05) el.currentTime = 0.1
              else setCoverReady(true)
            }}
            onSeeked={() => setCoverReady(true)}
            onLoadedData={(e) => {
              if (e.currentTarget.currentTime >= 0.05) setCoverReady(true)
            }}
            onError={() => setCoverReady(true)}
          />
        ) : (
          <img
            src={imgSrc}
            alt={entry.item.description ?? ''}
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
            loading="lazy"
            onLoad={(e) => {
              const el = e.currentTarget
              if (el.naturalWidth && el.naturalHeight) {
                setRatio(`${el.naturalWidth} / ${el.naturalHeight}`)
              }
              setCoverReady(true)
            }}
            onError={() => setCoverReady(true)}
          />
        )}
        {showCoverLoading && (
          <span
            className="pointer-events-none absolute inset-0 z-[5] bg-cream-dark"
            aria-hidden="true"
          >
            <span className="absolute inset-0 animate-pulse bg-cream-dark" />
            <span className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-mahogany/20 border-t-mahogany" />
              <span className="font-sans text-[9px] font-semibold tracking-[0.14em] text-mahogany uppercase">
                {isVideo ? 'Loading video' : 'Loading photo'}
              </span>
            </span>
          </span>
        )}
        {!playing && !showCoverLoading && (
          <span
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2d1b0e]/55 via-[#2d1b0e]/10 to-transparent opacity-80 transition duration-500 group-hover:opacity-100"
            aria-hidden="true"
          />
        )}
        {isVideo && !playing && (
          <span
            className={`pointer-events-none absolute top-1/2 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cream/40 bg-mahogany/90 text-cream shadow-[0_8px_24px_rgba(45,27,14,0.28)] transition duration-300 group-hover:scale-105 group-hover:bg-mahogany ${
              showCoverLoading ? 'opacity-50' : ''
            }`}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              className="ml-0.5 h-6 w-6 fill-current"
              aria-hidden="true"
            >
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
          </span>
        )}
        {chipLabel && (
          <span
            className={`pointer-events-none absolute top-3 z-10 rounded-md border border-cream/25 bg-[#2d1b0e]/55 px-2 py-1 font-sans text-[9px] font-semibold tracking-[0.14em] text-cream uppercase backdrop-blur-sm ${
              showPlayer ? 'right-14' : 'right-3'
            }`}
          >
            {chipLabel}
          </span>
        )}
        {showPlayer && (
          <button
            type="button"
            className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 bg-[#2d1b0e]/65 text-cream shadow-[0_4px_12px_rgba(45,27,14,0.2)] backdrop-blur-sm transition hover:bg-[#2d1b0e]/85 focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:outline-none"
            aria-label={soundOn ? 'Mute video' : 'Unmute video'}
            aria-pressed={soundOn}
            onClick={(e) => {
              e.stopPropagation()
              setSoundOn((on) => !on)
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {soundOn ? (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current"
                aria-hidden="true"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.3-3.9v7.8A4.5 4.5 0 0 0 16.5 12zM14 3.2v2.1a6.9 6.9 0 0 1 0 13.4v2.1A8.9 8.9 0 0 0 14 3.2z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current"
                aria-hidden="true"
              >
                <path d="M16.5 12a4.5 4.5 0 0 0-2.3-3.9v2.4l2.2 2.2c.06-.23.1-.46.1-.7zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-3.53-2.05-6.56-5-8.04v2.21A6.9 6.9 0 0 1 19 12zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
              </svg>
            )}
          </button>
        )}
        {!playing && entry.item.description && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-1 px-4 pb-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="line-clamp-2 font-sans text-xs leading-relaxed text-cream/95 md:text-sm">
              {entry.item.description}
            </span>
          </span>
        )}
      </div>
    </figure>
  )
}

function GalleryLookbook({
  entries,
  playingId,
  onTogglePlay,
  onOpenStill,
}: {
  entries: GalleryEntry[]
  playingId: string | null
  onTogglePlay: (id: string) => void
  onOpenStill: (index: number) => void
}) {
  const reduceMotion = useReducedMotion()

  if (entries.length === 0) {
    return (
      <p className="py-16 text-center font-sans text-sm text-ink/40">
        Media will appear here.
      </p>
    )
  }

  return (
    <motion.div
      className={masonryClass}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
    >
      {entries.map((entry, index) => (
        <GalleryTile
          key={entry.item.id}
          entry={entry}
          playing={playingId === entry.item.id}
          onTogglePlay={() => onTogglePlay(entry.item.id)}
          onOpenStill={() => onOpenStill(index)}
        />
      ))}
    </motion.div>
  )
}

function GalleryLightbox({
  entries,
  index,
  onClose,
  onNavigate,
}: {
  entries: GalleryEntry[]
  index: number
  onClose: () => void
  onNavigate: (next: number) => void
}) {
  const entry = entries[index]
  const reduceMotion = useReducedMotion()
  const [ratio, setRatio] = useState<string | null>(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onNavigate(index <= 0 ? entries.length - 1 : index - 1)
      if (e.key === 'ArrowRight')
        onNavigate(index >= entries.length - 1 ? 0 : index + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [entries.length, index, onClose, onNavigate])

  const urls = entry ? resolveDriveUrls(entry.item.driveUrl) : null
  const imgSrc = entry
    ? urls?.viewUrl ||
      entry.item.viewUrl ||
      urls?.thumbUrl ||
      entry.item.thumbUrl ||
      ''
    : ''
  const label = entry
    ? entry.item.description?.trim() || 'Gallery media'
    : 'Gallery media'
  const canNavigate = entries.length > 1

  useEffect(() => {
    setRatio(null)
    if (!imgSrc) return
    const probe = new Image()
    probe.onload = () => {
      if (probe.naturalWidth && probe.naturalHeight) {
        setRatio(`${probe.naturalWidth} / ${probe.naturalHeight}`)
      }
    }
    probe.src = imgSrc
  }, [entry?.item.id, imgSrc])

  if (!entry) return null

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#1a120c]/88 backdrop-blur-sm"
        aria-label="Close gallery viewer"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92svh] w-full max-w-5xl flex-col px-4 py-6 md:px-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-sans text-[10px] font-semibold tracking-[0.18em] text-cream/55 uppercase">
              Gallery
              {canNavigate && (
                <span className="ml-2 text-cream/35">
                  {index + 1} / {entries.length}
                </span>
              )}
            </p>
            {entry.item.description && (
              <p className="mt-1.5 line-clamp-2 font-sans text-sm text-cream/90 md:text-base">
                {entry.item.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-cream/25 bg-cream/10 px-3 py-1.5 font-sans text-[10px] font-semibold tracking-[0.14em] text-cream uppercase transition hover:bg-cream/20"
          >
            Close
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          {canNavigate && (
            <>
              <button
                type="button"
                onClick={() =>
                  onNavigate(index <= 0 ? entries.length - 1 : index - 1)
                }
                className="absolute top-1/2 left-0 z-20 -translate-y-1/2 rounded-lg border border-cream/20 bg-[#1a120c]/60 px-3 py-3 text-cream transition hover:bg-[#1a120c]/85 md:-left-2"
                aria-label="Previous"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() =>
                  onNavigate(index >= entries.length - 1 ? 0 : index + 1)
                }
                className="absolute top-1/2 right-0 z-20 -translate-y-1/2 rounded-lg border border-cream/20 bg-[#1a120c]/60 px-3 py-3 text-cream transition hover:bg-[#1a120c]/85 md:-right-2"
                aria-label="Next"
              >
                →
              </button>
            </>
          )}

          <div
            className="relative w-full max-h-[75svh] overflow-hidden rounded-2xl bg-[#120c09] shadow-[0_24px_60px_rgba(26,18,12,0.45)]"
            style={{
              aspectRatio: ratio ?? '4 / 5',
              maxWidth: 'min(100%, calc(75svh * 1.2))',
            }}
          >
            <img
              src={imgSrc}
              alt={entry.item.description ?? ''}
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function GalleryEmpty() {
  return (
    <section className="border-t border-line/60 bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-20 text-center md:px-8 lg:px-10">
        <p className="font-serif text-2xl font-medium text-ink md:text-3xl">
          Gallery coming into view
        </p>
        <p className="mx-auto mt-4 max-w-md font-sans text-sm text-ink-muted">
          Drive media is managed from the admin panel. Check back soon, or get
          in touch for a mill tour.
        </p>
        <div className="mt-10 flex justify-center">
          <SectionCta label="Contact Us" to="/contact" />
        </div>
      </div>
    </section>
  )
}

function GalleryClosing() {
  return (
    <section className="relative flex min-h-[48svh] items-center justify-center overflow-hidden border-t border-line/60">
      <img
        src={servicesPage.backgrounds.ikat}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(250, 240, 230, 0.82)' }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-xl px-6 py-16 text-center">
        <FadeIn>
          <h2
            className="font-serif text-3xl font-light tracking-tight italic md:text-4xl"
            style={{ color: HEADING }}
          >
            See the work up close.
          </h2>
          <p className="mx-auto mt-4 max-w-md font-sans text-sm text-ink-muted">
            Tell us what you need dyed, printed, or finished. We will match
            process to fabric.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <SectionCta label="Start A Project" to="/contact" />
            <SectionCta label="View Services" to="/services" variant="outline" />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItemDto[] | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchPublicGallery()
      .then((data) => {
        if (!cancelled) setItems(data.items ?? [])
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const entries = useMemo(
    () => (items ? items.map((item) => ({ item })) : []),
    [items],
  )

  function togglePlay(id: string) {
    setLightboxIndex(null)
    setPlayingId((prev) => (prev === id ? null : id))
  }

  function openStill(index: number) {
    const entry = entries[index]
    if (!entry || isPlayableVideo(entry)) return
    setPlayingId(null)
    setLightboxIndex(index)
  }

  return (
    <main className="bg-cream">
      <GalleryHero frameCount={items ? entries.length : null} />

      {items === null ? (
        <div className="px-5 py-20 text-center font-sans text-sm text-ink/40">
          Loading gallery…
        </div>
      ) : items.length === 0 ? (
        <GalleryEmpty />
      ) : (
        <section className="border-t border-line/40 bg-cream">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16 lg:px-10">
            <GalleryLookbook
              entries={entries}
              playingId={playingId}
              onTogglePlay={togglePlay}
              onOpenStill={openStill}
            />
          </div>
        </section>
      )}

      <GalleryClosing />

      <AnimatePresence>
        {lightboxIndex !== null &&
          entries[lightboxIndex] &&
          !isPlayableVideo(entries[lightboxIndex]) && (
            <GalleryLightbox
              entries={entries}
              index={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
              onNavigate={setLightboxIndex}
            />
          )}
      </AnimatePresence>
    </main>
  )
}
