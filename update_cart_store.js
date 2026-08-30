import fs from 'fs';

const content = `import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Variant } from '../types';
import { supabase } from '../lib/supabase';

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (product: Product, variant: Variant, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  syncCartPrices: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      addItem: (product, variant, quantity) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && item.variant.id === variant.id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.variant.id === variant.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, variant, quantity }] };
        });
        get().openCart();
        // Fire and forget sync when item added
        get().syncCartPrices();
      },
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.variant.id === variantId)
          ),
        })),
      updateQuantity: (productId, variantId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.variant.id === variantId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        }));
        // Optional sync on quantity update
        get().syncCartPrices();
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
        if (get().isCartOpen) {
           get().syncCartPrices();
        }
      },
      openCart: () => {
        set({ isCartOpen: true });
        get().syncCartPrices();
      },
      closeCart: () => set({ isCartOpen: false }),
      getCartTotal: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.variant.price * item.quantity, 0);
      },
      getCartCount: () => {
        const items = get().items;
        return items.reduce((count, item) => count + item.quantity, 0);
      },
      syncCartPrices: async () => {
        const items = get().items;
        if (items.length === 0) return;
        
        try {
          const variantIds = items.map(item => item.variant.id);
          const { data: dbVariants, error } = await supabase
            .from('product_variants')
            .select('id, price, product_id, products(active, base_price)')
            .in('id', variantIds);
            
          if (error) {
            console.error("Failed to sync cart prices:", error);
            return;
          }
          
          if (!dbVariants) return;
          
          set((state) => {
            let changed = false;
            const newItems = state.items.map(item => {
              const dbVariant = dbVariants.find((v: any) => v.id === item.variant.id);
              // Remove inactive/deleted variants
              if (!dbVariant || !dbVariant.products?.active) {
                changed = true;
                return null;
              }
              const currentPrice = dbVariant.price ?? dbVariant.products.base_price;
              
              if (item.variant.price !== currentPrice) {
                 changed = true;
                 return {
                    ...item,
                    variant: {
                       ...item.variant,
                       price: currentPrice
                    },
                    product: {
                       ...item.product,
                       base_price: dbVariant.products.base_price
                    }
                 };
              }
              return item;
            }).filter(Boolean) as CartItem[];
            
            return changed ? { items: newItems } : state;
          });
        } catch (e) {
          console.error("Failed to sync cart prices", e);
        }
      }
    }),
    {
      name: 'zeron-cart-storage',
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
`;
fs.writeFileSync('src/store/useCartStore.ts', content);
