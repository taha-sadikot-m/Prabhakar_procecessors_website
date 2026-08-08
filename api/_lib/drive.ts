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

export function resolveDriveUrls(driveUrl: string) {
  const id = parseDriveFileId(driveUrl)
  if (!id) {
    return {
      fileId: null as string | null,
      previewUrl: driveUrl,
      viewUrl: driveUrl,
      thumbUrl: driveUrl,
    }
  }
  return {
    fileId: id,
    previewUrl: drivePreviewUrl(id),
    viewUrl: driveViewUrl(id),
    thumbUrl: driveThumbnailUrl(id),
  }
}
