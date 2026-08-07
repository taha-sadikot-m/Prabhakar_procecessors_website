export type BeholdMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | string

export type BeholdMediaSize = {
  width: number
  height: number
  mediaUrl: string
}

export type BeholdPost = {
  id: string
  caption?: string
  prunedCaption?: string
  permalink: string
  timestamp: string
  likeCount?: number
  commentsCount?: number
  mediaType: BeholdMediaType
  mediaUrl?: string
  thumbnailUrl?: string
  sizes?: {
    small?: BeholdMediaSize
    medium?: BeholdMediaSize
    large?: BeholdMediaSize
    full?: BeholdMediaSize
  }
  children?: BeholdPost[]
  visibility?: string
}

export type BeholdFeed = {
  username: string
  biography?: string
  profilePictureUrl?: string
  website?: string
  followersCount?: number
  followsCount?: number
  hashtags?: string[]
  posts: BeholdPost[]
}

export type PostKind = 'image' | 'video' | 'carousel'

export async function fetchBeholdFeed(
  url: string,
  signal?: AbortSignal,
): Promise<BeholdFeed> {
  const res = await fetch(url, { cache: 'no-store', signal })
  if (!res.ok) {
    throw new Error(`Feed request failed (${res.status})`)
  }
  const data = (await res.json()) as BeholdFeed
  if (!data || !Array.isArray(data.posts)) {
    throw new Error('Unexpected feed shape')
  }
  return data
}

const VIDEO_EXT = /\.(mp4|mov|m4v|webm|mkv)(\?|$)/i

export function isVideoUrl(url: string | undefined | null): boolean {
  if (!url) return false
  return VIDEO_EXT.test(url)
}

export function postKind(post: BeholdPost): PostKind {
  if (post.mediaType === 'VIDEO') return 'video'
  if (
    post.mediaType === 'CAROUSEL_ALBUM' ||
    (post.children && post.children.length > 1)
  ) {
    return 'carousel'
  }
  return 'image'
}

function sizeCandidates(post: BeholdPost): BeholdMediaSize[] {
  const s = post.sizes
  if (!s) return []
  return [s.medium, s.large, s.small, s.full].filter(
    (x): x is BeholdMediaSize => Boolean(x?.mediaUrl),
  )
}

function firstImageSizeUrl(post: BeholdPost): string | null {
  for (const size of sizeCandidates(post)) {
    if (!isVideoUrl(size.mediaUrl)) return size.mediaUrl
  }
  return null
}

/** Safe still image for <img>; never returns a video file URL. */
export function postPosterUrl(post: BeholdPost): string | null {
  const fromSizes = firstImageSizeUrl(post)
  if (fromSizes) return fromSizes

  if (post.thumbnailUrl && !isVideoUrl(post.thumbnailUrl)) {
    return post.thumbnailUrl
  }

  if (
    post.mediaUrl &&
    !isVideoUrl(post.mediaUrl) &&
    post.mediaType !== 'VIDEO'
  ) {
    return post.mediaUrl
  }

  const children = post.children ?? []
  for (const child of children) {
    if (child.mediaType === 'VIDEO') {
      const childPoster = postPosterUrl(child)
      if (childPoster) return childPoster
      continue
    }
    const childPoster = postPosterUrl(child)
    if (childPoster) return childPoster
  }

  return null
}

/** @deprecated Prefer postPosterUrl for display; kept for callers that need any media URL. */
export function postImageUrl(post: BeholdPost): string | null {
  return postPosterUrl(post)
}

export function postAspectRatio(post: BeholdPost): number {
  const kind = postKind(post)
  for (const size of sizeCandidates(post)) {
    if (size.width > 0 && size.height > 0 && !isVideoUrl(size.mediaUrl)) {
      return size.width / size.height
    }
  }
  for (const size of sizeCandidates(post)) {
    if (size.width > 0 && size.height > 0) {
      return size.width / size.height
    }
  }
  const child = post.children?.find((c) => c.mediaType !== 'VIDEO') ?? post.children?.[0]
  if (child) {
    const childRatio = postAspectRatio(child)
    if (childRatio > 0) return childRatio
  }
  return kind === 'video' ? 9 / 16 : 1
}

export function carouselSlideCount(post: BeholdPost): number {
  if (postKind(post) !== 'carousel') return 0
  return post.children?.length ?? 0
}

/** Up to `limit` poster URLs from carousel children (image slides only). */
export function carouselPosterUrls(post: BeholdPost, limit = 3): string[] {
  if (postKind(post) !== 'carousel') return []
  const urls: string[] = []
  for (const child of post.children ?? []) {
    const url = postPosterUrl(child)
    if (url && !urls.includes(url)) {
      urls.push(url)
      if (urls.length >= limit) break
    }
  }
  const cover = postPosterUrl(post)
  if (cover && urls.length === 0) urls.push(cover)
  return urls
}

export function instagramProfileUrl(username: string) {
  return `https://www.instagram.com/${username}/`
}

export function formatPostDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
