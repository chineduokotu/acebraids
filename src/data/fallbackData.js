export const fallbackCategories = [
  { _id: 'cat-1', name: 'Ready-to-Install Boho Crochet Extensions', slug: 'ready-to-install-boho-crochet-extensions' },
  { _id: 'cat-2', name: 'Premium Boho Ponytail Extensions', slug: 'premium-boho-ponytail-extensions' },
  { _id: 'cat-3', name: 'Premium Braided Wigs', slug: 'premium-braided-wigs' },
  { _id: 'cat-4', name: 'Exquisite Cap Braided Wigs', slug: 'exquisite-cap-braided-wigs' },
];

export const fallbackProducts = [
  {
    _id: 'prod-1',
    name: 'Empress Island Boho Knotless Braided Wig',
    slug: 'empress-island-boho-knotless-braided-wig',
    category: { name: 'Premium Braided Wigs', slug: 'premium-braided-wigs' },
    description: 'Our crown jewel. 100% hand-braided HD swiss lace knotless braids infused with luxury French human hair curls. Ultra-lightweight on the scalp with pre-plucked natural hairline and subtle baby hairs.',
    details: [
      'Full HD Transparent Lace for invisible melt',
      'Pre-plucked natural hairline with bleached micro-knots',
      'Weighs less than 420g — zero neck tension',
      'Comes with adjustable elastic band and inner combs',
      'Tangle-resistant premium human curl blend'
    ],
    hairCareTips: [
      'Apply a lightweight foam mousse weekly to maintain curls',
      'Sleep with a silk or satin bonnet',
      'Wash gently with sulfate-free shampoo in lukewarm water'
    ],
    price: 245.00,
    discountPrice: 219.00,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 38,
    images: [
      { url: '/uploads/IMG_6920.PNG', alt: 'Empress Island Boho Knotless Wig front view', isMain: true },
      { url: '/uploads/IMG_6917_2.PNG', alt: 'Model wearing Boho Knotless Braids' },
      { url: '/uploads/IMG_4065.PNG', alt: 'Scalp lace detail' },
    ],
    videos: [
      { url: '/uploads/2b96717a-1b2c-4f17-9375-e1234043a67a.MP4', posterUrl: '/uploads/IMG_6920.PNG', type: 'video/mp4' }
    ],
    variants: [
      { label: '1B Natural Black / 30 Inch', color: '1B Natural Black', length: '30 Inch', capSize: 'Medium (22.5")', stock: 12, sku: 'ABB-EIB-1B-30-M' },
      { label: '1B/30 Ombre Honey / 30 Inch', color: '1B/30 Ombre Honey', length: '30 Inch', capSize: 'Medium (22.5")', stock: 8, sku: 'ABB-EIB-30-30-M' },
      { label: '1B Natural Black / 36 Inch', color: '1B Natural Black', length: '36 Inch', capSize: 'Medium (22.5")', stock: 5, sku: 'ABB-EIB-1B-36-M' },
      { label: '#27 Golden Glow / 26 Inch', color: '#27 Golden Glow', length: '26 Inch', capSize: 'Small (21.5")', stock: 6, sku: 'ABB-EIB-27-26-S' },
    ]
  },
  {
    _id: 'prod-2',
    name: 'Luxe Goddess Pre-Looped Boho Crochet Packs',
    slug: 'luxe-goddess-pre-looped-boho-crochet-packs',
    category: { name: 'Ready-to-Install Boho Crochet Extensions', slug: 'ready-to-install-boho-crochet-extensions' },
    description: 'Quick, gorgeous, salon-quality crochet braids. Pre-looped and pre-separated with bouncy bohemian ringlets interspersed throughout. Complete your full install in under 90 minutes.',
    details: [
      '6 Packs included in standard bundle (Full Head)',
      'Pre-stretched & pre-looped for effortless latch-hook installation',
      'Silky texture with feather-light density',
      'Long-lasting curl pattern that holds through moisture'
    ],
    hairCareTips: [
      'Separate curls with fingers coated in argan or jojoba oil',
      'Wear a high pineapple with a satin scarf overnight'
    ],
    price: 68.00,
    discountPrice: 59.99,
    isFeatured: true,
    isNewArrival: false,
    rating: 4.8,
    reviewsCount: 64,
    images: [
      { url: '/uploads/IMG_6917_2.PNG', alt: 'Luxe Goddess Boho Crochet Packs', isMain: true },
      { url: '/uploads/IMG_6241.PNG', alt: 'Full install goddess crochet' },
    ],
    videos: [
      { url: '/uploads/b0764e66-7500-4cbd-b533-914f75dc8623.MP4', posterUrl: '/uploads/IMG_6917_2.PNG', type: 'video/mp4' }
    ],
    variants: [
      { label: '1B Natural Black / 24 Inch (6 Packs)', color: '1B Natural Black', length: '24 Inch', capSize: 'N/A', stock: 35, sku: 'ABB-LGC-1B-24' },
      { label: '1B/30 Caramel Swirl / 24 Inch (6 Packs)', color: '1B/30 Caramel Swirl', length: '24 Inch', capSize: 'N/A', stock: 20, sku: 'ABB-LGC-30-24' },
      { label: '99J Burgundy Wine / 28 Inch (6 Packs)', color: '99J Burgundy Wine', length: '28 Inch', capSize: 'N/A', stock: 15, sku: 'ABB-LGC-99J-28' },
    ]
  },
  {
    _id: 'prod-3',
    name: 'Signature Sleek Boho Drawstring Ponytail',
    slug: 'signature-sleek-boho-drawstring-ponytail',
    category: { name: 'Premium Boho Ponytail Extensions', slug: 'premium-boho-ponytail-extensions' },
    description: 'The ultimate high-glam power move. Features micro-braided accents transitioning seamlessly into lush bohemian beach waves. Built-in combs and reinforced drawstring guarantee 24-hour security.',
    details: [
      'Secure dual-comb base + heavy-duty adjustable drawstring',
      'Zero salon appointment required — install in 45 seconds',
      'Silky, natural lustre matching Type 3/4 pressed hair',
      'Lightweight, tangle-free synthetic and human curl blend'
    ],
    hairCareTips: [
      'Gently finger-comb the wavy ends starting from the tips',
      'Store on a wig stand or in the signature Ace satin pouch'
    ],
    price: 75.00,
    discountPrice: 65.00,
    isFeatured: true,
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 29,
    images: [
      { url: '/uploads/IMG_6242.PNG', alt: 'Signature Sleek Boho Ponytail', isMain: true },
      { url: '/uploads/IMG_6920.PNG', alt: 'Ponytail side profile' },
    ],
    videos: [
      { url: '/uploads/c195b193-6dbf-46d9-a79c-82f19d3c9929.MP4', posterUrl: '/uploads/IMG_6242.PNG', type: 'video/mp4' }
    ],
    variants: [
      { label: '1B Natural Black / 26 Inch', color: '1B Natural Black', length: '26 Inch', capSize: 'Universal', stock: 24, sku: 'ABB-SBP-1B-26' },
      { label: '#4 Chocolate Brown / 26 Inch', color: '#4 Chocolate Brown', length: '26 Inch', capSize: 'Universal', stock: 14, sku: 'ABB-SBP-04-26' },
      { label: '#27 Honey Blonde / 30 Inch', color: '#27 Honey Blonde', length: '30 Inch', capSize: 'Universal', stock: 10, sku: 'ABB-SBP-27-30' },
    ]
  },
  {
    _id: 'prod-4',
    name: 'Royal Comfort Full-Cap Cornrow & Curls Wig',
    slug: 'royal-comfort-full-cap-cornrow-curls-wig',
    category: { name: 'Exquisite Cap Braided Wigs', slug: 'exquisite-cap-braided-wigs' },
    description: 'Crafted on a stretch-mesh dome cap with precision-stitched cornrows and flowing curls at the crown and perimeter. No glue, no gel, no edge damage. Ideal for active lifestyles and daily glam.',
    details: [
      'Breathable open-weft stretch cap with silicone grip band',
      'Glueless install with zero tension on delicate edges',
      'Precision neat stitch cornrows that will never unravel',
      'Ready to wear right out of the luxury presentation box'
    ],
    hairCareTips: [
      'Air dry completely after freshening curls',
      'Never spray heavy alcohol-based lacquers directly onto the base'
    ],
    price: 185.00,
    discountPrice: 165.00,
    isFeatured: true,
    isNewArrival: false,
    rating: 4.9,
    reviewsCount: 22,
    images: [
      { url: '/uploads/IMG_4065.PNG', alt: 'Royal Comfort Cap Braided Wig', isMain: true },
      { url: '/uploads/IMG_6917_2.PNG', alt: 'Cap detail and interior' },
    ],
    videos: [
      { url: '/uploads/e7ca4ed1-3213-4d09-94ac-c068c8e06451.MP4', posterUrl: '/uploads/IMG_4065.PNG', type: 'video/mp4' }
    ],
    variants: [
      { label: '1B Natural Black / 28 Inch', color: '1B Natural Black', length: '28 Inch', capSize: 'Medium (22.5")', stock: 16, sku: 'ABB-RCC-1B-28-M' },
      { label: '1B/30 Ombre Caramel / 28 Inch', color: '1B/30 Ombre Caramel', length: '28 Inch', capSize: 'Medium (22.5")', stock: 9, sku: 'ABB-RCC-30-28-M' },
      { label: '1B Natural Black / 28 Inch (Large Cap)', color: '1B Natural Black', length: '28 Inch', capSize: 'Large (23.5")', stock: 7, sku: 'ABB-RCC-1B-28-L' },
    ]
  },
  {
    _id: 'prod-5',
    name: 'Monaco Micro Twist HD Lace Front Wig',
    slug: 'monaco-micro-twist-hd-lace-front-wig',
    category: { name: 'Premium Braided Wigs', slug: 'premium-braided-wigs' },
    description: 'Feather-thin micro Senegalese twists falling effortlessly down the waist. Masterfully hand-tied on a 13x6 HD Swiss Lace frontal for multi-part styling versatility.',
    details: [
      '13x6 Extra-deep parting space for middle and side styling',
      'Over 350+ individual micro twists for extreme realism',
      'Feather-weight design ensuring breathable daily wear'
    ],
    hairCareTips: [
      'Dip twist ends in hot water if needed to restore neat tapered finish'
    ],
    price: 260.00,
    discountPrice: 235.00,
    isFeatured: false,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 17,
    images: [
      { url: '/uploads/IMG_6920.PNG', alt: 'Monaco Micro Twist HD Frontal Wig', isMain: true },
      { url: '/uploads/IMG_6241.PNG', alt: 'Twist texture detail' }
    ],
    variants: [
      { label: '1B Natural Black / 32 Inch', color: '1B Natural Black', length: '32 Inch', capSize: 'Medium (22.5")', stock: 8, sku: 'ABB-MMT-1B-32-M' },
      { label: '#33 Rich Auburn / 32 Inch', color: '#33 Rich Auburn', length: '32 Inch', capSize: 'Medium (22.5")', stock: 4, sku: 'ABB-MMT-33-32-M' }
    ]
  },
  {
    _id: 'prod-6',
    name: 'Sahara Goddess Boho French Curl Braids',
    slug: 'sahara-goddess-boho-french-curl-braids',
    category: { name: 'Ready-to-Install Boho Crochet Extensions', slug: 'ready-to-install-boho-crochet-extensions' },
    description: 'Super silky French curl crochet braids with loose romantic waves. Specially textured to eliminate frizz while giving you maximum volume and movement.',
    details: [
      'Pre-stretched silky fiber with bouncing spiral ends',
      '7-Pack value bundle included',
      'Glossy, healthy sheen'
    ],
    hairCareTips: [
      'Comb through loosely with a wide-tooth comb and leave-in conditioner'
    ],
    price: 72.00,
    discountPrice: 62.00,
    isFeatured: false,
    isNewArrival: true,
    rating: 4.7,
    reviewsCount: 31,
    images: [
      { url: '/uploads/IMG_6917_2.PNG', alt: 'Sahara French Curls Boho Braids', isMain: true },
      { url: '/uploads/IMG_6242.PNG', alt: 'French curls texture' }
    ],
    variants: [
      { label: '1B Natural Black / 26 Inch (7 Packs)', color: '1B Natural Black', length: '26 Inch', capSize: 'N/A', stock: 22, sku: 'ABB-SGB-1B-26' },
      { label: '#27 Champagne Blonde / 26 Inch (7 Packs)', color: '#27 Champagne Blonde', length: '26 Inch', capSize: 'N/A', stock: 11, sku: 'ABB-SGB-27-26' }
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
