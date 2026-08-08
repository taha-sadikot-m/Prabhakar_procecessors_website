export const company = {
  name: 'Prabhakar Processors',
  legalName: 'Prabhakar Processors Pvt Ltd',
  since: 2009,
  tagline: 'Superb Quality. Remarkable Pricing.',
  phone: '+91 9909970505',
  email: 'prabhakardyeing@gmail.com',
  website: 'https://prabhakarprocessors.com',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Prabhakar+Processors+Pvt+Ltd+Kadodara+Surat',
  mapsEmbedUrl:
    'https://www.google.com/maps?q=Prabhakar+Processors+Pvt+Ltd+Kadodara+Surat&z=15&output=embed',
  address: {
    lines: [
      'Plot No. 13/14, Block No. 296',
      'Village Tatithaiyya, Opp. Hotel Horizon Kadodara',
      'Surat-Bardoli Road, Surat, Gujarat - 394327, India',
    ],
  },
}

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Careers', href: '/careers' },
  { label: 'Find Us', href: '/journal' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
]

export const hero = {
  eyebrow: 'Fabric of India. Processed to Perfection.',
  headline: ['The Mill that', 'dyes, prints and', 'delivers'],
  highlight: 'quality.',
  subcopy:
    'World-class dyeing, printing and finishing solutions that bring life to every thread.',
  cta: 'Explore Our Services',
  ctaHref: '/services',
  scrollLabel: 'Scroll to Discover',
  scrollHref: '#journey',
}

export const journey = {
  eyebrow: 'Our Journey',
  headline: 'Every Great Fabric Begins With',
  highlight: 'Possibility.',
  body: 'For over seventeen years, we’ve transformed raw textiles into premium fabrics trusted by leading brands across India, guided by precision, craftsmanship, and consistency.',
  commitment: 'Our promise: quality, durability, and finish that exceed expectations.',
  cta: 'Our Story',
  ctaHref: '/about',
  stats: [
    { value: 17, suffix: '+', label: 'Years Experience', position: 'tl' as const },
    { value: 350, suffix: 'K', label: 'Meters Produced Daily', position: 'mr' as const },
    { value: 850, suffix: '+', label: 'Skilled Experts', position: 'bl' as const },
    { value: 700, suffix: '+', label: 'Satisfied Clients', position: 'br' as const },
  ],
}

export const transformation = {
  title: 'Grey to Brilliant.',
  subtitle: 'Under One Roof.',
  intro:
    'Follow a single piece of fabric through our manufacturing journey from raw grey cloth to finished delivery.',
  cta: 'View All Services',
  ctaHref: '/services',
  stages: [
    {
      step: '01',
      label: 'Grey',
      heading: 'Grey Fabric.',
      subheading: 'Full of Potential.',
      description:
        "Every exceptional fabric begins in its simplest form. We collect grey fabric directly from your facility or Surat's textile markets, preparing it for transformation.",
      desktopImage: '/third_section/1_desktop.png',
      mobileImage: '/third_section/1_mobile.png',
    },
    {
      step: '02',
      label: 'Dye',
      heading: '350,000 Metres.',
      subheading: 'Dyed Every Day.',
      description:
        'Piece dyeing. Solid dyeing. Cationic dyeing. Every shade engineered for consistency and lasting brilliance.',
      desktopImage: '/third_section/2_desktop.png',
      mobileImage: '/third_section/2_mobile.png',
    },
    {
      step: '03',
      label: 'Print',
      heading: '250,000 Metres.',
      subheading: 'Printed Every Day.',
      description:
        'Screen. Rotary. Flatbed. Digital. Pigment. Foil. Jari. Prism. Moorga. Every print is crafted with exceptional precision.',
      desktopImage: '/third_section/3_desktop.png',
      mobileImage: '/third_section/3_mobile.png',
    },
    {
      step: '04',
      label: 'Finish',
      heading: 'The Final 1%.',
      subheading: 'Defines Everything.',
      description:
        'Sueding. Shearing. Water repellency. Soil release. The finishing process perfects the texture, performance and feel of every fabric.',
      desktopImage: '/third_section/4_desktop.png',
      mobileImage: '/third_section/4_mobile.png',
    },
    {
      step: '05',
      label: 'Deliver',
      heading: 'Your Fabric.',
      subheading: 'Delivered With Confidence.',
      description:
        'Every roll is carefully inspected, packed and delivered on time because reliability matters as much as craftsmanship.',
      desktopImage: '/third_section/5_desktop.png',
      mobileImage: '/third_section/5_mobile.png',
    },
  ],
}

