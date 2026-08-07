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

export function postImageUrl(post: BeholdPost): string | null {
  if (post.sizes?.medium?.mediaUrl) return post.sizes.medium.mediaUrl
  if (post.sizes?.large?.mediaUrl) return post.sizes.large.mediaUrl
  if (post.sizes?.small?.mediaUrl) return post.sizes.small.mediaUrl
  if (post.mediaUrl) return post.mediaUrl
  if (post.thumbnailUrl) return post.thumbnailUrl
  const child = post.children?.[0]
  if (child) return postImageUrl(child)
  return null
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
