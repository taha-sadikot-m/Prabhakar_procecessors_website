import { Helmet } from 'react-helmet-async'
import { company } from '../data/content'

const SITE_URL = company.website.replace(/\/$/, '')

type SeoHeadProps = {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  keywords?: string[]
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  noindex?: boolean
}

function absoluteUrl(path: string) {
  if (path.startsWith('http')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function SeoHead({
  title,
  description,
  path,
  image = '/about_section/about-hero-desktop.png',
  imageAlt = 'Prabhakar Processors, dyeing, printing and finishing in Surat',
  type = 'website',
  publishedTime,
  modifiedTime,
  keywords,
  jsonLd,
  noindex = false,
}: SeoHeadProps) {
  const canonical = absoluteUrl(path)
  const imageUrl = absoluteUrl(image)
  const fullTitle = title.includes('Prabhakar')
    ? title
    : `${title} | Prabhakar Processors`

  const scripts = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <link rel="canonical" href={canonical} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      <meta property="og:site_name" content={company.name} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:locale" content="en_IN" />

      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {scripts.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  )
}

export { SITE_URL, absoluteUrl }
