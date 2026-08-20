import { create } from 'zustand';
import { fetchMenu } from '../lib/api';

export const useMenuStore = create((set, get) => ({
  categories: [],
  dishes: [],
  status: 'idle', // idle | loading | success | error
  error: null,

  load: async () => {
    if (get().status === 'loading' || get().status === 'success') return;
    set({ status: 'loading', error: null });
    try {
      const { categories, dishes } = await fetchMenu();
      set({ categories, dishes, status: 'success' });
    } catch (error) {
      set({ status: 'error', error: error.message });
    }
  },
}));
