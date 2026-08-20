import { create } from 'zustand';
import { fetchSettings } from '../lib/api';

export const useSettingsStore = create((set, get) => ({
  settings: null,
  status: 'idle', // idle | loading | success | error

  load: async () => {
    if (get().status === 'loading' || get().status === 'success') return;
    set({ status: 'loading' });
    try {
      const settings = await fetchSettings();
      set({ settings, status: 'success' });
    } catch {
      set({ status: 'error' });
    }
  },
}));
