import { create } from 'zustand';
import { User, Order } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  orders: Order[]; // Can still hold local array or be fetched
  setUser: (user: User | null) => void;
  setOrders: (orders: Order[]) => void;
  logout: () => Promise<void>;
  addOrder: (order: Order) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  orders: [],
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setOrders: (orders) => set({ orders }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false, orders: [] });
  },
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    useAuthStore.getState().setUser({
      id: session.user.id,
      name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
      email: session.user.email || '',
    });
  }
});

supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    useAuthStore.getState().setUser({
      id: session.user.id,
      name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
      email: session.user.email || '',
    });
  } else {
    useAuthStore.getState().setUser(null);
  }
});
