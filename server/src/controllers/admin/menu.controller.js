import { prisma } from '../../lib/prisma.js';
import { serializeCategory, serializeDish } from '../../lib/serializers.js';

export async function listCategoriesAdmin(req, res, next) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json({ success: true, data: categories.map(serializeCategory) });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const category = await prisma.category.create({ data: req.validated });
    res.status(201).json({ success: true, data: serializeCategory(category) });
  } catch {
    res.status(409).json({ success: false, error: 'Category with this id already exists' });
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await prisma.category
      .update({ where: { id: req.params.id }, data: req.validated })
      .catch(() => null);
    if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
    res.json({ success: true, data: serializeCategory(category) });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const dishCount = await prisma.dish.count({ where: { categoryId: req.params.id } });
    if (dishCount > 0) {
      return res.status(409).json({ success: false, error: 'Category still has dishes, move or delete them first' });
    }
    const deleted = await prisma.category.delete({ where: { id: req.params.id } }).catch(() => null);
    if (!deleted) return res.status(404).json({ success: false, error: 'Category not found' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function listDishesAdmin(req, res, next) {
  try {
    const dishes = await prisma.dish.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json({ success: true, data: dishes.map(serializeDish) });
  } catch (error) {
    next(error);
  }
}

function toDbDish(data) {
  const db = { ...data };
  if (Array.isArray(db.tags)) db.tags = db.tags.join(',');
  if (Array.isArray(db.allergens)) db.allergens = db.allergens.join(',');
  return db;
}

export async function createDish(req, res, next) {
  try {
    const dish = await prisma.dish.create({ data: toDbDish(req.validated) });
    res.status(201).json({ success: true, data: serializeDish(dish) });
  } catch {
    res.status(409).json({ success: false, error: 'Dish with this id already exists, or category is unknown' });
  }
}

export async function updateDish(req, res, next) {
  try {
    const dish = await prisma.dish
      .update({ where: { id: req.params.id }, data: toDbDish(req.validated) })
      .catch(() => null);
    if (!dish) return res.status(404).json({ success: false, error: 'Dish not found' });
    res.json({ success: true, data: serializeDish(dish) });
  } catch (error) {
    next(error);
  }
}

export async function deleteDish(req, res, next) {
  try {
    const orderItemCount = await prisma.orderItem.count({ where: { dishId: req.params.id } });
    if (orderItemCount > 0) {
      return res
        .status(409)
        .json({ success: false, error: 'Dish has order history — mark it unavailable instead of deleting' });
    }

    const deleted = await prisma.dish.delete({ where: { id: req.params.id } }).catch(() => null);
    if (!deleted) return res.status(404).json({ success: false, error: 'Dish not found' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
