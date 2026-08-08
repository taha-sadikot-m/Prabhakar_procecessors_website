import { useEffect, useState } from 'react'
import { resolveDriveUrls } from '../../lib/drive-client'
import { isDriveMediaUrl, resolveDisplayImageUrl } from '../../lib/media-url'

type PreviewKind = 'drive' | 'image' | 'auto'

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

  const resolvedKind: 'drive' | 'image' =
    kind === 'auto' ? (isDriveMediaUrl(trimmed) ? 'drive' : 'image') : kind

  return (
    <div
      className={`relative w-28 shrink-0 overflow-hidden border border-line bg-cream-dark sm:w-36 ${className}`}
      style={{ aspectRatio: '4 / 5' }}
    >
      {resolvedKind === 'drive' ? (
        <DrivePreview src={trimmed} alt={alt} />
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

function DrivePreview({ src, alt }: { src: string; alt: string }) {
  const [mode, setMode] = useState<'image' | 'embed' | 'unavailable'>('image')
  const urls = resolveDriveUrls(src)
  const imgSrc = urls.thumbUrl || urls.viewUrl
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

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover"
      onError={() => setMode(urls.fileId ? 'embed' : 'unavailable')}
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
