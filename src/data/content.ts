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
  address: {
    lines: [
      'Plot No. 13/14, Block No. 296',
      'Village Tatithaiyya, Opp. Hotel Horizon Kadodara',
      'Surat–Bardoli Road, Surat, Gujarat – 394327, India',
    ],
  },
}

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Careers', href: '/careers' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
]

export const hero = {
  eyebrow: 'Fabric of India. Processed to Perfection.',
  headline: ['Flowing through process.', 'Delivering'],
  highlight: 'perfection.',
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
  body: 'For over seventeen years, we’ve transformed raw textiles into premium fabrics trusted by leading brands across India—guided by precision, craftsmanship, and consistency.',
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
    'Follow a single piece of fabric through our manufacturing journey—from raw grey cloth to finished delivery.',
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
  cta: 'See Our Capabilities',
  ctaHref: '/about#capabilities',
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
  cta: 'Meet The Team',
  ctaHref: '/about#leadership',
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

/* ——— Inner pages ——— */

export const aboutPage = {
  eyebrow: 'About Us',
  headline: 'Quality Is The Foundation Of Everything We Do.',
  intro: [
    'At Prabhakar Processors, we believe that every fabric tells a story of quality, craftsmanship, and innovation. As one of Surat’s trusted textile processing companies, we specialize in delivering premium dyeing and printing solutions that meet the evolving needs of the textile industry.',
    'Since 2009, we have been committed to transforming fabrics with precision, consistency, and excellence. Backed by modern processing technology, skilled professionals, and a customer-first approach, we provide reliable textile processing solutions that combine superior quality with timely delivery.',
    'Over the years, we have earned the trust of textile manufacturers, garment exporters, wholesalers, and fashion brands by delivering dependable processing services and building long-term business relationships based on integrity and performance.',
  ],
  vision: {
    title: 'Our Vision',
    body: 'To become one of India’s most trusted and innovative textile processing companies by delivering world-class dyeing and printing solutions that set new standards in quality, reliability, and customer satisfaction. We aspire to drive sustainable growth through advanced technology, continuous innovation, and long-term partnerships while contributing to the success of the global textile industry.',
  },
  mission: {
    title: 'Our Mission',
    items: [
      'To deliver premium-quality dyeing and printing solutions that consistently exceed customer expectations.',
      'To maintain the highest standards of quality, precision, and consistency in every stage of textile processing.',
      'To invest in modern technology and continuous process improvement for enhanced productivity and efficiency.',
      'To build long-term relationships with our customers through trust, transparency, and timely delivery.',
      'To create a safe, responsible, and growth-oriented workplace for our employees.',
      'To promote sustainable manufacturing practices that minimize environmental impact while maximizing value for our customers and stakeholders.',
    ],
  },
  stats: [
    { value: '17+', label: 'Years of Experience' },
    { value: '350K', label: 'Metres Dyeing / Day' },
    { value: '250K', label: 'Metres Printing / Day' },
    { value: '850+', label: 'Skilled Employees' },
  ],
  leadership: {
    title: 'Leadership Team',
    body: 'Guided by experience, stewardship, and a shared commitment to craftsmanship.',
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
  usp: {
    title: 'End-To-End Solutions',
    body: 'We provide complete textile processing solutions designed to meet the diverse needs of our customers — from grey fabric collection to finished delivery.',
    items: [
      {
        title: 'Grey Fabric Pickup',
        description:
          'Convenient pickup of grey fabric from customers and textile markets.',
      },
      {
        title: 'Fabric Dyeing',
        description:
          'High-quality dyeing with consistent shades, superior finish, and strict quality control.',
      },
      {
        title: 'Fabric Printing',
        description:
          'Premium printing solutions with precision, vibrant colors, and excellent fabric appearance.',
      },
      {
        title: 'Quality Inspection',
        description:
          'Thorough quality checks at every stage to ensure flawless finished fabrics.',
      },
      {
        title: 'Finished Fabric Delivery',
        description:
          'Safe and timely delivery of processed fabric to customers.',
      },
      {
        title: 'Customer Support',
        description:
          'Dedicated support for production updates, order tracking, and after-sales assistance.',
      },
      {
        title: 'Bulk Order Processing',
        description:
          'Efficient handling of both small and large-volume textile processing requirements.',
      },
      {
        title: 'Customized Textile Solutions',
        description:
          'Processing services tailored to customer specifications and business requirements.',
      },
    ],
  },
  capabilities: {
    title: 'Core Capabilities',
    body: 'Our strength lies in delivering reliable, high-quality, and customer-focused textile processing solutions.',
    items: [
      'Complete textile processing solutions — from grey pickup to finished delivery',
      'High production capacity with consistent quality',
      'Advanced dyeing & printing expertise',
      'Strict quality assurance at every stage',
      'On-time delivery through planned operations',
      'Customer-centric support and transparent communication',
      'Experienced workforce of 850+ skilled professionals',
      'Reliable supply chain for pickup, processing, and delivery',
      'Continuous improvement in technology and process efficiency',
    ],
  },
}

export const servicesPage = {
  eyebrow: 'Our Services',
  headline: 'The Swatch Book.',
  body: 'A comprehensive portfolio of dyeing, printing, and finishing — each service crafted with the same precision we bring to every metre.',
  backgrounds: {
    ikat: '/service_section/bg-ikat-texture.png',
    jali: '/service_section/bg-jali-lattice.png',
  },
  categories: [
    {
      id: 'dyeing',
      title: 'Dyeing',
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
            'Specialised dyeing for synthetic and cationic dyeable fibres — brilliant shades with excellent wash fastness.',
          image: '/service_section/swatch-03-cationic-dyeing.png',
        },
      ],
    },
    {
      id: 'printing',
      title: 'Printing',
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
}

export const careersPage = {
  eyebrow: 'Careers',
  headline: 'Grow With A Team That Values Craft.',
  body: 'At Prabhakar Processors, we are committed to creating a workplace where employees feel valued, supported, and empowered to grow.',
  benefits: {
    title: 'Employee Benefits & Facilities',
    items: [
      'Competitive Salary & Timely Payments',
      'Employee Provident Fund (PF)',
      'ESIC Benefits',
      'Paid Leave & Holidays',
      'Safe & Healthy Working Environment',
      'Comfortable Working Environment',
      'Modern Machinery & Advanced Equipment',
      'Standard Company Uniform',
      'Employee Welfare & Safety Measures',
      'Professional Training & Skill Development',
      'Advanced SOPs & Training',
      'Monthly Workshops & Learning Programs',
      'Career Growth Opportunities',
      'Supportive & Team-Oriented Work Culture',
      'Mess & Canteen Facilities',
      'Complimentary Medical Facilities',
      'Cultural Celebrations & Employee Engagement',
      'Sponsored Education Support for Bright Students',
      'Transportation Assistance (where applicable)',
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
}

export const testimonialsPage = {
  eyebrow: 'Testimonials',
  headline: 'Trusted Partnerships.',
  body: 'Manufacturers, exporters, and brands who value consistency choose Prabhakar Processors for the long term. Client stories will appear here as they are shared with us.',
  placeholders: [
    {
      type: 'Garment Manufacturer',
      years: '14 years',
      quote: 'Colour consistency that keeps our production on schedule.',
    },
    {
      type: 'Fashion Brand',
      years: '9 years',
      quote: 'Every collection, the shades arrive exactly as specified.',
    },
    {
      type: 'Textile Exporter',
      years: '11 years',
      quote: 'International quality without the complexity.',
    },
    {
      type: 'Home Textiles',
      years: '7 years',
      quote: 'The finishing quality transformed our product line.',
    },
  ],
  note: 'Full named testimonials and logos will be published with client permission.',
}

export const contactPage = {
  eyebrow: 'Contact',
  headline: "Let's Start A Conversation.",
  body: 'Grey fabric in. Exceptional cloth out. Reach us by phone, email, or visit our facility in Kadodara, Surat.',
  ctaMailSubject: 'Contact Prabhakar Processors',
}
