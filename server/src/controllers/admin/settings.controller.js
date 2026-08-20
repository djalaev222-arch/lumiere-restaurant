import { prisma } from '../../lib/prisma.js';

function serializeSettings(settings) {
  return {
    hoursText: settings.hoursText,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    deliveryFee: settings.deliveryFee,
    freeDeliveryThreshold: settings.freeDeliveryThreshold,
    aboutRu: settings.aboutRu,
    aboutEn: settings.aboutEn,
    updatedAt: settings.updatedAt,
  };
}

export async function getSettings(req, res, next) {
  try {
    const settings = await prisma.restaurantSettings.findUnique({ where: { id: 1 } });
    if (!settings) return res.status(404).json({ success: false, error: 'Settings not initialized' });
    res.json({ success: true, data: serializeSettings(settings) });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const settings = await prisma.restaurantSettings.update({ where: { id: 1 }, data: req.validated });
    res.json({ success: true, data: serializeSettings(settings) });
  } catch (error) {
    next(error);
  }
}