export const quality = {
  eyebrow: 'Our Quality',
  headline: ['Precision Is Our Process.', 'Excellence Is Our Standard.'],
  body: 'Every metre that leaves Prabhakar Processors carries our commitment to consistency. Shade, print, finish, and inspection are verified so the fabric performs exactly as expected.',
  cta: 'See Our Capabilities',
  ctaHref: '/about#capabilities',
  desktopImage: '/4th_section/desktop.png',
  mobileImage: '/4th_section/mobile.png',
  annotations: [
    {
      id: 'colour',
      title: 'Colour Consistency',
      description:
        'Uniform shades engineered for repeatability across every production batch.',
    },
    {
      id: 'print',
      title: 'Print Precision',
      description: 'Sharp motifs, clean registration and flawless pattern alignment.',
    },
    {
      id: 'surface',
      title: 'Surface Finish',
      description: 'Texture, softness and appearance perfected for every application.',
    },
    {
      id: 'inspection',
      title: 'Quality Inspection',
      description: 'Every fabric roll undergoes thorough inspection before dispatch.',
    },
    {
      id: 'delivery',
      title: 'Reliable Delivery',
      description: 'Processed, packed and delivered with consistency and care.',
    },
  ],
}

export const ecosystem = {
  eyebrow: 'Our Ecosystem',
  headline: ['More Than Processing.', 'A Complete Textile Partner.'],
  body: 'From collecting raw grey fabric to delivering finished textiles ready for production, every stage is managed with precision, reliability and transparency. Our integrated workflow simplifies operations, reduces coordination and ensures your fabric moves efficiently from start to finish.',
  cta: 'Explore Services',
  ctaHref: '/services',
  desktopBackground: '/plain_background/desktop_background.png',
  mobileBackground: '/plain_background/mobile_background.png',
  milestones: [
    {
      id: 'customer',
      name: 'Customer',
      description: 'Your order starts with a conversation.',
    },
    {
      id: 'grey',
      name: 'Grey Collection',
      description: 'We collect raw fabric from your location or market.',
    },
    {
      id: 'dyeing',
      name: 'Dyeing',
      description: '3,50,000 metres transformed daily.',
    },
    {
      id: 'printing',
      name: 'Printing',
      description: '2,50,000 metres printed per day.',
    },
    {
      id: 'finishing',
      name: 'Finishing',
      description: 'Surface perfected for every application.',
    },
    {
      id: 'inspection',
      name: 'Inspection',
      description: 'Every roll checked before it leaves.',
    },
    {
      id: 'packing',
      name: 'Packing',
      description: 'Prepared securely for safe transport.',
    },
    {
      id: 'delivery',
      name: 'Delivery',
      description: 'Back at your door, on time. Every time.',
    },
  ],
}

export const serve = {
  eyebrow: 'Who We Serve',
  headline: ['Crafted For Every', 'Textile Business.'],
  cta: 'Who We Partner With',
  ctaHref: '/testimonials',
  slides: [
    {
      id: 'garment',
      category: 'Garment Manufacturers',
      headline: 'Consistency at Scale.',
      body: 'Reliable production that keeps your manufacturing lines moving without compromise.',
      desktopImage: '/6th_section/desktop_1.png',
      mobileImage: '/6th_section/mobile_1.png',
    },
    {
      id: 'fashion',
      category: 'Fashion Brands',
      headline: 'Colours That Stay True.',
      body: 'Distinctive shades and premium finishes designed to elevate every collection.',
      desktopImage: '/6th_section/desktop_2.png',
      mobileImage: '/6th_section/mobile_2.png',
    },
    {
      id: 'export',
      category: 'Textile Exporters',
      headline: 'Quality That Travels.',
      body: 'Global-quality processing that meets demanding international expectations.',
      desktopImage: '/6th_section/desktop_3.png',
      mobileImage: '/6th_section/mobile_3.png',
    },
    {
      id: 'home',
      category: 'Home Textile Businesses',
      headline: 'Crafted for Everyday Comfort.',
      body: 'Soft textures, lasting colours and refined finishes built for modern living.',
      desktopImage: '/6th_section/desktop_4.png',
      mobileImage: '/6th_section/mobile_4.png',
    },
  ],
}

