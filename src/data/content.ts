export const company = {
  name: 'Prabhakar Processors',
  legalName: 'Prabhakar Processors Pvt Ltd',
  since: 2009,
  tagline: 'Superb Quality. Remarkable Pricing.',
  phone: '+91 9909970505',
  email: 'prabhakardyeing@gmail.com',
  website: 'https://prabhakarprocessors.com',
  address: {
    lines: [
      'Plot No. 13/14, Block No. 296',
      'Village Tatithaiyya, Opp. Hotel Horizon Kadodara',
      'Surat–Bardoli Road, Surat, Gujarat – 394327, India',
    ],
  },
}

export const navLinks = [
  { label: 'Our Journey', href: '#journey' },
  { label: 'Transformation', href: '#transformation' },
  { label: 'Quality', href: '#quality' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Who We Serve', href: '#serve' },
  { label: 'Partnerships', href: '#partnerships' },
  { label: 'Built For Tomorrow', href: '#future' },
  { label: 'Our People', href: '#people' },
  { label: 'Contact', href: '#contact' },
]

export const hero = {
  eyebrow: 'Fabric of India. Processed to Perfection.',
  headline: ['Flowing through process.', 'Delivering'],
  highlight: 'perfection.',
  subcopy:
    'World-class dyeing, printing and finishing solutions that bring life to every thread.',
  cta: 'Explore Our Services',
  ctaHref: '#transformation',
  scrollLabel: 'Scroll to Discover',
  scrollHref: '#journey',
}

export const journey = {
  eyebrow: 'Our Journey',
  headline: 'Every Great Fabric Begins With',
  highlight: 'Possibility.',
  body: 'For over seventeen years, we’ve transformed raw textiles into premium fabrics trusted by leading brands across India—guided by precision, craftsmanship, and consistency.',
  commitment: 'Our promise: quality, durability, and finish that exceed expectations.',
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
    'Follow a single piece of fabric through our manufacturing journey—from raw grey cloth to finished delivery.',
  stages: [
    {
      step: '01',
      label: 'Grey',
      heading: 'Grey Fabric.',
      subheading: 'Full of Potential.',
      description:
        "Every exceptional fabric begins in its simplest form. We collect grey fabric directly from your facility or Surat's textile markets, preparing it for transformation.",
      desktopImage: '/third_section/main-process-01-intake-desktop.png',
      mobileImage: '/third_section/main-process-01-intake-mobile.png',
    },
    {
      step: '02',
      label: 'Dye',
      heading: '350,000 Metres.',
      subheading: 'Dyed Every Day.',
      description:
        'Piece dyeing. Solid dyeing. Cationic dyeing. Every shade engineered for consistency and lasting brilliance.',
      desktopImage: '/third_section/main-process-02-dyeing-desktop.png',
      mobileImage: '/third_section/main-process-02-dyeing-mobile.png',
    },
    {
      step: '03',
      label: 'Print',
      heading: '250,000 Metres.',
      subheading: 'Printed Every Day.',
      description:
        'Screen. Rotary. Flatbed. Digital. Pigment. Foil. Jari. Prism. Moorga. Every print is crafted with exceptional precision.',
      desktopImage: '/third_section/main-process-03-printing-desktop.png',
      mobileImage: '/third_section/main-process-03-printing-mobile.png',
    },
    {
      step: '04',
      label: 'Finish',
      heading: 'The Final 1%.',
      subheading: 'Defines Everything.',
      description:
        'Sueding. Shearing. Water repellency. Soil release. The finishing process perfects the texture, performance and feel of every fabric.',
      desktopImage: '/third_section/main-process-04-finishing-desktop.png',
      mobileImage: '/third_section/main-process-04-finishing-mobile.png',
    },
    {
      step: '05',
      label: 'Deliver',
      heading: 'Your Fabric.',
      subheading: 'Delivered With Confidence.',
      description:
        'Every roll is carefully inspected, packed and delivered on time because reliability matters as much as craftsmanship.',
      desktopImage: '/third_section/main-process-05-delivery-desktop.png',
      mobileImage: '/third_section/main-process-05-delivery-mobile.png',
    },
  ],
}

export const quality = {
  eyebrow: 'Our Quality',
  headline: ['Precision Is Our Process.', 'Excellence Is Our Standard.'],
  body: 'Every metre that leaves Prabhakar Processors carries our commitment to consistency. Shade, print, finish, and inspection are verified so the fabric performs exactly as expected.',
  desktopImage: '/4th_section/quality-hero-desktop.png',
  mobileImage: '/4th_section/quality-hero-mobile.png',
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
  slides: [
    {
      id: 'garment',
      category: 'Garment Manufacturers',
      headline: 'Consistency at Scale.',
      body: 'Reliable production that keeps your manufacturing lines moving without compromise.',
      desktopImage: '/6th_section/desktop_1.png',
      mobileImage: '/6th_section/mobile__1.png',
    },
    {
      id: 'fashion',
      category: 'Fashion Brands',
      headline: 'Colours That Stay True.',
      body: 'Distinctive shades and premium finishes designed to elevate every collection.',
      desktopImage: '/6th_section/dektop_2.png',
      mobileImage: '/6th_section/mobile_2.png',
    },
    {
      id: 'export',
      category: 'Textile Exporters',
      headline: 'Quality That Travels.',
      body: 'Global-quality processing that meets demanding international expectations.',
      desktopImage: '/6th_section/dektop_3.png',
      mobileImage: '/6th_section/mobile_3.png',
    },
    {
      id: 'home',
      category: 'Home Textile Businesses',
      headline: 'Crafted for Everyday Comfort.',
      body: 'Soft textures, lasting colours and refined finishes built for modern living.',
      desktopImage: '/6th_section/dektop_4.png',
      mobileImage: '/6th_section/mobile_4.png',
    },
  ],
}

export const partnerships = {
  eyebrow: 'Trusted By',
  headline: ['Built On Long-Term', 'Partnerships.'],
  body: 'Trusted by manufacturers, exporters and brands who value consistency, reliability and long-term collaboration. Every relationship begins with a single order and grows into something far more enduring.',
  desktopBackground: '/7th_section/desktop_image.png',
  mobileBackground: '/7th_section/mobile_image.png',
  partners: [
    {
      id: 'garment',
      type: 'Garment Manufacturer',
      years: 14,
      quote: 'Colour consistency that keeps our production on schedule.',
      x: 8,
      y: 18,
      rot: -1.5,
      mobileX: 4,
      mobileY: 8,
    },
    {
      id: 'fashion',
      type: 'Fashion Brand',
      years: 9,
      quote: 'Every collection, the shades arrive exactly as specified.',
      x: 38,
      y: 12,
      rot: 1.2,
      mobileX: 52,
      mobileY: 6,
    },
    {
      id: 'exporter',
      type: 'Textile Exporter',
      years: 11,
      quote: 'International quality without the complexity.',
      x: 68,
      y: 28,
      rot: -0.8,
      mobileX: 8,
      mobileY: 38,
    },
    {
      id: 'home',
      type: 'Home Textiles',
      years: 7,
      quote: 'The finishing quality transformed our product line.',
      x: 18,
      y: 58,
      rot: 1.8,
      mobileX: 52,
      mobileY: 36,
    },
    {
      id: 'wholesale',
      type: 'Wholesale Trader',
      years: 6,
      quote: 'Volume, speed and quality — all three, consistently.',
      x: 48,
      y: 62,
      rot: -1.2,
      mobileX: 10,
      mobileY: 68,
    },
    {
      id: 'retail',
      type: 'Premium Retailer',
      years: 5,
      quote: 'Our customers notice the difference. That matters.',
      x: 72,
      y: 55,
      rot: 0.6,
      mobileX: 54,
      mobileY: 70,
    },
  ],
}

export const future = {
  eyebrow: 'Built For Tomorrow',
  headline: 'Innovation In Every Thread.',
  panels: [
    {
      id: 'technology',
      title: 'Modern Technology',
      body: 'Advanced equipment delivering precision at every stage of production — from dye liquor preparation to final fabric inspection.',
      image: '/8th_section/1.png',
    },
    {
      id: 'innovation',
      title: 'Continuous Innovation',
      body: 'Refining processes, adopting new techniques and improving efficiency — so that every batch is better than the last.',
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
  attribution: '— Founder, Prabhakar Processors Pvt Ltd',
  desktopImage: '/9th_section/3IN1_desktop.png',
  mobileImage: '/9th_section/3In1_mobile.png',
}

export const closing = {
  eyebrow: "Let's Begin",
  headline: ["Let's Build Something", 'Exceptional Together.'],
  body: 'Grey fabric in. Exceptional cloth out. One company, one commitment, every time. Let\'s start with a conversation.',
  cta: 'Contact Us',
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
    'Surat – Bardoli Road · Gujarat – 394327',
  ],
}
