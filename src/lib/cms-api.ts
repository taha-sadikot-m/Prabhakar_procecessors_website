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
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }
  const res = await fetch(path, { ...options, headers })
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) {
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

export type GalleryItemDto = {
  id: string
  driveUrl: string
  description: string | null
  previewUrl: string
  viewUrl: string
  thumbUrl: string
  fileId: string | null
}

export type GallerySectionDto = {
  id: string
  title: string
  body: string | null
  items: GalleryItemDto[]
}

export type TestimonialDto = {
  id: string
  type: string
  years: number
  quote: string
}

export function fetchPublicServices() {
  return request<{ categories: ServiceCategoryDto[] }>('/api/services')
}

export function fetchPublicGallery() {
  return request<{ sections: GallerySectionDto[] }>('/api/gallery')
}

export function fetchPublicTestimonials() {
  return request<{ quotes: TestimonialDto[] }>('/api/testimonials')
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

export function adminGetGallery() {
  return request<{
    sections: Array<{
      id: string
      title: string
      body: string | null
      sortOrder: number
      items: Array<{
        id: string
        sectionId: string
        driveUrl: string
        description: string | null
        sortOrder: number
      }>
    }>
  }>('/api/admin/gallery', { auth: true })
}

export function adminSaveGallerySection(
  method: 'POST' | 'PUT',
  body: Record<string, unknown>,
) {
  return request<{ id?: string; ok?: boolean }>(
    `/api/admin/gallery?action=section`,
    { method, auth: true, body: JSON.stringify(body) },
  )
}

export function adminDeleteGallerySection(id: string) {
  return request<{ ok: boolean }>(
    `/api/admin/gallery?action=section&id=${encodeURIComponent(id)}`,
    { method: 'DELETE', auth: true },
  )
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
