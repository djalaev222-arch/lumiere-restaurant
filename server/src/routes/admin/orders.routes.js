import { Router } from 'express';
import { listOrders, updateOrderStatus, stats } from '../../controllers/admin/orders.controller.js';
import { validate } from '../../middleware/validate.js';
import { orderStatusSchema } from '../../validators/admin.schema.js';

export const adminOrdersRouter = Router();

adminOrdersRouter.get('/stats', stats);
adminOrdersRouter.get('/', listOrders);
adminOrdersRouter.patch('/:id/status', validate(orderStatusSchema), updateOrderStatus);
