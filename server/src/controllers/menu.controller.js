import { prisma } from '../lib/prisma.js';
import { serializeCategory, serializeDish } from '../lib/serializers.js';

export async function listMenu(req, res, next) {
  try {
    const [categories, dishes] = await Promise.all([
      prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.dish.findMany({ where: { isAvailable: true }, orderBy: { sortOrder: 'asc' } }),
    ]);

    res.json({
      success: true,
      data: {
        categories: categories.map(serializeCategory),
        dishes: dishes.map(serializeDish),
      },
    });
  } catch (error) {
    next(error);
  }
}
