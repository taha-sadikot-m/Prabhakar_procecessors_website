import {
  driveThumbnailUrl,
  driveViewUrl,
  parseDriveFileId,
} from './drive-client'

/** Resolve a stored image URL (public path, absolute URL, or Drive share) for <img src>. */
export function resolveDisplayImageUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  const fileId = parseDriveFileId(trimmed)
  if (!fileId) return trimmed
  return driveThumbnailUrl(fileId) || driveViewUrl(fileId)
}

export function isDriveMediaUrl(url: string): boolean {
  return Boolean(parseDriveFileId(url.trim()))
}
