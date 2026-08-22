import { getAdminToken } from './admin-auth'

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }
  if (options.auth) {
    const token = getAdminToken()
    if (token) {
      // Send both: some Hostinger/LiteSpeed setups strip Authorization.
      headers.set('Authorization', `Bearer ${token}`)
      headers.set('X-Admin-Token', token)
    }
  }
  const res = await fetch(path, { ...options, headers, cache: 'no-store' })
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(
        data.error || 'Session expired — log in again.',
      )
    }
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

export type ServiceCardDto = {
  id: string
  name: string
  description: string
  image: string
}

export type ServiceCategoryDto = {
  id: string
  title: string
  numeral: string
  intro: string
  services: ServiceCardDto[]
}

export type GalleryMediaType = 'image' | 'video'

export type GalleryItemDto = {
  id: string
  driveUrl: string
  description: string | null
  mediaType: GalleryMediaType
  previewUrl: string
  viewUrl: string
  thumbUrl: string
  fileId: string | null
  videoUrl?: string | null
}

export type AdminGalleryItemDto = {
  id: string
  driveUrl: string
  description: string | null
  mediaType: GalleryMediaType
  sortOrder: number
}

export type CultureImageDto = {
  id: string
  driveUrl: string
  caption: string
  sortOrder: number
  previewUrl: string
  viewUrl: string
  thumbUrl: string
  fileId: string | null
}

export type AdminCultureImageDto = {
  id: string
  driveUrl: string
  caption: string
  sortOrder: number
}

export type TestimonialDto = {
  id: string
  type: string
  years: number
  quote: string
}

export type BlogSectionDto = {
  heading: string
  paragraphs: string[]
}

export type BlogCtaTheme = 'accent' | 'outline' | 'light'

export type BlogCtaDto = {
  headline: string
  body: string
  primaryLabel: string
  primaryHref: string
  primaryTheme?: BlogCtaTheme
  secondaryLabel?: string
  secondaryHref?: string
  secondaryTheme?: BlogCtaTheme
}

export type BlogPostDto = {
  slug: string
  title: string
  excerpt: string
  date: string
  updatedAt?: string
  readMinutes: number
  category: string
  coverImage: string
  coverAlt: string
  seoTitle: string
  seoDescription: string
  keywords: string[]
  sections: BlogSectionDto[]
  cta?: BlogCtaDto
}

export type AdminBlogPostDto = BlogPostDto & {
  id: string
  published: boolean
  sortOrder: number
}

export function fetchPublicServices() {
  return request<{ categories: ServiceCategoryDto[] }>('/api/services')
}

export function fetchPublicGallery() {
  return request<{ items: GalleryItemDto[] }>('/api/gallery')
}

export function fetchPublicCulture() {
  return request<{ items: CultureImageDto[] }>('/api/culture')
}

export function fetchPublicTestimonials() {
  return request<{ quotes: TestimonialDto[] }>('/api/testimonials')
}

export function fetchPublicBlogPosts() {
  return request<{ posts: BlogPostDto[] }>('/api/blog')
}

export function fetchPublicBlogPost(slug: string) {
  return request<{ post: BlogPostDto }>(
    `/api/blog?slug=${encodeURIComponent(slug)}`,
  )
}

export function adminLogin(username: string, password: string) {
  return request<{ token: string }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function adminGetServices() {
  return request<{
    categories: Array<{
      id: string
      title: string
      numeral: string
      intro: string
      sortOrder: number
      services: Array<{
        id: string
        categoryId: string
        name: string
        description: string
        imageUrl: string
        sortOrder: number
      }>
    }>
  }>('/api/admin/services', { auth: true })
}

export function adminSaveCategory(
  method: 'POST' | 'PUT',
  body: Record<string, unknown>,
) {
  return request<{ id?: string; ok?: boolean }>(
    `/api/admin/services?action=category`,
    { method, auth: true, body: JSON.stringify(body) },
  )
}

export function adminDeleteCategory(id: string) {
  return request<{ ok: boolean }>(
    `/api/admin/services?action=category&id=${encodeURIComponent(id)}`,
    { method: 'DELETE', auth: true },
  )
}

export function adminSaveCard(
  method: 'POST' | 'PUT',
  body: Record<string, unknown>,
) {
  return request<{ id?: string; ok?: boolean }>(
    `/api/admin/services?action=card`,
    { method, auth: true, body: JSON.stringify(body) },
  )
}

export function adminDeleteCard(id: string) {
  return request<{ ok: boolean }>(
    `/api/admin/services?action=card&id=${encodeURIComponent(id)}`,
    { method: 'DELETE', auth: true },
  )
}

export async function adminUploadMedia(
  file: File,
  options: {
    id?: string
    folder?: 'services' | 'culture' | 'gallery'
    mediaType?: 'image' | 'video'
  } = {},
): Promise<{ url: string }> {
  const folder = options.folder ?? 'services'
  const mediaType = options.mediaType ?? 'image'
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Failed to read file'))
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
  return request<{ url: string }>('/api/admin/upload', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({
      dataUrl,
      id: options.id,
      folder,
      mediaType,
    }),
  })
}

