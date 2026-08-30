import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        if (!items.find((i) => i.id === product.id)) {
          set({ items: [...items, product] });
        }
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: 'zeron-wishlist-storage',
    }
  )
);
