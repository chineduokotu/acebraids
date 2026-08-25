export const fallbackCategories = [
  {
    _id: "cat-1",
    name: "Ready-to-Install Boho Crochet Extensions",
    slug: "ready-to-install-boho-crochet-extensions",
  },
  {
    _id: "cat-2",
    name: "Premium Boho Ponytail Extensions",
    slug: "premium-boho-ponytail-extensions",
  },
  { _id: "cat-3", name: "Premium Braided Wigs", slug: "premium-braided-wigs" },
  {
    _id: "cat-4",
    name: "Exquisite Cap Braided Wigs",
    slug: "exquisite-cap-braided-wigs",
  },
];

export const fallbackProducts = [
  {
    _id: "prod-blondie",
    name: "BLONDI MERO",
    slug: "blondi-mero",
    category: { name: "Premium Braided Wigs", slug: "premium-braided-wigs" },
    description:
      "• 100% Human Hair Base\n• Boho Bouncy with Bangs\n• Lightweight\n• 5x5 Closure\n• Color: Blonde",
    details: [
      "Ultra-thin Invisible HD Lace for a flawless, natural hairline melt",
      "Pre-plucked natural hairline with bleached micro-knots for maximum realism",
      "Infused with silky, tangle-resistant bohemian curls",
      "Ultra-lightweight cap structure with adjustable elastic support band",
      "100% glueless installation — ready to wear straight out of the box",
    ],
    hairCareTips: [
      "Apply light curl mousse to define and revive curls",
      "Protect with a satin bonnet overnight",
    ],
    price: 110.0,
    discountPrice: 110.0,
    isFeatured: true,
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 42,
    images: [
      {
        url: "/uploads/IMG_6920.PNG",
        alt: "BLONDI MERO unit front view",
        isMain: true,
      },
      { url: "/uploads/IMG_6917_2.PNG", alt: "BLONDI MERO side view" },
      { url: "/uploads/IMG_4065.PNG", alt: "BLONDI MERO HD lace texture" },
    ],
    videos: [
      {
        url: "/uploads/BlonDie.mp4",
        posterUrl: "/uploads/IMG_6920.PNG",
        type: "video/mp4",
      },
    ],
    variants: [
      {
        label: "Honey Blonde Mix",
        color: "Honey Blonde Mix",
        capSize: 'Medium (22.5")',
        stock: 14,
        sku: "ABB-BLM-1",
      },
      {
        label: "1B/27 Ombre",
        color: "1B/27 Ombre",
        capSize: 'Medium (22.5")',
        stock: 6,
        sku: "ABB-BLM-2",
      },
    ],
  },
  {
    _id: "prod-naomi",
    name: "WIG NAOMI",
    slug: "wig-naomi",
    category: {
      name: "Exquisite Cap Braided Wigs",
      slug: "exquisite-cap-braided-wigs",
    },
    description:
      "• 100% Human Hair Base\n• Boho Bouncy with Bangs\n• Lightweight\n• 5x5 Closure\n• Color: Mixed Brown",
    details: [
      "Premium HD Lace frontal offering an invisible, melted hairline",
      "Glueless secure fit with inner silicone grip band and adjustable straps",
      "Masterfully braided with durable, feather-light luxury fibers",
      "Zero glue or gel required — salon-ready in seconds",
      "Includes signature Ace satin protective storage bag",
    ],
    hairCareTips: [
      "Finger comb curls with a drop of argan oil",
      "Air dry thoroughly after light cleansing",
    ],
    price: 110.0,
    discountPrice: 110.0,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 36,
    images: [
      {
        url: "/uploads/IMG_6917_2.PNG",
        alt: "WIG NAOMI front view",
        isMain: true,
      },
      { url: "/uploads/IMG_6241.PNG", alt: "WIG NAOMI detail" },
      { url: "/uploads/IMG_4065.PNG", alt: "WIG NAOMI HD lace interior" },
    ],
    videos: [
      {
        url: "/uploads/naomi.mp4",
        posterUrl: "/uploads/IMG_6917_2.PNG",
        type: "video/mp4",
      },
    ],
    variants: [
      {
        label: "1B Natural Black",
        color: "1B Natural Black",
        capSize: 'Medium (22.5")',
        stock: 16,
        sku: "ABB-WNM-1B-M",
      },
      {
        label: "1B/30 Ombre Caramel",
        color: "1B/30 Ombre Caramel",
        capSize: 'Medium (22.5")',
        stock: 9,
        sku: "ABB-WNM-30-M",
      },
    ],
  },
  {
    _id: "prod-laurel",
    name: "WIG LAUREL",
    slug: "wig-laurel",
    category: {
      name: "Exquisite Cap Braided Wigs",
      slug: "exquisite-cap-braided-wigs",
    },
    description:
      "• 100% Human Hair Base\n• Boho Bouncy with Bangs\n• Lightweight\n• 5x5 Closure\n• Color: Black",
    details: [
      "High-definition HD Lace base with invisible scalp melt",
      "Neat micro-braided crown transitioning into a chic front fringe",
      "Ultra-soft, bouncy bohemian curls",
      "100% glueless cap with secure adjustable elastic band",
      "Feather-light density that eliminates neck strain",
    ],
    hairCareTips: [
      "Fluff curls gently with fingers using a light curl mousse",
      "Sleep in a satin bonnet to preserve bounce",
    ],
    price: 110.0,
    discountPrice: 110.0,
    isFeatured: true,
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 28,
    images: [
      {
        url: "/uploads/IMG_6920.PNG",
        alt: "WIG LAUREL front view",
        isMain: true,
      },
      { url: "/uploads/IMG_6241.PNG", alt: "WIG LAUREL texture detail" },
    ],
    variants: [
      {
        label: "1B Natural Black",
        color: "1B Natural Black",
        capSize: 'Medium (22.5")',
        stock: 12,
        sku: "ABB-WGL-1B-M",
      },
    ],
  },
  {
    _id: "prod-jay",
    name: "WIG JAY",
    slug: "wig-jay",
    category: {
      name: "Exquisite Cap Braided Wigs",
      slug: "exquisite-cap-braided-wigs",
    },
    description:
      "• 100% Human Hair Base\n• Boho Bouncy with Bangs\n• Lightweight\n• 5x5 Closure\n• Color: Wine",
    details: [
      "Invisible HD Lace for a completely natural, melted appearance",
      "Radiant copper/auburn multi-tonal blend with soft root shading",
      "Full front fringe bangs with soft, bouncy bohemian ringlets",
      "Glueless breathable stretch cap with snug silicone grip band",
      "Pre-styled and ready to wear right out of the luxury box",
    ],
    hairCareTips: [
      "Mist with water and leave-in conditioner to refresh waves",
      "Keep stored in the Ace signature satin bag",
    ],
    price: 110.0,
    discountPrice: 110.0,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 34,
    images: [
      {
        url: "/uploads/IMG_6917_2.PNG",
        alt: "WIG JAY front view",
        isMain: true,
      },
      { url: "/uploads/IMG_6242.PNG", alt: "WIG JAY curl texture" },
    ],
    variants: [
      {
        label: "#350 Copper Rust",
        color: "#350 Copper Rust",
        capSize: 'Medium (22.5")',
        stock: 15,
        sku: "ABB-WGJ-350-M",
      },
      {
        label: "#30 Auburn Brown",
        color: "#30 Auburn Brown",
        capSize: 'Medium (22.5")',
        stock: 10,
        sku: "ABB-WGJ-30-M",
      },
    ],
  },
  {
    _id: "prod-aneeta-1",
    name: "Wig Aneeta",
    slug: "wig-aneeta-1",
    category: {
      name: "Exquisite Cap Braided Wigs",
      slug: "exquisite-cap-braided-wigs",
    },
    description: "Ready-to-wear braided scarf wig",
    details: [
      "Ready-to-wear braided scarf wig designed for effortless instant styling",
      "Comfortable, breathable stretch fabric scarf attachment with secure fit",
      "Ultra-lightweight hand-crafted braids with natural movement",
      "Zero glue, gel, or lace cutting required — slip on and go in seconds",
      "Includes signature Ace satin protective storage bag",
    ],
    hairCareTips: [
      "Hand wash scarf band gently with mild detergent and air dry",
      "Store in satin bag to keep braids neat and tangle-free",
    ],
    price: 19.99,
    discountPrice: 19.99,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 18,
    images: [],
    videos: [
      {
        url: "/uploads/aneeta.mp4",
        type: "video/mp4",
      },
    ],
    variants: [
      {
        label: "Natural Black",
        color: "Natural Black",
        capSize: "Flexible Scarf Fit",
        stock: 20,
        sku: "ABB-WGA-STD-1",
      },
    ],
  },
  {
    _id: "prod-aneeta-2",
    name: "Wig Aneeta",
    slug: "wig-aneeta-2",
    category: {
      name: "Exquisite Cap Braided Wigs",
      slug: "exquisite-cap-braided-wigs",
    },
    description: "Ready-to-wear braided scarf wig",
    details: [
      "Ready-to-wear braided scarf wig designed for effortless instant styling",
      "Comfortable, breathable stretch fabric scarf attachment with secure fit",
      "Ultra-lightweight hand-crafted braids with natural movement",
      "Zero glue, gel, or lace cutting required — slip on and go in seconds",
      "Includes signature Ace satin protective storage bag",
    ],
    hairCareTips: [
      "Hand wash scarf band gently with mild detergent and air dry",
      "Store in satin bag to keep braids neat and tangle-free",
    ],
    price: 19.99,
    discountPrice: 19.99,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 18,
    images: [],
    videos: [
      {
        url: "/uploads/aneeta2.mp4",
        type: "video/mp4",
      },
    ],
    variants: [
      {
        label: "Natural Black",
        color: "Natural Black",
        capSize: "Flexible Scarf Fit",
        stock: 20,
        sku: "ABB-WGA-STD-2",
      },
    ],
  },
  {
    _id: "prod-aneeta-3",
    name: "Wig Aneeta",
    slug: "wig-aneeta-3",
    category: {
      name: "Exquisite Cap Braided Wigs",
      slug: "exquisite-cap-braided-wigs",
    },
    description: "Ready-to-wear braided scarf wig",
    details: [
      "Ready-to-wear braided scarf wig designed for effortless instant styling",
      "Comfortable, breathable stretch fabric scarf attachment with secure fit",
      "Ultra-lightweight hand-crafted braids with natural movement",
      "Zero glue, gel, or lace cutting required — slip on and go in seconds",
      "Includes signature Ace satin protective storage bag",
    ],
    hairCareTips: [
      "Hand wash scarf band gently with mild detergent and air dry",
      "Store in satin bag to keep braids neat and tangle-free",
    ],
    price: 19.99,
    discountPrice: 19.99,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 18,
    images: [],
    videos: [
      {
        url: "/uploads/aneeta3.mp4",
        type: "video/mp4",
      },
    ],
    variants: [
      {
        label: "Natural Black",
        color: "Natural Black",
        capSize: "Flexible Scarf Fit",
        stock: 20,
        sku: "ABB-WGA-STD-3",
      },
    ],
  },
  {
    _id: "prod-tara-1",
    name: "Wig Tara",
    slug: "wig-tara-1",
    category: {
      name: "Exquisite Cap Braided Wigs",
      slug: "exquisite-cap-braided-wigs",
    },
    description: "Ready-to-wear braided cap wig",
    details: [
      "Ready-to-wear braided cap wig tailored for quick, protective daily styling",
      "Breathable, elastic baseball/sun cap base with secure adjustable strap",
      "Feather-light braided extensions seamlessly attached around the perimeter",
      "Zero adhesive needed — beginner-friendly 30-second wear",
      "Includes signature Ace satin protective storage bag",
    ],
    hairCareTips: [
      "Gently wipe cap interior and air dry after workouts or daily wear",
      "Lightly oil braided strands to maintain sheen and prevent frizz",
    ],
    price: 19.99,
    discountPrice: 19.99,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 22,
    images: [],
    videos: [
      {
        url: "/uploads/wigtara.mp4",
        type: "video/mp4",
      },
    ],
    variants: [
      {
        label: "Natural Black",
        color: "Natural Black",
        capSize: "Adjustable Cap Fit",
        stock: 20,
        sku: "ABB-WGT-STD-1",
      },
    ],
  },
  {
    _id: "prod-tara-2",
    name: "Wig Tara",
    slug: "wig-tara-2",
    category: {
      name: "Exquisite Cap Braided Wigs",
      slug: "exquisite-cap-braided-wigs",
    },
    description: "Ready-to-wear braided cap wig",
    details: [
      "Ready-to-wear braided cap wig tailored for quick, protective daily styling",
      "Breathable, elastic baseball/sun cap base with secure adjustable strap",
      "Feather-light braided extensions seamlessly attached around the perimeter",
      "Zero adhesive needed — beginner-friendly 30-second wear",
      "Includes signature Ace satin protective storage bag",
    ],
    hairCareTips: [
      "Gently wipe cap interior and air dry after workouts or daily wear",
      "Lightly oil braided strands to maintain sheen and prevent frizz",
    ],
    price: 19.99,
    discountPrice: 19.99,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 22,
    images: [],
    videos: [
      {
        url: "/uploads/wigtara2.mp4",
        type: "video/mp4",
      },
    ],
    variants: [
      {
        label: "Natural Black",
        color: "Natural Black",
        capSize: "Adjustable Cap Fit",
        stock: 20,
        sku: "ABB-WGT-STD-2",
      },
    ],
  },
  {
    _id: "prod-tara-3",
    name: "Wig Tara",
    slug: "wig-tara-3",
    category: {
      name: "Exquisite Cap Braided Wigs",
      slug: "exquisite-cap-braided-wigs",
    },
    description: "Ready-to-wear braided cap wig",
    details: [
      "Ready-to-wear braided cap wig tailored for quick, protective daily styling",
      "Breathable, elastic baseball/sun cap base with secure adjustable strap",
      "Feather-light braided extensions seamlessly attached around the perimeter",
      "Zero adhesive needed — beginner-friendly 30-second wear",
      "Includes signature Ace satin protective storage bag",
    ],
    hairCareTips: [
      "Gently wipe cap interior and air dry after workouts or daily wear",
      "Lightly oil braided strands to maintain sheen and prevent frizz",
    ],
    price: 19.99,
    discountPrice: 19.99,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewsCount: 22,
    images: [],
    videos: [
      {
        url: "/uploads/wigtara3.mp4",
        type: "video/mp4",
      },
    ],
    variants: [
      {
        label: "Natural Black",
        color: "Natural Black",
        capSize: "Adjustable Cap Fit",
        stock: 20,
        sku: "ABB-WGT-STD-3",
      },
    ],
  },
  {
    _id: "prod-chioma-1",
    name: "Wig Chioma",
    slug: "wig-chioma",
    category: {
      name: "Exquisite Cap Braided Wigs",
      slug: "exquisite-cap-braided-wigs",
    },
    description: "Ready-to-wear braided bucket cap wig",
    details: [
      "Ready-to-wear braided bucket cap wig combining trendy streetwear with instant glam",
      "Built-in structured bucket hat base for all-day comfort and sun protection",
      "Lightweight, neatly braided extensions securely integrated into the rim",
      "100% glueless installation — ready to wear straight out of the box",
      "Includes signature Ace protective storage bag",
    ],
    hairCareTips: [
      "Spot clean bucket cap exterior with a damp cloth",
      "Store inside satin bag to retain shape",
    ],
    price: 19.99,
    discountPrice: 19.99,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 15,
    images: [],
    videos: [
      {
        url: "/uploads/wigchioma.mp4",
        type: "video/mp4",
      },
    ],
    variants: [
      {
        label: "Natural Black",
        color: "Natural Black",
        capSize: "Universal Bucket Fit",
        stock: 20,
        sku: "ABB-WGC-STD",
      },
    ],
  },
];

export const fallbackCustomerLooks = [
  {
    _id: "look-1",
    customerName: "@theglam_babe (London)",
    videoUrl: "/uploads/shop1.MP4",
    title: "Empress Knotless Slay ✨",
    linkedProduct: fallbackProducts[0],
  },
  {
    _id: "look-2",
    customerName: "@sandra_berlin (Berlin)",
    videoUrl: "/uploads/shop2.MP4",
    title: "90-Min Boho Crochet Install 💕",
    linkedProduct: fallbackProducts[1],
  },
  {
    _id: "look-3",
    customerName: "@kiki_uk (Manchester)",
    videoUrl: "/uploads/shop3.MP4",
    title: "High Glam Ponytail Reveal 🔥",
    linkedProduct: fallbackProducts[2],
  },
  {
    _id: "look-4",
    customerName: "@amina_styles (Birmingham)",
    videoUrl: "/uploads/shop4.MP4",
    title: "Glueless Cap Wig Perfection 👑",
    linkedProduct: fallbackProducts[3],
  },
];
