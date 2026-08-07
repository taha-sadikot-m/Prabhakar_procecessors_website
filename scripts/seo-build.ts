/**
 * Generates public/sitemap.xml and prerenders blog HTML shells into dist/
 * after vite build so crawlers see titles, meta, and article text.
 *
 * Usage: node --import tsx scripts/seo-build.ts
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { blogPosts } from '../src/data/blogPosts.ts'
import { blogPage, company } from '../src/data/content.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const SITE = company.website.replace(/\/$/, '')

const staticPaths = [
  '/',
  '/about',
  '/services',
  '/careers',
  '/journal',
  '/testimonials',
  '/contact',
  '/blog',
]

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function generateSitemap() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = [
    ...staticPaths.map((path) => ({
      loc: `${SITE}${path === '/' ? '' : path}`,
      lastmod: today,
      priority: path === '/' ? '1.0' : path === '/blog' ? '0.9' : '0.8',
    })),
    ...blogPosts.map((post) => ({
      loc: `${SITE}/blog/${post.slug}`,
      lastmod: (post.updatedAt ?? post.date).slice(0, 10),
      priority: '0.85',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

  const outPublic = join(root, 'public', 'sitemap.xml')
  writeFileSync(outPublic, xml, 'utf8')
  console.log(`Wrote ${outPublic} (${urls.length} urls)`)

  const distSitemap = join(root, 'dist', 'sitemap.xml')
  if (existsSync(join(root, 'dist'))) {
    writeFileSync(distSitemap, xml, 'utf8')
    console.log(`Wrote ${distSitemap}`)
  }
}

function injectHead(
  html: string,
  opts: {
    title: string
    description: string
    canonical: string
    image: string
    imageAlt: string
    type: 'website' | 'article'
    jsonLd: Record<string, unknown> | Record<string, unknown>[]
    bodyHtml: string
    publishedTime?: string
    modifiedTime?: string
  },
) {
  const imageUrl = opts.image.startsWith('http')
    ? opts.image
    : `${SITE}${opts.image}`
  const scripts = Array.isArray(opts.jsonLd) ? opts.jsonLd : [opts.jsonLd]

  const head = `
    <title>${escapeXml(opts.title)}</title>
    <meta name="description" content="${escapeXml(opts.description)}" />
    <link rel="canonical" href="${escapeXml(opts.canonical)}" />
    <meta name="robots" content="index, follow" />
    <meta property="og:site_name" content="${escapeXml(company.name)}" />
    <meta property="og:type" content="${opts.type}" />
    <meta property="og:title" content="${escapeXml(opts.title)}" />
    <meta property="og:description" content="${escapeXml(opts.description)}" />
    <meta property="og:url" content="${escapeXml(opts.canonical)}" />
    <meta property="og:image" content="${escapeXml(imageUrl)}" />
    <meta property="og:image:alt" content="${escapeXml(opts.imageAlt)}" />
    <meta property="og:locale" content="en_IN" />
    ${
      opts.publishedTime
        ? `<meta property="article:published_time" content="${opts.publishedTime}" />`
        : ''
    }
    ${
      opts.modifiedTime
        ? `<meta property="article:modified_time" content="${opts.modifiedTime}" />`
        : ''
    }
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeXml(opts.title)}" />
    <meta name="twitter:description" content="${escapeXml(opts.description)}" />
    <meta name="twitter:image" content="${escapeXml(imageUrl)}" />
    ${scripts
      .map(
        (data) =>
          `<script type="application/ld+json">${JSON.stringify(data)}</script>`,
      )
      .join('\n    ')}
`

  let out = html
  // Replace default title
  out = out.replace(/<title>[^<]*<\/title>/, '')
  // Remove default description if present
  out = out.replace(/<meta\s+name="description"[^>]*>/i, '')
  out = out.replace('</head>', `${head}\n  </head>`)

  // Inject crawlable body content before root (hidden visually but in DOM for crawlers that don't wait for JS)
  const seoBlock = `
    <div id="seo-prerender" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">
      ${opts.bodyHtml}
    </div>`
  out = out.replace('<div id="root"></div>', `${seoBlock}\n    <div id="root"></div>`)

  return out
}

function prerenderBlog() {
  const distIndex = join(root, 'dist', 'index.html')
  if (!existsSync(distIndex)) {
    console.warn('dist/index.html missing; skip prerender (run after vite build)')
    return
  }

  const template = readFileSync(distIndex, 'utf8')

  // Blog index
  const blogIndexLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: blogPage.seoTitle,
    description: blogPage.seoDescription,
    url: `${SITE}/blog`,
    publisher: {
      '@type': 'Organization',
      name: company.name,
      url: SITE,
    },
    blogPost: blogPosts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE}/blog/${p.slug}`,
      datePublished: p.date,
      image: `${SITE}${p.coverImage}`,
    })),
  }

  const indexBody = `
    <h1>${escapeXml(blogPage.headline.join(' '))}</h1>
    <p>${escapeXml(blogPage.body)}</p>
    <ul>
      ${blogPosts
        .map(
          (p) =>
            `<li><a href="/blog/${p.slug}"><strong>${escapeXml(p.title)}</strong></a>: ${escapeXml(p.excerpt)}</li>`,
        )
        .join('\n')}
    </ul>`

  const blogDir = join(root, 'dist', 'blog')
  mkdirSync(blogDir, { recursive: true })
  writeFileSync(
    join(blogDir, 'index.html'),
    injectHead(template, {
      title: blogPage.seoTitle,
      description: blogPage.seoDescription,
      canonical: `${SITE}/blog`,
      image: '/about_section/about-hero-desktop.png',
      imageAlt: 'Prabhakar Processors mill insights',
      type: 'website',
      jsonLd: blogIndexLd,
      bodyHtml: indexBody,
    }),
    'utf8',
  )
  console.log('Prerendered dist/blog/index.html')

  for (const post of blogPosts) {
    const articleLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.seoDescription,
      image: [`${SITE}${post.coverImage}`],
      datePublished: post.date,
      dateModified: post.updatedAt ?? post.date,
      author: {
        '@type': 'Organization',
        name: company.name,
      },
      publisher: {
        '@type': 'Organization',
        name: company.name,
        url: SITE,
      },
      mainEntityOfPage: `${SITE}/blog/${post.slug}`,
      keywords: post.keywords.join(', '),
    }

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${SITE}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `${SITE}/blog/${post.slug}`,
        },
      ],
    }

    const sectionsHtml = post.sections
      .map(
        (s) =>
          `<h2>${escapeXml(s.heading)}</h2>${s.paragraphs.map((p) => `<p>${escapeXml(p)}</p>`).join('')}`,
      )
      .join('\n')

    const bodyHtml = `
      <nav><a href="/">Home</a> / <a href="/blog">Blog</a> / ${escapeXml(post.title)}</nav>
      <article>
        <h1>${escapeXml(post.title)}</h1>
        <p>${escapeXml(post.excerpt)}</p>
        <img src="${escapeXml(post.coverImage)}" alt="${escapeXml(post.coverAlt)}" />
        ${sectionsHtml}
      </article>`

    const postDir = join(blogDir, post.slug)
    mkdirSync(postDir, { recursive: true })
    writeFileSync(
      join(postDir, 'index.html'),
      injectHead(template, {
        title: post.seoTitle,
        description: post.seoDescription,
        canonical: `${SITE}/blog/${post.slug}`,
        image: post.coverImage,
        imageAlt: post.coverAlt,
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.updatedAt ?? post.date,
        jsonLd: [articleLd, breadcrumbLd],
        bodyHtml,
      }),
      'utf8',
    )
    console.log(`Prerendered dist/blog/${post.slug}/index.html`)
  }
}

generateSitemap()
prerenderBlog()
