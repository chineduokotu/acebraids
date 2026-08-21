export const fallbackCategories = [
  { _id: 'cat-1', name: 'Ready-to-Install Boho Crochet Extensions', slug: 'ready-to-install-boho-crochet-extensions' },
  { _id: 'cat-2', name: 'Premium Boho Ponytail Extensions', slug: 'premium-boho-ponytail-extensions' },
  { _id: 'cat-3', name: 'Premium Braided Wigs', slug: 'premium-braided-wigs' },
  { _id: 'cat-4', name: 'Exquisite Cap Braided Wigs', slug: 'exquisite-cap-braided-wigs' },
];

export const fallbackProducts = [
  {
    _id: 'prod-blondie',
    name: 'BLONDI MERO',
    slug: 'blondi-mero',
    category: { name: 'Premium Braided Wigs', slug: 'premium-braided-wigs' },
    description: 'Ultra-melt HD Lace unit with radiant sun-kissed bohemian curls and feather-light knotless micro-braids.',
    details: [
      'Ultra-thin Invisible HD Lace for a flawless, natural hairline melt',
      'Pre-plucked natural hairline with bleached micro-knots for maximum realism',
      'Infused with silky, tangle-resistant bohemian curls',
      'Ultra-lightweight cap structure with adjustable elastic support band',
      '100% glueless installation — ready to wear straight out of the box'
    ],
    hairCareTips: [
      'Apply light curl mousse to define and revive curls',
      'Protect with a satin bonnet overnight'
    ],
    price: 110.00,
    discountPrice: 110.00,
    isFeatured: true,
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 42,
    images: [
      { url: '/uploads/IMG_6920.PNG', alt: 'BLONDI MERO unit front view', isMain: true },
      { url: '/uploads/IMG_6917_2.PNG', alt: 'BLONDI MERO side view' },
      { url: '/uploads/IMG_4065.PNG', alt: 'BLONDI MERO HD lace texture' },
    ],
    videos: [
      { url: '/uploads/BlonDie.mp4', posterUrl: '/uploads/IMG_6920.PNG', type: 'video/mp4' }
    ],
    variants: [
      { label: 'Honey Blonde Mix / 30 Inch', color: 'Honey Blonde Mix', length: '30 Inch', capSize: 'Medium (22.5")', stock: 14, sku: 'ABB-BLM-30-M' },
      { label: 'Honey Blonde Mix / 34 Inch', color: 'Honey Blonde Mix', length: '34 Inch', capSize: 'Medium (22.5")', stock: 8, sku: 'ABB-BLM-34-M' },
      { label: '1B/27 Ombre / 28 Inch', color: '1B/27 Ombre', length: '28 Inch', capSize: 'Medium (22.5")', stock: 6, sku: 'ABB-BLM-28-M' },
    ]
  },
  {
    _id: 'prod-naomi',
    name: 'WIG NAOMI',
    slug: 'wig-naomi',
    category: { name: 'Exquisite Cap Braided Wigs', slug: 'exquisite-cap-braided-wigs' },
    description: 'Premium HD Lace frontal with masterfully crafted cornrows and lush bohemian curls on a breathable glueless cap.',
    details: [
      'Premium HD Lace frontal offering an invisible, melted hairline',
      'Glueless secure fit with inner silicone grip band and adjustable straps',
      'Masterfully braided with durable, feather-light luxury fibers',
      'Zero glue or gel required — salon-ready in seconds',
      'Includes signature Ace satin protective storage bag'
    ],
    hairCareTips: [
      'Finger comb curls with a drop of argan oil',
      'Air dry thoroughly after light cleansing'
    ],
    price: 110.00,
    discountPrice: 110.00,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 36,
    images: [
      { url: '/uploads/IMG_6917_2.PNG', alt: 'WIG NAOMI front view', isMain: true },
      { url: '/uploads/IMG_6241.PNG', alt: 'WIG NAOMI detail' },
      { url: '/uploads/IMG_4065.PNG', alt: 'WIG NAOMI HD lace interior' },
    ],
    videos: [
      { url: '/uploads/naomi.mp4', posterUrl: '/uploads/IMG_6917_2.PNG', type: 'video/mp4' }
    ],
    variants: [
      { label: '1B Natural Black / 28 Inch', color: '1B Natural Black', length: '28 Inch', capSize: 'Medium (22.5")', stock: 16, sku: 'ABB-WNM-1B-28-M' },
      { label: '1B/30 Ombre Caramel / 28 Inch', color: '1B/30 Ombre Caramel', length: '28 Inch', capSize: 'Medium (22.5")', stock: 9, sku: 'ABB-WNM-30-28-M' },
      { label: '1B Natural Black / 32 Inch', color: '1B Natural Black', length: '32 Inch', capSize: 'Medium (22.5")', stock: 5, sku: 'ABB-WNM-1B-32-M' },
    ]
  },
  {
    _id: 'prod-laura',
    name: 'WIG LAURA',
    slug: 'wig-laura',
    category: { name: 'Exquisite Cap Braided Wigs', slug: 'exquisite-cap-braided-wigs' },
    description: 'High-definition HD Lace base with classic full front fringe bangs and voluminous bouncy bohemian curls.',
    details: [
      'High-definition HD Lace base with invisible scalp melt',
      'Neat micro-braided crown transitioning into a chic front fringe',
      'Ultra-soft, bouncy shoulder-length bohemian curls',
      '100% glueless cap with secure adjustable elastic band',
      'Feather-light density that eliminates neck strain'
    ],
    hairCareTips: [
      'Fluff curls gently with fingers using a light curl mousse',
      'Sleep in a satin bonnet to preserve bounce'
    ],
    price: 110.00,
    discountPrice: 110.00,
    isFeatured: true,
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 28,
    images: [
      { url: '/uploads/IMG_6920.PNG', alt: 'WIG LAURA front view', isMain: true },
      { url: '/uploads/IMG_6241.PNG', alt: 'WIG LAURA texture detail' }
    ],
    variants: [
      { label: '1B Natural Black / 14 Inch Bob', color: '1B Natural Black', length: '14 Inch', capSize: 'Medium (22.5")', stock: 12, sku: 'ABB-WGL-1B-14-M' },
      { label: '1B Natural Black / 16 Inch Bob', color: '1B Natural Black', length: '16 Inch', capSize: 'Medium (22.5")', stock: 8, sku: 'ABB-WGL-1B-16-M' }
    ]
  },
  {
    _id: 'prod-jay',
    name: 'WIG JAY',
    slug: 'wig-jay',
    category: { name: 'Exquisite Cap Braided Wigs', slug: 'exquisite-cap-braided-wigs' },
    description: 'Seamless HD Lace foundation in vibrant autumn copper/auburn tones with fringe bangs and soft bohemian spirals.',
    details: [
      'Invisible HD Lace for a completely natural, melted appearance',
      'Radiant copper/auburn multi-tonal blend with soft root shading',
      'Full front fringe bangs with soft, bouncy bohemian ringlets',
      'Glueless breathable stretch cap with snug silicone grip band',
      'Pre-styled and ready to wear right out of the luxury box'
    ],
    hairCareTips: [
      'Mist with water and leave-in conditioner to refresh waves',
      'Keep stored in the Ace signature satin bag'
    ],
    price: 110.00,
    discountPrice: 110.00,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 34,
    images: [
      { url: '/uploads/IMG_6917_2.PNG', alt: 'WIG JAY front view', isMain: true },
      { url: '/uploads/IMG_6242.PNG', alt: 'WIG JAY curl texture' }
    ],
    variants: [
      { label: '#350 Copper Rust / 14 Inch Bob', color: '#350 Copper Rust', length: '14 Inch', capSize: 'Medium (22.5")', stock: 15, sku: 'ABB-WGJ-350-14-M' },
      { label: '#30 Auburn Brown / 14 Inch Bob', color: '#30 Auburn Brown', length: '14 Inch', capSize: 'Medium (22.5")', stock: 10, sku: 'ABB-WGJ-30-14-M' }
    ]
  }
];

