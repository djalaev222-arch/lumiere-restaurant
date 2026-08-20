import { useAdminAuthStore } from '../store/adminAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4310/api';

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (response.status === 401) {
    useAdminAuthStore.getState().clear();
  }

  const body = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok || (body && !body.success)) {
    throw new ApiError(body?.error || 'Request failed', response.status, body?.details);
  }

  return body?.data;
}

export function login(email, password) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function logout() {
  return request('/auth/logout', { method: 'POST' });
}

export function fetchMe() {
  return request('/auth/me');
}

export function fetchStats() {
  return request('/admin/orders/stats');
}

export function fetchBookings(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/bookings${query ? `?${query}` : ''}`);
}

export function updateBookingStatus(id, status) {
  return request(`/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export function fetchOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/orders${query ? `?${query}` : ''}`);
}

export function updateOrderStatus(id, status) {
  return request(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export function fetchAdminDishes() {
  return request('/admin/menu/dishes');
}

export function fetchAdminCategories() {
  return request('/admin/menu/categories');
}

export function createDish(payload) {
  return request('/admin/menu/dishes', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateDish(id, payload) {
  return request(`/admin/menu/dishes/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export function deleteDish(id) {
  return request(`/admin/menu/dishes/${id}`, { method: 'DELETE' });
}

export function fetchSettings() {
  return request('/admin/settings');
}

export function updateSettings(payload) {
  return request('/admin/settings', { method: 'PATCH', body: JSON.stringify(payload) });
}
