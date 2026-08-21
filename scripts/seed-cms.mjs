/**
 * Seed CMS tables from current static content.
 * Usage: npm run seed:cms  (loads .env via node --env-file)
 * Or:    $env:DATABASE_URL="..."; node scripts/seed-cms.mjs
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'

const __dirname = dirname(fileURLToPath(import.meta.url))

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

const sql = neon(url)

const categories = [
  {
    id: 'dyeing',
    title: 'Dyeing',
    numeral: '01',
    intro:
      'Colour engineered for consistency, depth, and lasting brilliance across every batch.',
    sort: 0,
    services: [
      {
        id: 'dyed-finish',
        name: 'Dyed Finish',
        description:
          'Even, lasting colour with a clean finished hand across the full width.',
        image: '/service_section/swatch-01-piece-dyeing.webp',
      },
      {
        id: 'dyed-padding',
        name: 'Dyed Padding / Shaded Dyeing',
        description:
          'Pad dyeing for controlled shade depth, including gradient and shaded effects.',
        image: '/service_section/swatch-02-solid-dyeing.webp',
      },
      {
        id: 'prism',
        name: 'Prism',
        description:
          'Multi-tone prism dyeing that builds dimensional colour across the cloth.',
        image: '/service_section/swatch-03-cationic-dyeing.webp',
      },
      {
        id: 'batik-dyeing',
        name: 'Batik Dyeing',
        description:
          'Resist-dye batik for distinctive pattern and colour boundaries.',
        image: '/service_section/swatch-04-screen-printing.webp',
      },
      {
        id: 'cross-dyeing',
        name: 'Cross Dyeing',
        description:
          'Dual-fibre cross dyeing for two-tone effects in a single bath.',
        image: '/service_section/swatch-02-solid-dyeing.webp',
      },
    ],
  },
  {
    id: 'printing',
    title: 'Printing',
    numeral: '02',
    intro:
      'From discharge and rotary to foil, jari, and hand work, patterns rendered with clarity and scale.',
    sort: 1,
    services: [
      {
        id: 'padding-discharge-print',
        name: 'Padding Discharge Print',
        description:
          'Discharge on a dyed ground for a soft-hand, detailed print.',
        image: '/service_section/swatch-05-discharge-printing.webp',
      },
      {
        id: 'moorga-print',
        name: 'Moorga Print',
        description:
          'Moorga print for distinctive texture and pattern character.',
        image: '/service_section/swatch-04-screen-printing.webp',
      },
      {
        id: 'over-print',
        name: 'Over Print',
        description:
          'Overprinting on dyed or printed grounds for layered colour and motif.',
        image: '/service_section/swatch-06-digital-printing.webp',
      },
      {
        id: 'jari-print',
        name: 'Jari Print',
        description:
          'Metallic jari accents that add occasion-wear richness to fabric.',
        image: '/service_section/swatch-12-foil-jari-print.webp',
      },
      {
        id: 'foil-print',
        name: 'Foil Print',
        description:
          'Foil print for lustre and high-impact metallic highlights.',
        image: '/service_section/swatch-12-foil-jari-print.webp',
      },
      {
        id: 'rotary-allover',
        name: 'Rotary Allover Print',
        description:
          'Continuous rotary printing for seamless allover patterns at production scale.',
        image: '/service_section/swatch-11-rotary-allover.webp',
      },
      {
        id: 'hand-print',
        name: 'Hand Print',
        description:
          'Hand printing for artisan-scale motifs and short runs.',
        image: '/service_section/swatch-07-shearing.webp',
      },
      {
        id: 'flatbed-print',
        name: 'Flatbed Print',
        description:
          'Flatbed printing for precise registration and larger repeat control.',
        image: '/service_section/swatch-08-sueding.webp',
      },
      {
        id: 'pigment-print',
        name: 'Pigment Print',
        description:
          'Pigment printing for vibrant colour with a stable, wash-ready hold.',
        image: '/service_section/swatch-09-water-repellency.webp',
      },
      {
        id: 'spray-print',
        name: 'Spray Print',
        description:
          'Spray print for soft-edge colour and atmospheric effects.',
        image: '/service_section/swatch-10-soil-release.webp',
      },
    ],
  },
]

const testimonials = [
  {
    id: 'garment',
    type: 'Garment Manufacturer',
    years: 14,
    quote: 'Colour consistency that keeps our production on schedule.',
  },
  {
    id: 'fashion',
    type: 'Fashion Brand',
    years: 9,
    quote: 'Every collection, the shades arrive exactly as specified.',
  },
  {
    id: 'exporter',
    type: 'Textile Exporter',
    years: 11,
    quote: 'International quality without the complexity.',
  },
  {
    id: 'home',
    type: 'Home Textiles',
    years: 7,
    quote: 'The finishing quality transformed our product line.',
  },
  {
    id: 'wholesale',
    type: 'Wholesale Trader',
    years: 6,
    quote: 'Volume, speed and quality, all three, consistently.',
  },
  {
    id: 'retail',
    type: 'Premium Retailer',
    years: 5,
    quote: 'Our customers notice the difference. That matters.',
  },
]

function driveFile(id) {
  return `https://drive.google.com/file/d/${id}/view`
}

/** Prefer locally transcoded H.264 when present (see npm run gallery:transcode). */
function galleryMediaUrl(item) {
  return `/gallery-videos/${item.id}.mp4`
}

