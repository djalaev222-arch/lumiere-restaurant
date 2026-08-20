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
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success) {
    throw new ApiError(body?.error || 'Request failed', response.status, body?.details);
  }

  return body.data;
}

export function fetchMenu() {
  return request('/menu');
}

export function createBooking(payload) {
  return request('/bookings', { method: 'POST', body: JSON.stringify(payload) });
}

export function createOrder(payload) {
  return request('/orders', { method: 'POST', body: JSON.stringify(payload) });
}

export function fetchSettings() {
  return request('/settings');
}

export function fetchOrderPaymentStatus(orderId) {
  return request(`/orders/${orderId}/payment-status`);
}
