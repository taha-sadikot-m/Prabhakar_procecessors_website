import { useEffect, useState } from 'react'
import { resolveDriveUrls } from '../../lib/drive-client'
import { isDriveMediaUrl, resolveDisplayImageUrl } from '../../lib/media-url'

type PreviewKind = 'drive' | 'image' | 'auto'

function isLocalVideoUrl(url: string) {
  return /^\/.+\.(?:mp4|webm)(?:$|\?)/i.test(url.trim())
}

export function AdminMediaPreview({
  src,
  kind = 'auto',
  alt = '',
  className = '',
}: {
  src: string
  kind?: PreviewKind
  alt?: string
  className?: string
}) {
  const trimmed = src.trim()
  if (!trimmed) return null

  const resolvedKind: 'drive' | 'image' | 'local-video' =
    kind === 'auto'
      ? isDriveMediaUrl(trimmed)
        ? 'drive'
        : isLocalVideoUrl(trimmed)
          ? 'local-video'
          : 'image'
      : kind === 'drive'
        ? 'drive'
        : isLocalVideoUrl(trimmed)
          ? 'local-video'
          : 'image'

  return (
    <div
      className={`relative w-28 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-cream-dark shadow-[0_1px_3px_rgba(45,27,14,0.06)] sm:w-36 ${className}`}
      style={{ aspectRatio: '4 / 5' }}
    >
      {resolvedKind === 'drive' ? (
        <DrivePreview src={trimmed} alt={alt} />
      ) : resolvedKind === 'local-video' ? (
        <LocalVideoPreview src={trimmed} alt={alt} />
      ) : (
        <ImagePreview src={resolveDisplayImageUrl(trimmed)} alt={alt} />
      )}
    </div>
  )
}

function ImagePreview({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (failed) {
    return <Unavailable />
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}

function LocalVideoPreview({ src, alt }: { src: string; alt: string }) {
  const [mode, setMode] = useState<'poster' | 'video' | 'unavailable'>('poster')
  const urls = resolveDriveUrls(src)
  const posterSrc = urls.thumbUrl
  const videoSrc = urls.videoUrl || urls.viewUrl || src

  useEffect(() => {
    setMode('poster')
  }, [src])

  if (mode === 'unavailable') {
    return <Unavailable />
  }

  if (mode === 'video') {
    return (
      <video
        src={videoSrc}
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        onLoadedMetadata={(e) => {
          const el = e.currentTarget
          if (el.currentTime < 0.05) el.currentTime = 0.1
        }}
        onError={() => setMode('unavailable')}
      />
    )
  }

  return (
    <img
      src={posterSrc}
      alt={alt}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover"
      onError={() => setMode(videoSrc ? 'video' : 'unavailable')}
    />
  )
}

function DrivePreview({ src, alt }: { src: string; alt: string }) {
  const [mode, setMode] = useState<'image' | 'video' | 'embed' | 'unavailable'>(
    'image',
  )
  const urls = resolveDriveUrls(src)
  const imgSrc = urls.thumbUrl || urls.viewUrl
  const videoSrc = urls.videoUrl || urls.viewUrl
  const preview = urls.previewUrl

  useEffect(() => {
    setMode('image')
  }, [src])

  if (mode === 'unavailable') {
    return <Unavailable />
  }

  if (mode === 'embed') {
    return (
      <iframe
        title={alt || 'Drive preview'}
        src={preview}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        allow="autoplay"
        onError={() => setMode('unavailable')}
      />
    )
  }

  if (mode === 'video' && videoSrc) {
    return (
      <video
        src={videoSrc}
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        onLoadedMetadata={(e) => {
          const el = e.currentTarget
          if (el.currentTime < 0.05) el.currentTime = 0.1
        }}
        onError={() => setMode(urls.fileId ? 'embed' : 'unavailable')}
      />
    )
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="absolute inset-0 h-full w-full object-cover"
      onError={() => setMode(videoSrc ? 'video' : urls.fileId ? 'embed' : 'unavailable')}
    />
  )
}

function Unavailable() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-2 text-center">
      <p className="font-sans text-[10px] font-medium leading-snug tracking-[0.06em] text-ink-muted uppercase">
        Preview unavailable
      </p>
    </div>
  )
}