export const partnerships = {
  eyebrow: 'Trusted By',
  headline: ['Built On Long-Term', 'Partnerships.'],
  body: 'Trusted by manufacturers, exporters and brands who value consistency, reliability and long-term collaboration. Every relationship begins with a single order and grows into something far more enduring.',
  cta: 'Read Testimonials',
  ctaHref: '/testimonials',
  desktopBackground: '/7th_section/desktop_image.png',
  mobileBackground: '/7th_section/mobile_image.png',
  partners: [
    {
      id: 'garment',
      type: 'Garment Manufacturer',
      years: 14,
      quote: 'Colour consistency that keeps our production on schedule.',
      x: 6,
      y: 14,
      rot: -1.5,
      mobileX: 3,
      mobileY: 4,
    },
    {
      id: 'fashion',
      type: 'Fashion Brand',
      years: 9,
      quote: 'Every collection, the shades arrive exactly as specified.',
      x: 40,
      y: 10,
      rot: 1.2,
      mobileX: 54,
      mobileY: 4,
    },
    {
      id: 'exporter',
      type: 'Textile Exporter',
      years: 11,
      quote: 'International quality without the complexity.',
      x: 70,
      y: 24,
      rot: -0.8,
      mobileX: 6,
      mobileY: 34,
    },
    {
      id: 'home',
      type: 'Home Textiles',
      years: 7,
      quote: 'The finishing quality transformed our product line.',
      x: 14,
      y: 56,
      rot: 1.8,
      mobileX: 54,
      mobileY: 34,
    },
    {
      id: 'wholesale',
      type: 'Wholesale Trader',
      years: 6,
      quote: 'Volume, speed and quality, all three, consistently.',
      x: 46,
      y: 64,
      rot: -1.2,
      mobileX: 8,
      mobileY: 66,
    },
    {
      id: 'retail',
      type: 'Premium Retailer',
      years: 5,
      quote: 'Our customers notice the difference. That matters.',
      x: 74,
      y: 58,
      rot: 0.6,
      mobileX: 56,
      mobileY: 68,
    },
  ],
}

export const future = {
  eyebrow: 'Built For Tomorrow',
  headline: 'Innovation In Every Thread.',
  cta: 'Meet The Team',
  ctaHref: '/about#leadership',
  secondaryCta: 'Find Us',
  secondaryHref: '/journal',
  panels: [
    {
      id: 'technology',
      title: 'Modern Technology',
      body: 'Advanced equipment delivering precision at every stage of production, from dye liquor preparation to final fabric inspection.',
      image: '/8th_section/1.png',
    },
    {
      id: 'innovation',
      title: 'Continuous Innovation',
      body: 'Refining processes, adopting new techniques and improving efficiency, so that every batch is better than the last.',
      image: '/8th_section/2.png',
    },
    {
      id: 'responsible',
      title: 'Responsible Manufacturing',
      body: 'Thoughtful production practices focused on resource efficiency and long-term sustainability for every stakeholder.',
      image: '/8th_section/3.png',
    },
  ],
}

export const people = {
  eyebrow: 'Our People',
  headline: ['Meet The People Behind', 'Every Metre.'],
  quote:
    'For us, textile processing isn\'t simply manufacturing. It is the responsibility of transforming every metre entrusted to us into something our customers can confidently build their products upon.',
  attribution: 'Founder, Prabhakar Processors Pvt Ltd',
  cta: 'Join Our Team',
  ctaHref: '/careers',
  desktopImage: '/9th_section/3IN1_desktop.png',
  mobileImage: '/9th_section/3In1_mobile.png',
}

