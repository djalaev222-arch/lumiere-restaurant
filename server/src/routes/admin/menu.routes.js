import { Router } from 'express';
import {
  listCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  listDishesAdmin,
  createDish,
  updateDish,
  deleteDish,
} from '../../controllers/admin/menu.controller.js';
import { validate } from '../../middleware/validate.js';
import { categorySchema, categoryUpdateSchema, dishSchema, dishUpdateSchema } from '../../validators/admin.schema.js';
import { requireRole } from '../../middleware/auth.js';

export const adminMenuRouter = Router();

const canEditMenu = requireRole('ADMIN', 'MANAGER');

adminMenuRouter.get('/categories', listCategoriesAdmin);
adminMenuRouter.post('/categories', canEditMenu, validate(categorySchema), createCategory);
adminMenuRouter.patch('/categories/:id', canEditMenu, validate(categoryUpdateSchema), updateCategory);
adminMenuRouter.delete('/categories/:id', canEditMenu, deleteCategory);

adminMenuRouter.get('/dishes', listDishesAdmin);
adminMenuRouter.post('/dishes', canEditMenu, validate(dishSchema), createDish);
adminMenuRouter.patch('/dishes/:id', canEditMenu, validate(dishUpdateSchema), updateDish);
adminMenuRouter.delete('/dishes/:id', canEditMenu, deleteDish);
