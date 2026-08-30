import { create } from 'zustand';

interface UIState {
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  openSearch: () => set({ isSearchOpen: true, isMobileMenuOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen, isMobileMenuOpen: false })),
  openMobileMenu: () => set({ isMobileMenuOpen: true, isSearchOpen: false }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen, isSearchOpen: false })),
}));
