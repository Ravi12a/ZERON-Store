import { Product, Collection, Review } from "../types";
import { supabase } from "../lib/supabase";

// Transform DB product row to our frontend Product interface
const transformProduct = (row: any): Product => {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.base_price,
    compareAtPrice: row.compare_at_price,
    images: (row.product_images && row.product_images.length > 0) ? row.product_images.sort((a:any, b:any) => a.sort_order - b.sort_order).map((img: any) => img.image_url) : [],
    category: row.categories ? row.categories.name : "Uncategorized",
    categoryId: row.category_id,
    categorySlug: row.categories ? row.categories.slug : undefined,
    collection: row.collections ? row.collections.name : "None",
    collectionId: row.collection_id,
    collectionSlug: row.collections ? row.collections.slug : undefined,
    tags: [], // Could be added to DB if needed
    rating: row.reviews && row.reviews.length > 0 ? (row.reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / row.reviews.length) : 0,
    reviewCount: row.reviews ? row.reviews.length : 0,
    featured: row.featured,
    bestseller: row.bestseller,
    newProduct: row.new_product,
    variants: (row.product_variants && row.product_variants.length > 0) ? row.product_variants.map((v: any) => ({
      id: v.id,
      name: v.name,
      price: v.price,
      available: v.available,
      qikinkSku: v.qikink_sku
    })) : [{
      id: row.id, // Fallback variant uses product ID
      name: 'Default',
      price: row.base_price,
      available: true,
      qikinkSku: ''
    }],
    specifications: {}
  };
};

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name, slug),
          collections (id, name, slug),
          product_images (image_url, sort_order),
          product_variants (*),
          reviews (rating)
        `)
        .eq('active', true);
      
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      return data ? data.map(transformProduct) : [];
    },
    getBySlug: async (slug: string): Promise<Product | undefined> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name, slug),
          collections (id, name, slug),
          product_images (image_url, sort_order),
          product_variants (*),
          reviews (rating)
        `)
        .eq('active', true)
        .eq('slug', slug)
        .single();
      
      if (error) {
        console.error('Error fetching product by slug:', error);
        return undefined;
      }
      return data ? transformProduct(data) : undefined;
    },
    getFeatured: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name, slug),
          collections (id, name, slug),
          product_images (image_url, sort_order),
          product_variants (*),
          reviews (rating)
        `)
        .eq('active', true)
        .eq('featured', true);
      
      if (error) {
        console.error('Error fetching featured products:', error);
        return [];
      }
      return data ? data.map(transformProduct) : [];
    },
    search: async (query: string): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name, slug),
          collections (id, name, slug),
          product_images (image_url, sort_order),
          product_variants (*),
          reviews (rating)
        `)
        .eq('active', true)
        .ilike('name', `%${query}%`);
      
      if (error) {
        console.error('Error searching products:', error);
        return [];
      }
      return data ? data.map(transformProduct) : [];
    }
  },
  collections: {
    getAll: async (): Promise<Collection[]> => {
      const { data, error } = await supabase
        .from('collections')
        .select('*, products(count)')
        .eq('active', true);
      
      if (error) {
        console.error('Error fetching collections:', error);
        return [];
      }
      return data ? data.map((row: any) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        image: row.image_url,
        productCount: row.products ? row.products[0].count : 0
      })) : [];
    }
  },
  reviews: {
    getByProductId: async (productId: string): Promise<Review[]> => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles(full_name)
        `)
        .eq('product_id', productId)
        .eq('approved', true);
        
      if (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }
      return data ? data.map((row: any) => ({
        id: row.id,
        productId: row.product_id,
        name: row.profiles ? row.profiles.full_name : "Anonymous",
        rating: row.rating,
        review: row.review,
        date: new Date(row.created_at).toLocaleDateString(),
        verified: row.verified_purchase
      })) : [];
    }
  }
};