/** Customer mill-floor Drive videos — folders (Holi/Workshop) are section-only. */
const gallerySections = [
  {
    id: 'stenter',
    title: 'Stenter',
    body: 'Stenter machine runs from the finishing floor.',
    sort: 0,
    items: [
      {
        id: 'stenter-1',
        driveId: '1m2sLnv6_5Bb6Ae70bbCvg2vka4uI-18G',
        description: 'Stenter machine',
      },
      {
        id: 'stenter-2',
        driveId: '163P3BxH8MKjt5XoG3Bypo0o4lbWC_vcZ',
        description: 'Stenter machine',
      },
    ],
  },
  {
    id: 'stitching',
    title: 'Stitching',
    body: 'Stitching on the production floor.',
    sort: 1,
    items: [
      {
        id: 'stitching-1',
        driveId: '1Kuucxn-h8sODj5usVXwH8vnaaYJzeJRV',
        description: 'Stitching',
      },
    ],
  },
  {
    id: 'finishing-gallery',
    title: 'Finishing',
    body: 'Finishing processes that define hand-feel and presentation.',
    sort: 2,
    items: [
      {
        id: 'finishing-gallery-1',
        driveId: '1BVVbT4Oh_cIzCKgb7u0V53x6a4b2UYKE',
        description: 'Finishing',
      },
      {
        id: 'finishing-gallery-2',
        driveId: '1hsax-M2u5XQgqvugvEWNGvL_K4_uT8HX',
        description: 'Finishing',
      },
    ],
  },
  {
    id: 'drum-process',
    title: 'Drum Process',
    body: 'Drum process on the mill floor.',
    sort: 3,
    items: [
      {
        id: 'drum-process-1',
        driveId: '1md-T9lkFqqxK-ocDPnYWwFmytoiyiKhd',
        description: 'Drum process',
      },
    ],
  },
  {
    id: 'packing',
    title: 'Packing',
    body: 'Packed and prepared for safe transport.',
    sort: 4,
    items: [
      {
        id: 'packing-1',
        driveId: '1fGyCeA5REIDP_FW3M8iOvZ5Vx05BXx1Q',
        description: 'Packing',
      },
    ],
  },
  {
    id: 'dispatch',
    title: 'Dispatch',
    body: 'Dispatch from the mill.',
    sort: 5,
    items: [
      {
        id: 'dispatch-1',
        driveId: '1kjB-7OelPV8TzWf5MoXv3dS0zCLgWf4-',
        description: 'Dispatch',
      },
      {
        id: 'dispatch-2',
        driveId: '1bCdim2_-wKmmYbiT4LyQoBJgLjehP20_',
        description: 'Dispatch',
      },
    ],
  },
  {
    id: 'loading',
    title: 'Loading',
    body: 'Loading for outbound delivery.',
    sort: 6,
    items: [
      {
        id: 'loading-1',
        driveId: '1fm_7qeHAS-e6JmGYGFoGpROsEpj1OwHm',
        description: 'Loading',
      },
    ],
  },
  {
    id: 'printing-gallery',
    title: 'Printing',
    body: 'Printing process on the mill floor.',
    sort: 7,
    items: [
      {
        id: 'printing-gallery-1',
        driveId: '1PW0gg3E3F6aFOs-ioG9lr16mYZLa5hnL',
        description: 'Printing process',
      },
      {
        id: 'printing-gallery-2',
        driveId: '1WUgSPdM3kkAEGupDGR8rEGQb2wabvQbI',
        description: 'Printing process',
      },
      {
        id: 'printing-gallery-3',
        driveId: '1TGnQVgTEfKVgh0cDhmNKtiOzdcXxTlQP',
        description: 'Printing process',
      },
    ],
  },
  {
    id: 'checking',
    title: 'Checking',
    body: 'Inspection and checking before dispatch.',
    sort: 8,
    items: [
      {
        id: 'checking-1',
        driveId: '1L49SjO5MT6FDmepRvlg1mYtrPqXVqxoT',
        description: 'Checking',
      },
      {
        id: 'checking-2',
        driveId: '1TUxVXxSMQo30vp4f2TSIr-02l6W1Wswb',
        description: 'Checking',
      },
    ],
  },
  {
    id: 'gate-parking',
    title: 'Gate and Parking',
    body: 'Gate and parking at the mill.',
    sort: 9,
    items: [
      {
        id: 'gate-parking-1',
        driveId: '1hc9cUZ4rMhSQgX0EHgSfP9dWH-9dUqxv',
        description: 'Gate and parking',
      },
      {
        id: 'gate-parking-2',
        driveId: '1kKbWaG0vL5hilfNf7znO_tNREYsOEPrX',
        description: 'Gate and parking',
      },
    ],
  },
  {
    id: 'washing',
    title: 'Washing',
    body: 'Washing on the process floor.',
    sort: 10,
    items: [
      {
        id: 'washing-1',
        driveId: '1Mv1ZpX_nR9ATKyxDGGYqunX6aE5qTV_E',
        description: 'Washing',
      },
    ],
  },
  {
    id: 'holi',
    title: 'Holi',
    body: 'Add individual Drive file links in admin — folder links cannot be listed automatically.',
    sort: 11,
    items: [],
  },
  {
    id: 'workshop',
    title: 'Workshop',
    body: 'Add individual Drive file links in admin — folder links cannot be listed automatically.',
    sort: 12,
    items: [],
  },
]

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS service_categories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      numeral TEXT NOT NULL DEFAULT '',
      intro TEXT NOT NULL DEFAULT '',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS service_cards (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id TEXT PRIMARY KEY,
      drive_url TEXT NOT NULL,
      description TEXT,
      media_type TEXT NOT NULL DEFAULT 'video',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    ALTER TABLE gallery_items
    ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'video'
  `
  const sectionCol = await sql`
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'gallery_items'
      AND column_name = 'section_id'
    LIMIT 1
  `
  if (sectionCol.length > 0) {
    await sql`
      ALTER TABLE gallery_items
      DROP CONSTRAINT IF EXISTS gallery_items_section_id_fkey
    `
    const sectionsTable = await sql`
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'gallery_sections'
      LIMIT 1
    `
    if (sectionsTable.length > 0) {
      await sql`
        WITH ranked AS (
          SELECT
            gi.id,
            ROW_NUMBER() OVER (
              ORDER BY COALESCE(gs.sort_order, 0) ASC, gi.sort_order ASC, gi.id
            ) - 1 AS new_order
          FROM gallery_items gi
          LEFT JOIN gallery_sections gs ON gs.id = gi.section_id
        )
        UPDATE gallery_items gi
        SET sort_order = ranked.new_order
        FROM ranked
        WHERE gi.id = ranked.id
      `
    }
    await sql`ALTER TABLE gallery_items DROP COLUMN IF EXISTS section_id`
  }
  await sql`DROP TABLE IF EXISTS gallery_sections`
  await sql`DROP INDEX IF EXISTS idx_gallery_items_section`
  await sql`
    CREATE INDEX IF NOT EXISTS idx_gallery_items_sort
    ON gallery_items (sort_order)
  `
  await sql`
    CREATE TABLE IF NOT EXISTS culture_images (
      id TEXT PRIMARY KEY,
      drive_url TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT '',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_culture_images_sort
    ON culture_images (sort_order)
  `
  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      partner_type TEXT NOT NULL,
      years INT NOT NULL DEFAULT 0,
      quote TEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS job_applications (
      id TEXT PRIMARY KEY,
      department TEXT NOT NULL,
      city TEXT NOT NULL,
      full_name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL,
      qualification TEXT NOT NULL,
      experience TEXT NOT NULL,
      current_company TEXT NOT NULL DEFAULT '',
      expected_salary TEXT NOT NULL DEFAULT '',
      resume_url TEXT NOT NULL,
      remarks TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      published_at DATE NOT NULL,
      read_minutes INT NOT NULL DEFAULT 5,
      category TEXT NOT NULL DEFAULT '',
      cover_image TEXT NOT NULL DEFAULT '',
      cover_alt TEXT NOT NULL DEFAULT '',
      seo_title TEXT NOT NULL DEFAULT '',
      seo_description TEXT NOT NULL DEFAULT '',
      keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
      sections JSONB NOT NULL DEFAULT '[]'::jsonb,
      cta JSONB,
      published BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_blog_posts_published
      ON blog_posts(published, published_at DESC)
  `
}

async function main() {
  await ensureSchema()
  console.log('Schema applied')

  for (const cat of categories) {
    await sql`
      INSERT INTO service_categories (id, title, numeral, intro, sort_order)
      VALUES (${cat.id}, ${cat.title}, ${cat.numeral}, ${cat.intro}, ${cat.sort})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        numeral = EXCLUDED.numeral,
        intro = EXCLUDED.intro,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    `
    for (let i = 0; i < cat.services.length; i++) {
      const svc = cat.services[i]
      await sql`
        INSERT INTO service_cards (id, category_id, name, description, image_url, sort_order)
        VALUES (${svc.id}, ${cat.id}, ${svc.name}, ${svc.description}, ${svc.image}, ${i})
        ON CONFLICT (id) DO UPDATE SET
          category_id = EXCLUDED.category_id,
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          image_url = EXCLUDED.image_url,
          sort_order = EXCLUDED.sort_order,
          updated_at = NOW()
      `
    }
  }
  const keepCardIds = categories.flatMap((cat) => cat.services.map((s) => s.id))
  const keepCategoryIds = categories.map((cat) => cat.id)
  await sql`
    DELETE FROM service_cards
    WHERE NOT (id = ANY(${keepCardIds}))
  `
  await sql`
    DELETE FROM service_categories
    WHERE NOT (id = ANY(${keepCategoryIds}))
  `
  console.log('Services seeded')

  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i]
    await sql`
      INSERT INTO testimonials (id, partner_type, years, quote, sort_order)
      VALUES (${t.id}, ${t.type}, ${t.years}, ${t.quote}, ${i})
      ON CONFLICT (id) DO UPDATE SET
        partner_type = EXCLUDED.partner_type,
        years = EXCLUDED.years,
        quote = EXCLUDED.quote,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    `
  }
  console.log('Testimonials seeded')

  let galleryIndex = 0
  for (const section of gallerySections) {
    for (const item of section.items) {
      const driveUrl = galleryMediaUrl(item)
      const mediaType = item.mediaType === 'image' ? 'image' : 'video'
      const sortOrder = galleryIndex
      galleryIndex += 1
      await sql`
        INSERT INTO gallery_items (id, drive_url, description, media_type, sort_order)
        VALUES (${item.id}, ${driveUrl}, ${item.description}, ${mediaType}, ${sortOrder})
        ON CONFLICT (id) DO UPDATE SET
          description = EXCLUDED.description,
          media_type = EXCLUDED.media_type,
          sort_order = EXCLUDED.sort_order,
          updated_at = NOW()
      `
    }
  }
  console.log(`Gallery seeded (${galleryIndex} items)`)

  const cultureSeed = [
    {
      id: 'cult-benefit-1',
      driveUrl: '/careers_section/benefit-security.webp',
      caption: 'Security & stability',
      sortOrder: 0,
    },
    {
      id: 'cult-benefit-2',
      driveUrl: '/careers_section/benefit-workplace.webp',
      caption: 'Workplace',
      sortOrder: 1,
    },
    {
      id: 'cult-benefit-3',
      driveUrl: '/careers_section/benefit-learning.webp',
      caption: 'Learning',
      sortOrder: 2,
    },
    {
      id: 'cult-benefit-4',
      driveUrl: '/careers_section/benefit-life.webp',
      caption: 'Life at the mill',
      sortOrder: 3,
    },
  ]
  for (const item of cultureSeed) {
    await sql`
      INSERT INTO culture_images (id, drive_url, caption, sort_order)
      VALUES (${item.id}, ${item.driveUrl}, ${item.caption}, ${item.sortOrder})
      ON CONFLICT (id) DO UPDATE SET
        drive_url = EXCLUDED.drive_url,
        caption = EXCLUDED.caption,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    `
  }
  console.log(`Culture images seeded (${cultureSeed.length} items)`)

  const blogPosts = JSON.parse(
    readFileSync(join(__dirname, 'blog-posts-seed.json'), 'utf8'),
  )
  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i]
    const id = `blog_${post.slug}`
    const keywordsJson = JSON.stringify(post.keywords ?? [])
    const sectionsJson = JSON.stringify(post.sections ?? [])
    const ctaJson = post.cta ? JSON.stringify(post.cta) : null
    await sql`
      INSERT INTO blog_posts (
        id, slug, title, excerpt, published_at, read_minutes, category,
        cover_image, cover_alt, seo_title, seo_description, keywords,
        sections, cta, published, sort_order
      )
      VALUES (
        ${id},
        ${post.slug},
        ${post.title},
        ${post.excerpt},
        ${post.date}::date,
        ${post.readMinutes ?? 5},
        ${post.category ?? ''},
        ${post.coverImage ?? ''},
        ${post.coverAlt ?? ''},
        ${post.seoTitle ?? ''},
        ${post.seoDescription ?? ''},
        ${keywordsJson}::jsonb,
        ${sectionsJson}::jsonb,
        ${ctaJson}::jsonb,
        TRUE,
        ${i}
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        published_at = EXCLUDED.published_at,
        read_minutes = EXCLUDED.read_minutes,
        category = EXCLUDED.category,
        cover_image = EXCLUDED.cover_image,
        cover_alt = EXCLUDED.cover_alt,
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description,
        keywords = EXCLUDED.keywords,
        sections = EXCLUDED.sections,
        cta = EXCLUDED.cta,
        published = EXCLUDED.published,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    `
  }
  console.log(`Blog posts seeded (${blogPosts.length})`)

  console.log('Done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
