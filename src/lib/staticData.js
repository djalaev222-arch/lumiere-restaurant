// Static-demo data. Used automatically when no backend is reachable — e.g. the
// GitHub Pages build, or a plain `npm run build` opened without the API running.
// Keeps the menu, bookings and delivery flow fully usable in a read-only demo.
import { dishes as rawDishes, categories as categoryIds, featuredDishIds } from '../data/menu.js';

const CATEGORY_NAMES = {
  starters: { ru: 'Закуски', en: 'Starters' },
  soups: { ru: 'Супы', en: 'Soups' },
  mains: { ru: 'Горячее', en: 'Mains' },
  desserts: { ru: 'Десерты', en: 'Desserts' },
  drinks: { ru: 'Напитки', en: 'Drinks' },
};

export const STATIC_SETTINGS = {
  hoursText: 'Пн–Вс: 09:00–00:00',
  phone: '+7 (495) 000-12-34',
  email: 'hello@lumiere-restaurant.ru',
  address: 'Москва, ул. Тверская, 12',
  deliveryFee: 250,
  freeDeliveryThreshold: 3000,
  aboutRu: '',
  aboutEn: '',
};

export function staticMenu() {
  return {
    categories: categoryIds.map((id, index) => ({
      id,
      name: CATEGORY_NAMES[id] ?? { ru: id, en: id },
      sortOrder: index + 1,
    })),
    dishes: rawDishes.map((dish) => ({
      ...dish,
      isAvailable: true,
      isFeatured: featuredDishIds.includes(dish.id),
    })),
  };
}

function randomId() {
  return Math.floor(1000 + Math.random() * 9000);
}

export function demoBooking(payload) {
  return {
    id: randomId(),
    name: payload.name,
    phone: payload.phone,
    email: payload.email ?? '',
    date: payload.date,
    time: payload.time,
    guests: payload.guests,
    comment: payload.comment ?? '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

export function demoOrder(payload) {
  const items = (payload.items ?? []).map((item) => {
    const dish = rawDishes.find((d) => d.id === item.dishId);
    return {
      dishId: item.dishId,
      name: dish?.name?.ru ?? item.dishId,
      price: dish?.price ?? 0,
      qty: item.qty,
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const fee =
    payload.method === 'pickup' || subtotal >= STATIC_SETTINGS.freeDeliveryThreshold
      ? 0
      : STATIC_SETTINGS.deliveryFee;

  return {
    id: randomId(),
    name: payload.name,
    phone: payload.phone,
    email: payload.email ?? '',
    method: payload.method,
    address: payload.address ?? '',
    timeType: payload.timeType,
    payment: payload.payment,
    comment: payload.comment ?? '',
    subtotal,
    deliveryFee: fee,
    total: subtotal + fee,
    status: 'new',
    paymentStatus: payload.payment === 'online' ? 'pending' : 'not_required',
    // In the demo there is no real payment gateway — surface that softly.
    paymentError: payload.payment === 'online',
    createdAt: new Date().toISOString(),
    items,
  };
}
