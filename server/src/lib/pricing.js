import { prisma } from './prisma.js';

export async function calculateDeliveryFee(method, subtotal) {
  if (method === 'pickup') return 0;

  const settings = await prisma.restaurantSettings.findUnique({ where: { id: 1 } });
  const deliveryFee = settings?.deliveryFee ?? 250;
  const freeThreshold = settings?.freeDeliveryThreshold ?? 3000;

  return subtotal >= freeThreshold ? 0 : deliveryFee;
}
