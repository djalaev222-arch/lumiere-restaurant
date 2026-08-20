import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { id, qty }

      addItem: (dishId, qty = 1) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === dishId);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === dishId ? { ...item, qty: item.qty + qty } : item
              ),
            };
          }
          return { items: [...state.items, { id: dishId, qty }] };
        });
      },

      removeItem: (dishId) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== dishId) }));
      },

      setQty: (dishId, qty) => {
        if (qty <= 0) {
          get().removeItem(dishId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => (item.id === dishId ? { ...item, qty } : item)),
        }));
      },

      clear: () => set({ items: [] }),
    }),
    { name: 'lumiere_cart' }
  )
);
