/** Extract a Google Drive file id from common share URL shapes. */
export function parseDriveFileId(url: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url.trim())
    const host = u.hostname.replace(/^www\./, '')
    if (!host.includes('google.com') && !host.includes('drive.google')) {
      return null
    }
    const fileMatch = u.pathname.match(/\/file\/d\/([^/]+)/)
    if (fileMatch?.[1]) return fileMatch[1]
    const openMatch = u.pathname.match(/\/open/)
    if (openMatch) {
      const id = u.searchParams.get('id')
      if (id) return id
    }
    const idParam = u.searchParams.get('id')
    if (idParam) return idParam
    const uc = u.pathname.match(/\/uc/)
    if (uc) {
      const id = u.searchParams.get('id')
      if (id) return id
    }
  } catch {
    return null
  }
  return null
}

export function drivePreviewUrl(fileId: string) {
  return `https://drive.google.com/file/d/${fileId}/preview`
}

/** Direct-ish image view URL (works when file is shared publicly). */
export function driveViewUrl(fileId: string) {
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

export function driveThumbnailUrl(fileId: string, size = 1600) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`
}

/** Same-origin proxy for a controllable HTML5 <video> player (inline disposition). */
export function driveVideoUrl(fileId: string) {
  return `/api/drive-media?id=${encodeURIComponent(fileId)}`
}

function isLocalMp4(url: string) {
  return /^\/.+\.mp4(?:$|\?)/i.test(url.trim())
}

export function resolveDriveUrls(driveUrl: string) {
  const trimmed = (driveUrl || '').trim()
  if (isLocalMp4(trimmed)) {
    const poster = trimmed.replace(/\.mp4(?:$|\?)/i, '.jpg')
    return {
      fileId: null as string | null,
      previewUrl: trimmed,
      viewUrl: trimmed,
      thumbUrl: poster,
      videoUrl: trimmed,
    }
  }

  const id = parseDriveFileId(trimmed)
  if (!id) {
    return {
      fileId: null as string | null,
      previewUrl: trimmed,
      viewUrl: trimmed,
      thumbUrl: trimmed,
      videoUrl: null as string | null,
    }
  }
  return {
    fileId: id,
    previewUrl: drivePreviewUrl(id),
    viewUrl: driveVideoUrl(id),
    thumbUrl: `${driveVideoUrl(id)}&thumb=1`,
    videoUrl: driveVideoUrl(id),
  }
}

/** Strict Drive file id (alphanumeric, dash, underscore). */
export function isValidDriveFileId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{10,128}$/.test(id)
}

function cookieHeaderFrom(res: Response): string | undefined {
  const anyHeaders = res.headers as Headers & {
    getSetCookie?: () => string[]
  }
  const setCookies =
    typeof anyHeaders.getSetCookie === 'function'
      ? anyHeaders.getSetCookie()
      : []
  if (!setCookies.length) {
    const single = res.headers.get('set-cookie')
    if (!single) return undefined
    return single.split(';')[0]
  }
  return setCookies.map((c) => c.split(';')[0]).join('; ')
}

function parseConfirmToken(html: string): string | null {
  const patterns = [
    /confirm=([0-9A-Za-z_-]+)/,
    /name="confirm"\s+value="([^"]+)"/,
    /"confirm"\s*,\s*"([^"]+)"/,
  ]
  for (const re of patterns) {
    const m = html.match(re)
    if (m?.[1] && m[1] !== 't') return m[1]
  }
  return 't'
}

async function fetchDriveDownload(
  fileId: string,
  rangeHeader?: string,
  confirm?: string,
  cookie?: string,
): Promise<Response> {
  const url = new URL('https://drive.usercontent.google.com/download')
  url.searchParams.set('id', fileId)
  url.searchParams.set('export', 'download')
  url.searchParams.set('confirm', confirm || 't')

  const headers: Record<string, string> = {
    'User-Agent':
      'Mozilla/5.0 (compatible; PrabhakarProcessorsGallery/1.0)',
  }
  if (rangeHeader) headers.Range = rangeHeader
  if (cookie) headers.Cookie = cookie

  return fetch(url.toString(), {
    headers,
    redirect: 'follow',
  })
}

/**
 * Fetch a publicly shared Drive file as a streamable Response.
 * Handles the virus-scan interstitial once when needed.
 */
export async function fetchDriveMediaStream(
  fileId: string,
  rangeHeader?: string,
): Promise<Response> {
  let res = await fetchDriveDownload(fileId, rangeHeader)
  const contentType = res.headers.get('content-type') || ''

  if (contentType.includes('text/html')) {
    const html = await res.text()
    const confirm = parseConfirmToken(html)
    const cookie = cookieHeaderFrom(res)
    res = await fetchDriveDownload(
      fileId,
      rangeHeader,
      confirm || 't',
      cookie,
    )
  }

  const nextType = res.headers.get('content-type') || ''
  if (!res.ok || nextType.includes('text/html')) {
    throw new Error(
      res.ok
        ? 'Drive returned HTML instead of media (file may not be public)'
        : `Drive download failed (${res.status})`,
    )
  }

  return res
}

const THUMB_UA =
  'Mozilla/5.0 (compatible; PrabhakarProcessorsGallery/1.0)'

async function fetchImageUrl(url: string): Promise<Response | null> {
  const res = await fetch(url, {
    headers: { 'User-Agent': THUMB_UA },
    redirect: 'follow',
  })
  const contentType = res.headers.get('content-type') || ''
  if (!res.ok || contentType.includes('text/html')) return null
  if (!contentType.startsWith('image/') && !contentType.includes('octet-stream')) {
    return null
  }
  return res
}

/** Server-side Drive still/cover image (browser thumbnail URLs are often blocked). */
export async function fetchDriveThumbnailStream(fileId: string): Promise<Response> {
  const id = encodeURIComponent(fileId)
  const candidates = [
    `https://drive.google.com/thumbnail?id=${id}&sz=w400`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w1280`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
    `https://lh3.googleusercontent.com/d/${id}=w400`,
    `https://lh3.googleusercontent.com/d/${id}=w1600`,
  ]
  for (const url of candidates) {
    const image = await fetchImageUrl(url)
    if (image) return image
  }

  throw new Error('Drive thumbnail unavailable (file may not be public)')
}
