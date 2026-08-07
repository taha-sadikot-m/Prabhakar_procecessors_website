export type BlogPostCta = {
  headline: string
  body: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
}

export type BlogSection = {
  heading: string
  paragraphs: string[]
}

export type BlogPost = {
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
  sections: BlogSection[]
  cta?: BlogPostCta
}

const posts: BlogPost[] = [
  {
    slug: 'shade-matching-that-holds',
    title: 'Shade Matching That Holds Across The Run',
    excerpt:
      'How we keep colour consistent from lab dip to bulk, so the last metre looks like the first.',
    date: '2026-07-18',
    updatedAt: '2026-07-18',
    readMinutes: 5,
    category: 'Process',
    coverImage: '/about_section/process/stage-dyeing.png',
    coverAlt:
      'Dyeing floor at Prabhakar Processors in Surat, fabric in process for shade-controlled dyeing',
    seoTitle: 'Shade Matching in Textile Dyeing | Prabhakar Processors',
    seoDescription:
      'How Prabhakar Processors keeps shade consistent from lab dip to bulk dyeing in Surat, recipes, mid-run checks, and fabric that holds colour across the run.',
    keywords: [
      'shade matching',
      'textile dyeing Surat',
      'lab dip to bulk',
      'fabric dyeing consistency',
      'Prabhakar Processors',
    ],
    sections: [
      {
        heading: 'Why Shade Consistency Wins Trust',
        paragraphs: [
          'Shade matching is where trust is won or lost. A buyer approves a lab dip, expects the bulk to match, and any drift across thousands of metres becomes a costly conversation on the cutting floor.',
          'In Surat’s dyeing corridor, garment makers and traders depend on mills that can repeat a shade, not approximate it. That is the standard we hold every run to at Prabhakar Processors.',
        ],
      },
      {
        heading: 'From Lab Recipe To Floor Discipline',
        paragraphs: [
          'Every shade starts with a controlled lab recipe. We record liquor ratios, temperature profiles, and dwell times so the approved sample is not a one-off moment, but a repeatable dyeing process.',
          'On the floor, operators work from that recipe with the same instruments used in the lab. Mid-run checks catch drift early. When greige lots vary, as they often do, we adjust with discipline, not guesswork.',
        ],
      },
      {
        heading: 'What Partners Receive',
        paragraphs: [
          'The goal is simple: the first metre and the last metre should read as the same cloth. That consistency is what lets garment makers and traders plan with confidence.',
          'Whether you are specifying a new shade or repeating a proven one, share your fabric, target, and volume, we will map the dyeing path that holds.',
        ],
      },
    ],
    cta: {
      headline: 'Match Your Next Shade',
      body: 'Share your fabric, target shade, and volume, we will map a dyeing path that holds from lab to bulk.',
      primaryLabel: 'Discuss Your Requirements',
      primaryHref: '/contact',
      secondaryLabel: 'View Dyeing Services',
      secondaryHref: '/services',
    },
  },
  {
    slug: 'why-inspection-is-not-optional',
    title: 'Why Final Inspection Is Not Optional',
    excerpt:
      'Defects that escape the mill become problems on the cutting table. Here is how we catch them before dispatch.',
    date: '2026-06-02',
    updatedAt: '2026-06-02',
    readMinutes: 4,
    category: 'Quality',
    coverImage: '/about_section/process/stage-inspection.png',
    coverAlt:
      'Final fabric inspection at Prabhakar Processors before dispatch from Kadodara, Surat',
    seoTitle: 'Fabric Inspection Before Dispatch | Prabhakar Processors',
    seoDescription:
      'Why final fabric inspection is a hard gate at Prabhakar Processors, catching defects in Surat before they reach your cutting table.',
    keywords: [
      'fabric inspection',
      'textile quality control',
      'Surat textile mill',
      'fabric defects',
      'Prabhakar Processors',
    ],
    sections: [
      {
        heading: 'Defects Travel Quietly',
        paragraphs: [
          'Processing can be excellent and still leave fabric that fails at the next stage. Oil marks, crease damage, uneven finish, and weave faults all travel quietly until someone opens a roll on the cutting floor.',
          'By then the cost is no longer only metres, it is delayed lines, rejected lots, and eroded trust between mill and maker.',
        ],
      },
      {
        heading: 'Inspection As A Hard Gate',
        paragraphs: [
          'That is why final inspection sits as a hard gate in our flow, not a courtesy pass. Every lot is reviewed against agreed standards before it leaves Kadodara.',
          'Inspection is also feedback. Patterns we see at the table feed back into dyeing, printing, and finishing. A recurring mark is a process signal, not just a reject line on a sheet.',
        ],
      },
      {
        heading: 'Cloth Ready To Cut',
        paragraphs: [
          'Partners who depend on clean cloth for retail or export deserve fabric that arrives ready to cut. Inspection is how we honour that expectation, metre by metre.',
        ],
      },
    ],
    cta: {
      headline: 'Specify Quality Up Front',
      body: 'Tell us your fabric, end use, and standards, we will process and inspect to the brief you need.',
      primaryLabel: 'Discuss Your Requirements',
      primaryHref: '/contact',
      secondaryLabel: 'View Services',
      secondaryHref: '/services',
    },
  },
  {
    slug: 'printing-with-intent',
    title: 'Printing With Intent: From Artwork To Fabric',
    excerpt:
      'A print is only as good as the handoff between design, screens, and the cloth underneath.',
    date: '2026-04-21',
    updatedAt: '2026-04-21',
    readMinutes: 6,
    category: 'Process',
    coverImage: '/about_section/process/stage-printing.png',
    coverAlt:
      'Textile printing in progress at Prabhakar Processors, artwork translated onto fabric',
    seoTitle: 'Textile Printing From Artwork To Fabric | Prabhakar',
    seoDescription:
      'How Prabhakar Processors turns print artwork into fabric, screens, registration, paste control, and finishing for lasting results in Surat.',
    keywords: [
      'textile printing Surat',
      'fabric printing',
      'screen printing textile',
      'print registration',
      'Prabhakar Processors',
    ],
    sections: [
      {
        heading: 'What Looks Simple From Outside',
        paragraphs: [
          'Printing looks simple from outside the mill: artwork in, patterned fabric out. Inside, every step compounds, registration, paste viscosity, screen tension, fabric preparation, and drying.',
          'A weak handoff at any stage shows on the cloth. That is why we treat the print brief as a production document, not a casual attachment.',
        ],
      },
      {
        heading: 'Brief Clarity Before Screens',
        paragraphs: [
          'Clarity on repeat size, colour count, and fabric type early on prevents expensive corrections once screens are made and liquor is mixed.',
          'On press, operators watch for bleed, misalignment, and shade shift across the width. Small corrections mid-run save large waste. Finishing then locks the print so it survives wash and wear expectations.',
        ],
      },
      {
        heading: 'When Design And Process Align',
        paragraphs: [
          'When design and process speak the same language, the cloth carries the intent of the artwork, not a compromise of it. Share your artwork, fabric, and volume, and we will map the right print path.',
        ],
      },
    ],
    cta: {
      headline: 'Bring Your Next Print Brief',
      body: 'Share artwork, fabric type, and volume, we will map screens, colour, and finishing for a clean run.',
      primaryLabel: 'Discuss Your Requirements',
      primaryHref: '/contact',
      secondaryLabel: 'View Printing Services',
      secondaryHref: '/services',
    },
  },
  {
    slug: 'partnership-over-transactions',
    title: 'Partnership Over Transactions',
    excerpt:
      'The best runs come from shared context, fabric behaviour, end use, and a mill that listens before it dyes.',
    date: '2026-03-08',
    updatedAt: '2026-03-08',
    readMinutes: 4,
    category: 'Partnership',
    coverImage: '/about_section/about-heritage.png',
    coverAlt:
      'Prabhakar Processors heritage and partnership, textile processing mill in Surat since 2009',
    seoTitle: 'Textile Processing Partnership | Prabhakar Processors',
    seoDescription:
      'Why Prabhakar Processors builds long-term dyeing and printing partnerships, shared context on fabric, end use, and process before the first batch.',
    keywords: [
      'textile processing partner',
      'Surat dyeing mill',
      'fabric dyeing partnership',
      'Prabhakar Processors',
      'B2B textile manufacturing',
    ],
    sections: [
      {
        heading: 'A PO Starts A Job. Context Starts A Partnership.',
        paragraphs: [
          'A purchase order can start a job. A partnership starts earlier, with fabric type, end market, shade history, and the realities of volume and timeline.',
          'When we know how a cloth will be cut, stitched, and sold, we process it differently. A retail shirting programme asks for different discipline than a bulk home-textile run.',
        ],
      },
      {
        heading: 'Listening Before The First Batch',
        paragraphs: [
          'Long-standing partners bring that context into every brief. Newer ones benefit when we ask the right questions before the first batch. Either way, the cloth improves when both sides treat the work as shared craft.',
          'Superb quality and remarkable pricing are not slogans here. They are the outcome of process, people, and relationships that last longer than a single delivery.',
        ],
      },
      {
        heading: 'Start The Conversation',
        paragraphs: [
          'If you are looking for a Surat dyeing and printing partner who values consistency as much as capacity, start with a conversation about your fabric and your market.',
        ],
      },
    ],
    cta: {
      headline: 'Ready To Build Something Together?',
      body: 'Share your fabric, shade, and volume, we will map the right process for a lasting partnership.',
      primaryLabel: 'Start A Conversation',
      primaryHref: '/contact',
      secondaryLabel: 'View Services',
      secondaryHref: '/services',
    },
  },
]

export const blogPosts: BlogPost[] = [...posts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
)

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getAdjacentPosts(slug: string): {
  prev: BlogPost | null
  next: BlogPost | null
} {
  const index = blogPosts.findIndex((post) => post.slug === slug)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: blogPosts[index + 1] ?? null,
    next: blogPosts[index - 1] ?? null,
  }
}

/** Flat paragraph list for prerender / excerpts when sections are the source of truth */
export function postBodyText(post: BlogPost): string {
  return post.sections.flatMap((s) => s.paragraphs).join(' ')
}
