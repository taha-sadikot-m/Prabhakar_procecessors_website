import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { FadeIn } from '../components/motion/FadeIn'
import { SectionCta } from '../components/SectionCta'
import {
  fetchPublicGallery,
  type GalleryItemDto,
  type GallerySectionDto,
} from '../lib/cms-api'
import { resolveDriveUrls } from '../lib/drive-client'
import { servicesPage } from '../data/content'

const MAHOGANY = '#674438'
const HEADING = '#20222D'

type GalleryEntry = {
  item: GalleryItemDto
  sectionId: string
  sectionTitle: string
}

const masonryClass =
  'm-0 columns-1 gap-x-5 [column-fill:_balance] sm:columns-2 sm:gap-x-6 lg:columns-3 lg:gap-x-7'

function DiamondRule({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-8 bg-mahogany/30" />
      <span className="h-1.5 w-1.5 rotate-45 bg-mahogany" />
      <span className="h-px w-8 bg-mahogany/30" />
    </div>
  )
}

function flattenGallery(sections: GallerySectionDto[]): GalleryEntry[] {
  return sections.flatMap((section) =>
    section.items.map((item) => ({
      item,
      sectionId: section.id,
      sectionTitle: section.title,
    })),
  )
}

function GalleryHero({
  frameCount,
  sectionCount,
}: {
  frameCount: number | null
  sectionCount: number | null
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
      className="relative flex min-h-[58svh] flex-col overflow-hidden bg-cream pt-24 md:min-h-[64svh]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-[-6%] will-change-transform"
          style={{ y: bgY }}
        >
          <img
            src={servicesPage.backgrounds.jali}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
            draggable={false}
          />
        </motion.div>
        <div
          className="absolute inset-0 bg-gradient-to-b from-cream via-cream/85 to-cream"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-14 md:px-8 lg:px-10 lg:py-20">
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
            A living lookbook from the mill floor — filter by process, or take in
            the full run.
          </p>
          {frameCount !== null && sectionCount !== null && frameCount > 0 && (
            <p className="mt-5 font-sans text-[11px] font-medium tracking-[0.18em] text-mahogany/80 uppercase">
              {frameCount} frames across {sectionCount} floors
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  )
}

function GalleryFilterRail({
  sections,
  activeId,
  onChange,
  allCount,
}: {
  sections: GallerySectionDto[]
  activeId: string
  onChange: (id: string) => void
  allCount: number
}) {
  return (
    <nav
      aria-label="Gallery sections"
      className="sticky top-[68px] z-40 border-b border-mahogany/20 bg-cream/95 backdrop-blur-md sm:top-[72px]"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-5 py-3 [-ms-overflow-style:none] [scrollbar-width:none] md:px-8 lg:px-10 [&::-webkit-scrollbar]:hidden">
        <FilterTab
          label="All"
          count={allCount}
          isActive={activeId === 'all'}
          onClick={() => onChange('all')}
        />
        {sections.map((section) => (
          <FilterTab
            key={section.id}
            label={section.title}
            count={section.items.length}
            isActive={activeId === section.id}
            onClick={() => onChange(section.id)}
          />
        ))}
      </div>
    </nav>
  )
}

function FilterTab({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative shrink-0 px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors ${
        isActive ? 'text-mahogany' : 'text-ink/55 hover:text-ink'
      }`}
      aria-pressed={isActive}
    >
      {label}
      <span className="ml-1.5 font-medium opacity-60">({count})</span>
      <span
        className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-mahogany transition-transform duration-300 ${
          isActive ? 'scale-x-100' : 'scale-x-0'
        }`}
        aria-hidden="true"
      />
    </button>
  )
}

function GalleryTile({
  entry,
  showSectionChip,
  onOpen,
}: {
  entry: GalleryEntry
  showSectionChip: boolean
  onOpen: () => void
}) {
  const [ratio, setRatio] = useState<string | null>(null)
  const urls = resolveDriveUrls(entry.item.driveUrl)
  const imgSrc = entry.item.thumbUrl || urls.thumbUrl || urls.viewUrl
  const label = entry.item.description?.trim() || entry.sectionTitle

  return (
    <figure className="mb-5 break-inside-avoid sm:mb-6 lg:mb-7">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${label}`}
        className="group relative block w-full overflow-hidden bg-cream-dark text-left outline-none focus-visible:ring-2 focus-visible:ring-mahogany/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        style={{ aspectRatio: ratio ?? '4 / 5' }}
      >
        <img
          src={imgSrc}
          alt={entry.item.description ?? ''}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
          onLoad={(e) => {
            const el = e.currentTarget
            if (el.naturalWidth && el.naturalHeight) {
              setRatio(`${el.naturalWidth} / ${el.naturalHeight}`)
            }
          }}
        />
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2d1b0e]/55 via-[#2d1b0e]/10 to-transparent opacity-80 transition duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />
        {showSectionChip && (
          <span className="absolute top-3 left-3 z-10 max-w-[70%] truncate border border-cream/25 bg-[#2d1b0e]/55 px-2.5 py-1 font-sans text-[9px] font-semibold tracking-[0.16em] text-cream uppercase backdrop-blur-sm">
            {entry.sectionTitle}
          </span>
        )}
        <span
          className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cream/40 bg-mahogany/90 text-cream shadow-[0_8px_24px_rgba(45,27,14,0.28)] transition duration-300 group-hover:scale-105 group-hover:bg-mahogany"
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
        {entry.item.description && (
          <span className="absolute inset-x-0 bottom-0 z-10 translate-y-1 px-4 pb-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="line-clamp-2 font-sans text-xs leading-relaxed text-cream/95 md:text-sm">
              {entry.item.description}
            </span>
          </span>
        )}
      </button>
    </figure>
  )
}

function GalleryLookbook({
  entries,
  showSectionChip,
  filterKey,
  onOpen,
}: {
  entries: GalleryEntry[]
  showSectionChip: boolean
  filterKey: string
  onOpen: (index: number) => void
}) {
  const reduceMotion = useReducedMotion()

  if (entries.length === 0) {
    return (
      <p className="py-16 text-center font-sans text-sm text-ink/40">
        Media for this section will appear here.
      </p>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={filterKey}
        className={masonryClass}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
      >
        {entries.map((entry, index) => (
          <GalleryTile
            key={entry.item.id}
            entry={entry}
            showSectionChip={showSectionChip}
            onOpen={() => onOpen(index)}
          />
        ))}
      </motion.div>
    </AnimatePresence>
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
  const preview = entry
    ? entry.item.previewUrl || urls?.previewUrl || ''
    : ''
  const imgSrc = entry
    ? entry.item.thumbUrl || urls?.thumbUrl || urls?.viewUrl || ''
    : ''
  const label = entry
    ? entry.item.description?.trim() || entry.sectionTitle
    : 'Gallery media'
  const useEmbed = Boolean(entry && (entry.item.fileId || urls?.fileId))
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
              {entry.sectionTitle}
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
            className="shrink-0 border border-cream/25 bg-cream/10 px-3 py-1.5 font-sans text-[10px] font-semibold tracking-[0.14em] text-cream uppercase transition hover:bg-cream/20"
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
                className="absolute top-1/2 left-0 z-20 -translate-y-1/2 border border-cream/20 bg-[#1a120c]/60 px-3 py-3 text-cream transition hover:bg-[#1a120c]/85 md:-left-2"
                aria-label="Previous"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() =>
                  onNavigate(index >= entries.length - 1 ? 0 : index + 1)
                }
                className="absolute top-1/2 right-0 z-20 -translate-y-1/2 border border-cream/20 bg-[#1a120c]/60 px-3 py-3 text-cream transition hover:bg-[#1a120c]/85 md:-right-2"
                aria-label="Next"
              >
                →
              </button>
            </>
          )}

          <div
            className="relative w-full max-h-[75svh] overflow-hidden bg-[#120c09]"
            style={{
              aspectRatio: ratio ?? '4 / 5',
              maxWidth: 'min(100%, calc(75svh * 1.2))',
            }}
          >
            {useEmbed ? (
              <iframe
                key={entry.item.id}
                title={label}
                src={preview}
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            ) : (
              <img
                src={imgSrc}
                alt={entry.item.description ?? ''}
                className="absolute inset-0 h-full w-full object-contain"
              />
            )}
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
          Sections and Drive media are managed from the admin panel. Check back
          soon, or get in touch for a mill tour.
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
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            <SectionCta label="Start A Project" to="/contact" />
            <Link
              to="/services"
              className="inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-ink uppercase transition-colors hover:border-mahogany hover:text-mahogany"
            >
              View Services
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export function GalleryPage() {
  const [sections, setSections] = useState<GallerySectionDto[] | null>(null)
  const [activeId, setActiveId] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchPublicGallery()
      .then((data) => {
        if (!cancelled) setSections(data.sections ?? [])
      })
      .catch(() => {
        if (!cancelled) setSections([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const allEntries = useMemo(
    () => (sections ? flattenGallery(sections) : []),
    [sections],
  )

  const visibleEntries = useMemo(() => {
    if (activeId === 'all') return allEntries
    return allEntries.filter((entry) => entry.sectionId === activeId)
  }, [activeId, allEntries])

  const activeSectionBody =
    activeId === 'all'
      ? null
      : (sections?.find((s) => s.id === activeId)?.body ?? null)

  return (
    <main className="bg-cream">
      <GalleryHero
        frameCount={sections ? allEntries.length : null}
        sectionCount={sections ? sections.length : null}
      />

      {sections === null ? (
        <div className="px-5 py-20 text-center font-sans text-sm text-ink/40">
          Loading gallery…
        </div>
      ) : sections.length === 0 ? (
        <GalleryEmpty />
      ) : (
        <>
          <GalleryFilterRail
            sections={sections}
            activeId={activeId}
            onChange={(id) => {
              setActiveId(id)
              setLightboxIndex(null)
            }}
            allCount={allEntries.length}
          />

          <section className="border-t border-line/40 bg-cream">
            <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16 lg:px-10">
              {activeSectionBody && (
                <FadeIn className="mb-10 max-w-xl">
                  <p className="font-sans text-sm leading-relaxed text-ink-muted md:text-base">
                    {activeSectionBody}
                  </p>
                </FadeIn>
              )}
              <GalleryLookbook
                entries={visibleEntries}
                showSectionChip={activeId === 'all'}
                filterKey={activeId}
                onOpen={setLightboxIndex}
              />
            </div>
          </section>
        </>
      )}

      <GalleryClosing />

      <AnimatePresence>
        {lightboxIndex !== null && visibleEntries[lightboxIndex] && (
          <GalleryLightbox
            entries={visibleEntries}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
