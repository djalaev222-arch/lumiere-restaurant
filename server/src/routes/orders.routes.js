import { Router } from 'express';
import { createOrder, getOrderPaymentStatus } from '../controllers/orders.controller.js';
import { validate } from '../middleware/validate.js';
import { orderSchema } from '../validators/order.schema.js';
import { submissionLimiter } from '../middleware/rateLimit.js';

export const ordersRouter = Router();

ordersRouter.post('/', submissionLimiter, validate(orderSchema), createOrder);
ordersRouter.get('/:id/payment-status', getOrderPaymentStatus);