export const closing = {
  eyebrow: "Let's Begin",
  headline: ["Let's Build Something", 'Exceptional Together.'],
  body: 'Grey fabric in. Exceptional cloth out. One company, one commitment, every time. Let\'s start with a conversation.',
  cta: 'Contact Us',
  ctaHref: '/contact',
  secondaryCta: 'Read The Blog',
  secondaryHref: '/blog',
  desktopImage: '/10th_section/desktop.png',
  mobileImage: '/10th_section/mobile.png',
  contacts: [
    {
      label: '+91 99099 70505',
      href: 'tel:+919909970505',
    },
    {
      label: 'prabhakardyeing@gmail.com',
      href: 'mailto:prabhakardyeing@gmail.com',
    },
    {
      label: 'prabhakarprocessors.com',
      href: 'https://prabhakarprocessors.com',
    },
  ],
  address: [
    'Plot No. 13/14, Block No. 296',
    'Village Tatithaiyya, Opp. Hotel Horizon Kadodara',
    'Surat-Bardoli Road · Gujarat - 394327',
  ],
}

/* ——— Inner pages ——— */

export const aboutPage = {
  eyebrow: 'About Us',
  headline: ['Quality Is The Foundation', 'Of Everything We Do.'],
  highlight: 'Foundation',
  positioning:
    'Premium dyeing and printing from Surat, precision, consistency, and trust in every metre since 2009.',
  provenance: 'Since 2009 · Surat, India',
  hero: {
    desktopImage: '/about_section/about-hero-desktop.png',
    mobileImage: '/about_section/about-hero-mobile.png',
  },
  story: {
    eyebrow: 'Our Story',
    title: 'Crafted In Surat. Trusted Across India.',
    body: 'Born in India’s textile capital, Prabhakar Processors transforms grey fabric into finished cloth with modern technology, skilled hands, and a customer-first promise.',
    image: '/about_section/about-heritage.png',
    imageAlt: 'Precision textile machinery and finished fabric detail',
  },
  timeline: [
    {
      year: '2009',
      title: 'Foundation',
      body: 'Established in Surat with a clear commitment to quality dyeing and printing.',
    },
    {
      year: '2014',
      title: 'Capability',
      body: 'Expanded production capacity and specialised finishing expertise.',
    },
    {
      year: '2019',
      title: 'Integration',
      body: 'Unified pickup, processing, inspection, and delivery into one reliable flow.',
    },
    {
      year: 'Today',
      title: 'Partnership',
      body: 'Trusted by manufacturers, exporters, and brands who build on every metre we process.',
    },
  ],
  stats: [
    { value: 17, suffix: '+', label: 'Years of Experience' },
    { value: 350, suffix: 'K', label: 'Metres Dyeing / Day' },
    { value: 250, suffix: 'K', label: 'Metres Printing / Day' },
    { value: 850, suffix: '+', label: 'Skilled Employees' },
  ],
  vision: {
    eyebrow: 'Our Vision',
    quote:
      'To become one of India’s most trusted textile processing companies, setting the standard for quality, reliability, and partnership.',
  },
  principles: [
    {
      id: 'quality',
      title: 'Quality Without Compromise',
      body: 'Shade, print, and finish verified so every metre performs as expected.',
    },
    {
      id: 'technology',
      title: 'Progress Through Technology',
      body: 'Modern equipment and continuous improvement at every processing stage.',
    },
    {
      id: 'trust',
      title: 'Partnerships Built On Trust',
      body: 'Transparent communication and long-term relationships with every customer.',
    },
    {
      id: 'growth',
      title: 'Responsible Growth',
      body: 'Safe workplaces and practices that create lasting value for people and partners.',
    },
  ],
  process: {
    eyebrow: 'How We Work',
    title: 'Grey In. Exceptional Cloth Out.',
    body: 'One connected journey from pickup to delivery, without the friction of fragmented processing.',
    cta: 'Explore Services',
    ctaHref: '/services',
    stages: [
      {
        id: 'pickup',
        title: 'Pickup',
        description: 'Grey fabric collected from markets and customer locations.',
        image: '/about_section/process/stage-pickup.png',
      },
      {
        id: 'dyeing',
        title: 'Dyeing',
        description: 'Consistent shades with controlled liquor and careful finishing.',
        image: '/about_section/process/stage-dyeing.png',
      },
      {
        id: 'printing',
        title: 'Printing',
        description: 'Precise prints with clarity, depth, and lasting colour.',
        image: '/about_section/process/stage-printing.png',
      },
      {
        id: 'inspection',
        title: 'Inspection',
        description: 'Stage-wise checks before fabric leaves our floor.',
        image: '/about_section/process/stage-inspection.png',
      },
      {
        id: 'delivery',
        title: 'Delivery',
        description: 'Finished cloth returned safely and on schedule.',
        image: '/about_section/process/stage-delivery.png',
      },
    ],
  },
  leadership: {
    title: 'Leadership Team',
    body: 'Guided by experience, stewardship, and a shared commitment to craftsmanship.',
    quote:
      'Textile processing isn’t simply manufacturing. It is the responsibility of transforming every metre entrusted to us.',
    attribution: 'Leadership, Prabhakar Processors',
    members: [
      {
        name: 'Anand Poddar',
        role: 'Director',
        image: '/9th_section/Anand Poddar.png',
      },
      {
        name: 'Vikas Poddar',
        role: 'Director',
        image: '/9th_section/Vikas Poddar.png',
      },
      {
        name: 'Shaleen Poddar',
        role: 'Director',
        image: '/9th_section/Shaleen Poddar.png',
      },
    ],
  },
  closing: {
    eyebrow: 'Our Promise',
    headline: ['Built On Trust.', 'Refined By Process.'],
    body: 'One company. One commitment. Every metre.',
    primaryCta: 'Explore Services',
    primaryHref: '/services',
    secondaryCta: 'Read The Blog',
    secondaryHref: '/blog',
    desktopImage: '/about_section/about-closing-desktop.png',
    mobileImage: '/about_section/about-closing-mobile.png',
  },
}

