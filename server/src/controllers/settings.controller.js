import { prisma } from '../lib/prisma.js';

export async function getPublicSettings(req, res, next) {
  try {
    const settings = await prisma.restaurantSettings.findUnique({ where: { id: 1 } });
    if (!settings) return res.status(404).json({ success: false, error: 'Settings not initialized' });

    res.json({
      success: true,
      data: {
        hoursText: settings.hoursText,
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
        deliveryFee: settings.deliveryFee,
        freeDeliveryThreshold: settings.freeDeliveryThreshold,
        aboutRu: settings.aboutRu,
        aboutEn: settings.aboutEn,
      },
    });
  } catch (error) {
    next(error);
  }
}
