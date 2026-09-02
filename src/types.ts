export interface Variant {
  id: string;
  name: string;
  price: number;
  available: boolean;
  qikinkSku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  categoryId?: string;
  categorySlug?: string;
  collection: string;
  collectionId?: string;
  collectionSlug?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestseller: boolean;
  newProduct: boolean;
  qikinkDesignSku?: string;
  variants: Variant[];
  specifications: Record<string, string>;
}

export interface Review {
  id: string;
  productId: string;
  name: string;
  rating: number;
  review: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  variant: Variant;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Address {
  id: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "processing" | "shipped" | "delivered";
  address: Address;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}