/** @deprecated Prefer adminUploadMedia — kept for services/culture call sites. */
export async function adminUploadImage(
  file: File,
  id?: string,
  folder: 'services' | 'culture' | 'gallery' = 'services',
): Promise<{ url: string }> {
  return adminUploadMedia(file, { id, folder, mediaType: 'image' })
}

export function adminGetGallery() {
  return request<{ items: AdminGalleryItemDto[] }>('/api/admin/gallery', {
    auth: true,
  })
}

export function adminSaveGalleryItem(
  method: 'POST' | 'PUT',
  body: Record<string, unknown>,
) {
  return request<{ id?: string; ok?: boolean }>(
    `/api/admin/gallery?action=item`,
    { method, auth: true, body: JSON.stringify(body) },
  )
}

export function adminDeleteGalleryItem(id: string) {
  return request<{ ok: boolean }>(
    `/api/admin/gallery?action=item&id=${encodeURIComponent(id)}`,
    { method: 'DELETE', auth: true },
  )
}

export function adminGetCulture() {
  return request<{ items: AdminCultureImageDto[] }>('/api/admin/culture', {
    auth: true,
  })
}

export function adminSaveCultureItem(
  method: 'POST' | 'PUT',
  body: Record<string, unknown>,
) {
  return request<{ id?: string; ok?: boolean }>(
    `/api/admin/culture?action=item`,
    { method, auth: true, body: JSON.stringify(body) },
  )
}

export function adminDeleteCultureItem(id: string) {
  return request<{ ok: boolean }>(
    `/api/admin/culture?action=item&id=${encodeURIComponent(id)}`,
    { method: 'DELETE', auth: true },
  )
}

export function adminGetTestimonials() {
  return request<{
    quotes: Array<TestimonialDto & { sortOrder: number }>
  }>('/api/admin/testimonials', { auth: true })
}

export function adminSaveTestimonial(
  method: 'POST' | 'PUT',
  body: Record<string, unknown>,
) {
  return request<{ id?: string; ok?: boolean }>('/api/admin/testimonials', {
    method,
    auth: true,
    body: JSON.stringify(body),
  })
}

export function adminDeleteTestimonial(id: string) {
  return request<{ ok: boolean }>(
    `/api/admin/testimonials?id=${encodeURIComponent(id)}`,
    { method: 'DELETE', auth: true },
  )
}

export function adminGetBlogPosts() {
  return request<{ posts: AdminBlogPostDto[] }>('/api/admin/blog', {
    auth: true,
  })
}

export function adminSaveBlogPost(
  method: 'POST' | 'PUT',
  body: Record<string, unknown>,
) {
  return request<{ id?: string; ok?: boolean }>('/api/admin/blog', {
    method,
    auth: true,
    body: JSON.stringify(body),
  })
}

export function adminDeleteBlogPost(id: string) {
  return request<{ ok: boolean }>(
    `/api/admin/blog?id=${encodeURIComponent(id)}`,
    { method: 'DELETE', auth: true },
  )
}

export type JobApplicationDto = {
  id: string
  department: string
  city: string
  fullName: string
  mobile: string
  email: string
  qualification: string
  experience: string
  currentCompany: string
  expectedSalary: string
  resumeUrl: string
  remarks: string
  createdAt: string
}

export type ContactMessageDto = {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  createdAt: string
}

export function submitJobApplication(body: Record<string, unknown>) {
  return request<{ ok: boolean; id: string }>('/api/careers', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function adminGetJobApplications() {
  return request<{ applications: JobApplicationDto[] }>(
    '/api/admin/careers',
    { auth: true },
  )
}

export function adminDeleteJobApplication(id: string) {
  return request<{ ok: boolean }>(
    `/api/admin/careers?id=${encodeURIComponent(id)}`,
    { method: 'DELETE', auth: true },
  )
}

export function adminGetContactMessages() {
  return request<{ messages: ContactMessageDto[] }>('/api/admin/contact', {
    auth: true,
  })
}

export function adminDeleteContactMessage(id: string) {
  return request<{ ok: boolean }>(
    `/api/admin/contact?id=${encodeURIComponent(id)}`,
    { method: 'DELETE', auth: true },
  )
}
