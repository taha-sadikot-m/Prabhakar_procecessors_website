/**
 * Seed CMS tables from current static content.
 * Usage: npm run seed:cms  (loads .env via node --env-file)
 * Or:    $env:DATABASE_URL="..."; node scripts/seed-cms.mjs
 */
import { neon } from '@neondatabase/serverless'

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
        id: 'piece-dyeing',
        name: 'Piece Dyeing',
        description:
          'Individual fabric lengths dyed to achieve perfectly uniform colour throughout.',
        image: '/service_section/swatch-01-piece-dyeing.png',
      },
      {
        id: 'solid-dyeing',
        name: 'Solid Dyeing',
        description:
          'Batch dyeing for consistent, high-volume colour application across entire fabric runs.',
        image: '/service_section/swatch-02-solid-dyeing.png',
      },
      {
        id: 'cationic-dyeing',
        name: 'Cationic Dyeing',
        description:
          'Specialised dyeing for synthetic and cationic dyeable fibres, brilliant shades with excellent wash fastness.',
        image: '/service_section/swatch-03-cationic-dyeing.png',
      },
    ],
  },
  {
    id: 'printing',
    title: 'Printing',
    numeral: '02',
    intro:
      'From traditional screens to digital precision, patterns rendered with clarity and scale.',
    sort: 1,
    services: [
      {
        id: 'screen-printing',
        name: 'Screen Printing',
        description:
          'Traditional screen-based printing offering vibrant, durable designs through woven mesh screens.',
        image: '/service_section/swatch-04-screen-printing.png',
      },
      {
        id: 'discharge-printing',
        name: 'Discharge Printing',
        description:
          'Chemical discharge technique for soft-hand, intricate pattern effects with a natural feel.',
        image: '/service_section/swatch-05-discharge-printing.png',
      },
      {
        id: 'digital-printing',
        name: 'Digital Printing',
        description:
          'High-resolution inkjet printing with photographic quality, unlimited colour, and rapid sample development.',
        image: '/service_section/swatch-06-digital-printing.png',
      },
      {
        id: 'rotary-allover',
        name: 'Rotary Allover Print',
        description:
          'Continuous rotary printing for seamless allover patterns at production scale.',
        image: '/service_section/swatch-11-rotary-allover.png',
      },
      {
        id: 'foil-jari',
        name: 'Foil / Jari Print',
        description:
          'Metallic foil and jari accents that add lustre and occasion-wear richness to fabric.',
        image: '/service_section/swatch-12-foil-jari-print.png',
      },
    ],
  },
  {
    id: 'finishing',
    title: 'Finishing',
    numeral: '03',
    intro:
      'The final treatments that define hand-feel, performance, and how fabric behaves in use.',
    sort: 2,
    services: [
      {
        id: 'shearing',
        name: 'Shearing',
        description:
          'Precision surface cutting to produce a clean, smooth fabric finish.',
        image: '/service_section/swatch-07-shearing.png',
      },
      {
        id: 'sueding',
        name: 'Sueding',
        description:
          'Mechanical abrasion finishing that imparts a soft, suede-like texture.',
        image: '/service_section/swatch-08-sueding.png',
      },
      {
        id: 'water-repellency',
        name: 'Water Repellency',
        description:
          'Hydrophobic treatment for moisture-resistant performance in sportswear and outdoor textiles.',
        image: '/service_section/swatch-09-water-repellency.png',
      },
      {
        id: 'soil-release',
        name: 'Soil & Stain Release',
        description:
          'Chemical finish enabling easy removal of stains and soil from fabric.',
        image: '/service_section/swatch-10-soil-release.png',
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
    CREATE TABLE IF NOT EXISTS gallery_sections (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id TEXT PRIMARY KEY,
      section_id TEXT NOT NULL REFERENCES gallery_sections(id) ON DELETE CASCADE,
      drive_url TEXT NOT NULL,
      description TEXT,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
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

  for (const section of gallerySections) {
    await sql`
      INSERT INTO gallery_sections (id, title, body, sort_order)
      VALUES (${section.id}, ${section.title}, ${section.body}, ${section.sort})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        body = EXCLUDED.body,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    `
    for (let i = 0; i < section.items.length; i++) {
      const item = section.items[i]
      const driveUrl = driveFile(item.driveId)
      await sql`
        INSERT INTO gallery_items (id, section_id, drive_url, description, sort_order)
        VALUES (${item.id}, ${section.id}, ${driveUrl}, ${item.description}, ${i})
        ON CONFLICT (id) DO UPDATE SET
          section_id = EXCLUDED.section_id,
          drive_url = EXCLUDED.drive_url,
          description = EXCLUDED.description,
          sort_order = EXCLUDED.sort_order,
          updated_at = NOW()
      `
    }
  }
  console.log(`Gallery seeded (${gallerySections.length} sections)`)

  console.log('Done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