export const servicesPage = {
  eyebrow: 'Our Services',
  headline: ['The', 'Swatch Book.'],
  highlight: 'Swatch',
  body: 'A comprehensive portfolio of dyeing, printing, and finishing, each service crafted with the same precision we bring to every metre.',
  meta: '3 disciplines · 12 core services · 12 on request',
  hero: {
    desktopImage: '/services_section/services-hero-desktop.png',
    mobileImage: '/services_section/services-hero-mobile.png',
  },
  backgrounds: {
    ikat: '/service_section/bg-ikat-texture.png',
    jali: '/service_section/bg-jali-lattice.png',
  },
  categories: [
    {
      id: 'dyeing',
      title: 'Dyeing',
      numeral: '01',
      intro:
        'Colour engineered for consistency, depth, and lasting brilliance across every batch.',
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
  ],
  specs: [
    { value: 350, suffix: 'K', label: 'Metres Dyeing / Day' },
    { value: 250, suffix: 'K', label: 'Metres Printing / Day' },
    { value: 12, suffix: '', label: 'Core Services' },
    { value: 17, suffix: '+', label: 'Years of Experience' },
  ],
  alsoAvailable: {
    title: 'Also Available',
    body: 'Additional finishes and print techniques offered on request.',
    items: [
      'Dyed Finish',
      'Dyed Padding',
      'Batik Dyeing',
      'Cross Dyeing',
      'Padding Discharge Print',
      'Prism',
      'Moorga Print',
      'Over Print',
      'Hand Print',
      'Flatbed Print',
      'Pigment Print',
      'Spray Print',
    ],
  },
  closing: {
    headline: ['Ready To Specify', 'Your Next Run?'],
    body: 'Share your fabric, shade, and volume, we will map the right process.',
    primaryCta: 'Discuss Your Requirements',
    primaryHref: '/contact',
    secondaryCta: 'Read The Blog',
    secondaryHref: '/blog',
    desktopImage: '/services_section/services-closing-desktop.png',
    mobileImage: '/services_section/services-closing-mobile.png',
  },
}

export const galleryPage = {
  hero: {
    desktopImage: '/gallery_section/gallery-hero-desktop.png',
    mobileImage: '/gallery_section/gallery-hero-mobile.png',
  },
}

export const careersPage = {
  eyebrow: 'Careers',
  headline: ['Grow With A Team', 'That Values Craft.'],
  highlight: 'Craft',
  body: 'At Prabhakar Processors, we are committed to creating a workplace where employees feel valued, supported, and empowered to grow.',
  meta: '19 departments · Surat, Gujarat · Since 2009',
  hero: {
    desktopImage: '/careers_section/careers-hero-desktop.png',
    mobileImage: '/careers_section/careers-hero-mobile.png',
  },
  rail: [
    { id: 'benefits', label: 'Benefits' },
    { id: 'culture', label: 'Culture' },
    { id: 'apply', label: 'Apply' },
  ],
  benefits: {
    title: 'Employee Benefits & Facilities',
    body: 'Support that covers how you work, how you grow, and how you belong.',
    groups: [
      {
        id: 'security',
        title: 'Security & Pay',
        image: '/careers_section/benefit-security.png',
        items: [
          'Competitive Salary & Timely Payments',
          'Employee Provident Fund (PF)',
          'ESIC Benefits',
          'Paid Leave & Holidays',
        ],
      },
      {
        id: 'workplace',
        title: 'Workplace & Safety',
        image: '/careers_section/benefit-workplace.png',
        items: [
          'Safe & Healthy Working Environment',
          'Comfortable Working Environment',
          'Modern Machinery & Advanced Equipment',
          'Standard Company Uniform',
          'Employee Welfare & Safety Measures',
        ],
      },
      {
        id: 'learning',
        title: 'Learning & Growth',
        image: '/careers_section/benefit-learning.png',
        items: [
          'Professional Training & Skill Development',
          'Advanced SOPs & Training',
          'Monthly Workshops & Learning Programs',
          'Career Growth Opportunities',
        ],
      },
      {
        id: 'life',
        title: 'Life & Community',
        image: '/careers_section/benefit-life.png',
        items: [
          'Supportive & Team-Oriented Work Culture',
          'Mess & Canteen Facilities',
          'Complimentary Medical Facilities',
          'Cultural Celebrations & Employee Engagement',
          'Sponsored Education Support for Bright Students',
          'Transportation Assistance (where applicable)',
        ],
      },
    ],
  },
  culture: {
    title: 'Company Culture',
    body: 'A great workplace is built on teamwork, learning, appreciation, and celebration.',
    moments: [
      {
        title: 'Holi Celebration',
        description:
          'Celebrating the festival of colours with joy, unity, and team spirit.',
      },
      {
        title: 'Diwali Celebration',
        description:
          'Bringing our entire team together to celebrate success, prosperity, and happiness.',
      },
      {
        title: 'Ganesh Chaturthi',
        description:
          'Honouring traditions and seeking blessings for growth and continued success.',
      },
      {
        title: 'Employee Workshops',
        description:
          'Regular sessions on technical knowledge, professional skills, and workplace safety.',
      },
      {
        title: 'Employee of the Month',
        description:
          'Recognising outstanding performers who demonstrate dedication and excellence.',
      },
      {
        title: 'Prabhakar Premier League',
        description:
          'Our annual cricket tournament promoting teamwork, sportsmanship, and leadership.',
      },
      {
        title: 'Trips & Outings',
        description:
          'Team outings that strengthen relationships and create lasting memories.',
      },
      {
        title: 'Birthday Celebrations',
        description:
          'Making every team member feel valued and part of the Prabhakar family.',
      },
    ],
  },
  form: {
    title: 'Job Application',
    body: 'Interested in joining Prabhakar Processors? Select a department and share your details below.',
    steps: [
      { id: 'role', label: 'Role', title: 'Choose Your Role' },
      { id: 'about', label: 'About You', title: 'Tell Us About You' },
      { id: 'documents', label: 'Documents', title: 'Documents & Notes' },
    ],
    departments: [
      'HR Department',
      'Account Department',
      'Excise & Dispatch Department',
      'Textile Designer',
      'MIS Department',
      'IT Department',
      'Executive Assistant',
      'Office Peon',
      'General Manager',
      'Dyeing Manager',
      'Printing Manager',
      'Dyeing Master',
      'Printing Master',
      'Data Entry Operator',
      'Payment Collection Executive',
      'Field Sales Executive',
      'CRM Executive',
      'Maintenance, Store & Purchase Department',
      'Receptionist',
    ],
  },
  closing: {
    headline: ['Ready To Grow', 'With Us?'],
    body: 'Share your role of interest and we will be in touch.',
    primaryCta: 'Start Application',
    primaryHref: '#apply',
    secondaryCta: 'Email HR',
    texture: '/service_section/bg-ikat-texture.png',
  },
}

export const testimonialsPage = {
  eyebrow: 'Testimonials',
  headline: ['Trusted', 'Partnerships.'],
  highlight: 'Partnerships',
  body: 'Manufacturers, exporters, and brands who value consistency choose Prabhakar Processors for the long term. Relationships measured in years, not orders.',
  meta: '6 partner types · Surat, Gujarat · Since 2009',
  hero: {
    desktopImage: '/partners_section/partners-hero-desktop.png',
    mobileImage: '/partners_section/partners-hero-mobile.png',
  },
  quotes: [
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
  ],
  note: 'Full named testimonials and logos will be published with client permission.',
  closing: {
    headline: ['Ready To Build', 'A Partnership?'],
    body: 'Share your fabric, shade, and volume, we will map the right process.',
    primaryCta: 'Start A Partnership',
    primaryHref: '/contact',
    secondaryCta: 'View Services',
    secondaryHref: '/services',
    texture: '/service_section/bg-ikat-texture.png',
  },
}

export const journalPage = {
  eyebrow: 'Find Us',
  headline: ['Where We', 'Show Up.'],
  highlight: 'Show Up',
  body: 'Follow Prabhakar across our channels. Below, live photos from the mill floor.',
  feedUrl: 'https://feeds.behold.so/BZ8R4J0rUwlTLGYGvmn4',
  socials: [
    {
      id: 'instagram',
      label: 'Instagram',
      href: 'https://www.instagram.com/prabhakar_.processors/',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/prabhakar-processors/',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      href: 'https://www.facebook.com/share/1TyhhH2LDZ/',
    },
  ],
  hero: {
    desktopImage: '/instagram_section/instagram-hero-desktop.png',
    mobileImage: '/instagram_section/instagram-hero-mobile.png',
  },
  closing: {
    headline: ['Follow The', 'Process.'],
    body: 'See the work as it unfolds, dyeing floors, print runs, and the people behind every metre.',
    primaryCta: 'Follow On Instagram',
    secondaryCta: 'Contact Us',
    secondaryHref: '/contact',
    texture: '/service_section/bg-ikat-texture.png',
  },
}

export const blogPage = {
  eyebrow: 'Insights',
  headline: ['Notes From', 'The Mill.'],
  highlight: 'Mill',
  body: 'Process, quality, and partnership, written from the floor for the partners who build on every metre.',
  meta: 'Process · Quality · Partnership',
  seoTitle: 'Textile Insights & Mill Notes | Prabhakar Processors Blog',
  seoDescription:
    'Notes from Prabhakar Processors on dyeing, printing, fabric inspection, and partnership, practical insights from our Surat mill.',
  hero: {
    texture: '/service_section/bg-jali-lattice.png',
    primaryCta: 'Discuss A Requirement',
    primaryHref: '/contact',
    secondaryCta: 'Browse Notes',
    secondaryHref: '#posts',
  },
  featuredCta: 'Read Article',
  closing: {
    headline: ['Have A Brief', 'To Discuss?'],
    body: 'Share your fabric, shade, and volume, we will map the right process.',
    primaryCta: 'Contact Us',
    primaryHref: '/contact',
    secondaryCta: 'View Services',
    secondaryHref: '/services',
    texture: '/service_section/bg-ikat-texture.png',
  },
}

export const contactPage = {
  eyebrow: 'Contact',
  headline: "Let's Start A Conversation.",
  body: 'Grey fabric in. Exceptional cloth out. Reach us by phone, email, or visit our facility in Kadodara, Surat.',
  ctaMailSubject: 'Contact Prabhakar Processors',
  formTitle: 'Send An Enquiry',
  formBody:
    'Tell us about your fabric, process needs, or partnership interest. We will reply shortly.',
  formSuccessEyebrow: 'Message received',
  formSuccessTitle: 'Thank you.',
  formSuccessBody:
    'Your enquiry has been sent. Our team will get back to you soon. For urgent needs, call us directly.',
}