export const fallbackCustomerLooks = [
  {
    _id: 'look-1',
    customerName: '@theglam_babe (London)',
    videoUrl: '/uploads/2b96717a-1b2c-4f17-9375-e1234043a67a.MP4',
    posterUrl: '/uploads/IMG_6920.PNG',
    title: 'Empress Knotless Slay ✨',
    linkedProduct: fallbackProducts[0]
  },
  {
    _id: 'look-2',
    customerName: '@sandra_berlin (Berlin)',
    videoUrl: '/uploads/b0764e66-7500-4cbd-b533-914f75dc8623.MP4',
    posterUrl: '/uploads/IMG_6917_2.PNG',
    title: '90-Min Boho Crochet Install 💕',
    linkedProduct: fallbackProducts[1]
  },
  {
    _id: 'look-3',
    customerName: '@kiki_uk (Manchester)',
    videoUrl: '/uploads/c195b193-6dbf-46d9-a79c-82f19d3c9929.MP4',
    posterUrl: '/uploads/IMG_6242.PNG',
    title: 'High Glam Ponytail Reveal 🔥',
    linkedProduct: fallbackProducts[2]
  },
  {
    _id: 'look-4',
    customerName: '@amina_styles (Birmingham)',
    videoUrl: '/uploads/e7ca4ed1-3213-4d09-94ac-c068c8e06451.MP4',
    posterUrl: '/uploads/IMG_4065.PNG',
    title: 'Glueless Cap Wig Perfection 👑',
    linkedProduct: fallbackProducts[3]
  }
];
