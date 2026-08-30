import { Product, Review, Collection } from "../types";

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Stealth Noir Desk Mat",
    slug: "stealth-noir-desk-mat",
    description: "The ultimate minimal desk mat for modern setups. Featuring a micro-woven surface optimized for both speed and control, finished with seamless non-fray stitched edges.",
    price: 2499,
    compareAtPrice: 2999,
    images: [
      "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=800&h=800",
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800&h=800"
    ],
    category: "Desk Mats",
    collection: "Minimal",
    tags: ["dark", "minimal", "stealth", "setup"],
    rating: 4.9,
    reviewCount: 128,
    featured: true,
    bestseller: true,
    newProduct: false,
    variants: [
      { id: "v1-m", name: "Medium (700x300mm)", price: 1999, available: true, qikinkSku: "MOCK-QIKINK-STEALTH-M" },
      { id: "v1-l", name: "Large (900x400mm)", price: 2499, available: true, qikinkSku: "MOCK-QIKINK-STEALTH-L" },
      { id: "v1-xl", name: "XL (1000x500mm)", price: 2999, available: true, qikinkSku: "MOCK-QIKINK-STEALTH-XL" },
    ],
    specifications: {
      "Material": "Micro-woven cloth",
      "Base": "Anti-slip natural rubber",
      "Thickness": "4mm",
      "Edge": "Premium seamless stitching",
      "Care": "Hand wash with mild soap, air dry"
    }
  },
  {
    id: "p2",
    name: "Cyber Grid Edition",
    slug: "cyber-grid-edition",
    description: "Inspired by retro-futurism and cyberpunk aesthetics. Precision engineered for high-DPI tracking and low friction.",
    price: 2799,
    compareAtPrice: 3299,
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800&h=800",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800&h=800"
    ],
    category: "Desk Mats",
    collection: "Gaming",
    tags: ["cyberpunk", "gaming", "neon", "grid"],
    rating: 4.8,
    reviewCount: 84,
    featured: true,
    bestseller: false,
    newProduct: true,
    variants: [
      { id: "v2-l", name: "Large (900x400mm)", price: 2799, available: true, qikinkSku: "MOCK-QIKINK-CYBER-L" },
      { id: "v2-xl", name: "XL (1200x600mm)", price: 3499, available: false, qikinkSku: "MOCK-QIKINK-CYBER-XL" },
    ],
    specifications: {
      "Material": "Cordura fabric",
      "Base": "Textured rubber",
      "Thickness": "3mm",
      "Edge": "Low-profile stitching",
      "Care": "Wipe with damp cloth"
    }
  },
  {
    id: "p3",
    name: "Carbon Weave Pad",
    slug: "carbon-weave-pad",
    description: "A textured surface mimicking carbon fiber, designed for users who need maximum tactile feedback and control.",
    price: 2199,
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800&h=800"
    ],
    category: "Mouse Pads",
    collection: "Dark Series",
    tags: ["carbon", "textured", "control"],
    rating: 4.6,
    reviewCount: 42,
    featured: false,
    bestseller: false,
    newProduct: false,
    variants: [
      { id: "v3-m", name: "Medium (450x400mm)", price: 2199, available: true, qikinkSku: "MOCK-QIKINK-CARBON-M" },
    ],
    specifications: {
      "Material": "Hybrid textured weave",
      "Base": "Polyurethane (PU)",
      "Thickness": "4mm",
      "Edge": "Flush stitched",
      "Care": "Spot clean only"
    }
  },
  {
    id: "p4",
    name: "Void Space Mat",
    slug: "void-space-mat",
    description: "Deep, absorbing black surface. The Void mat is our darkest, most minimal offering for a truly distraction-free workspace.",
    price: 2599,
    compareAtPrice: 2899,
    images: [
      "https://images.unsplash.com/photo-1533228100845-08145b01de14?auto=format&fit=crop&q=80&w=800&h=800"
    ],
    category: "Desk Mats",
    collection: "Minimal",
    tags: ["black", "void", "minimal"],
    rating: 4.9,
    reviewCount: 215,
    featured: true,
    bestseller: true,
    newProduct: false,
    variants: [
      { id: "v4-l", name: "Large (900x400mm)", price: 2599, available: true, qikinkSku: "MOCK-QIKINK-VOID-L" },
      { id: "v4-xl", name: "XL (1000x500mm)", price: 3099, available: true, qikinkSku: "MOCK-QIKINK-VOID-XL" },
    ],
    specifications: {
      "Material": "Smooth control cloth",
      "Base": "High-density rubber",
      "Thickness": "4mm",
      "Edge": "Hidden stitching",
      "Care": "Machine washable (cold)"
    }
  },
  {
    id: "p5",
    name: "Akira Crimson Edit",
    slug: "akira-crimson-edit",
    description: "Subtle crimson accents on a dark canvas, inspired by classic neo-Tokyo anime aesthetics. Perfect for striking setups.",
    price: 2899,
    images: [
      "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800&h=800"
    ],
    category: "Desk Mats",
    collection: "Anime Inspired",
    tags: ["red", "dark", "anime", "tokyo"],
    rating: 4.7,
    reviewCount: 67,
    featured: false,
    bestseller: false,
    newProduct: true,
    variants: [
      { id: "v5-l", name: "Large (900x400mm)", price: 2899, available: true, qikinkSku: "MOCK-QIKINK-AKIRA-L" },
    ],
    specifications: {
      "Material": "Speed cloth",
      "Base": "Natural rubber",
      "Thickness": "3mm",
      "Edge": "Red stitched edges",
      "Care": "Hand wash"
    }
  }
];

export const mockCollections: Collection[] = [
  {
    id: "c1",
    name: "Minimal",
    slug: "minimal",
    description: "Clean, understated designs for distraction-free workspaces.",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1200",
    productCount: 12
  },
  {
    id: "c2",
    name: "Gaming",
    slug: "gaming",
    description: "Performance surfaces with bold, modern aesthetics.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200",
    productCount: 8
  },
  {
    id: "c3",
    name: "Dark Series",
    slug: "dark-series",
    description: "Our signature all-black and monochrome collection.",
    image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=1200",
    productCount: 15
  },
  {
    id: "c4",
    name: "Anime Inspired",
    slug: "anime-inspired",
    description: "Subtle nods to classic animation styles.",
    image: "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=1200",
    productCount: 5
  }
];

export const mockReviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    name: "Rahul S.",
    rating: 5,
    review: "The quality is incredible. The stitching is flawless and it lays perfectly flat right out of the box. Highly recommend for any minimal setup.",
    date: "2023-10-12",
    verified: true
  },
  {
    id: "r2",
    productId: "p1",
    name: "Arjun M.",
    rating: 4,
    review: "Great mat, glide is smooth. Wish it came in an even larger size though.",
    date: "2023-09-28",
    verified: true
  },
  {
    id: "r3",
    productId: "p4",
    name: "Vikram K.",
    rating: 5,
    review: "It is exactly what it claims to be. A deep, void-like black. Beautiful.",
    date: "2023-11-05",
    verified: true
  }
];
