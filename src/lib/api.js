import { staticMenu, STATIC_SETTINGS, demoBooking, demoOrder } from './staticData';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4310/api';

// A production build with no API URL configured (e.g. GitHub Pages) is a pure
// static demo — skip the network entirely and serve bundled data.
const DEMO_ONLY = import.meta.env.PROD && !import.meta.env.VITE_API_URL;

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// A failure with no HTTP status means the backend was unreachable (offline demo,
// static hosting) rather than a real API rejection — callers may fall back.
function isOffline(error) {
  return !(error instanceof ApiError);
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

export async function fetchMenu() {
  if (DEMO_ONLY) return staticMenu();
  try {
    return await request('/menu');
  } catch (error) {
    if (isOffline(error)) return staticMenu();
    throw error;
  }
}

export async function fetchSettings() {
  if (DEMO_ONLY) return STATIC_SETTINGS;
  try {
    return await request('/settings');
  } catch (error) {
    if (isOffline(error)) return STATIC_SETTINGS;
    throw error;
  }
}

export async function createBooking(payload) {
  if (DEMO_ONLY) return demoBooking(payload);
  try {
    return await request('/bookings', { method: 'POST', body: JSON.stringify(payload) });
  } catch (error) {
    if (isOffline(error)) return demoBooking(payload);
    throw error;
  }
}

export async function createOrder(payload) {
  if (DEMO_ONLY) return demoOrder(payload);
  try {
    return await request('/orders', { method: 'POST', body: JSON.stringify(payload) });
  } catch (error) {
    if (isOffline(error)) return demoOrder(payload);
    throw error;
  }
}

export async function fetchOrderPaymentStatus(orderId) {
  return request(`/orders/${orderId}/payment-status`);
}
