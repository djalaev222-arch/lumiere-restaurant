import { create } from 'zustand';

// The session itself lives in an httpOnly cookie set by the API — never
// accessible to client JS, so nothing sensitive is kept here. `status`
// starts 'unknown' until AdminLayout confirms the cookie via GET /auth/me.
export const useAdminAuthStore = create((set) => ({
  staff: null,
  status: 'unknown', // unknown | authenticated | anonymous

  setStaff: (staff) => set({ staff, status: staff ? 'authenticated' : 'anonymous' }),
  clear: () => set({ staff: null, status: 'anonymous' }),
}));
