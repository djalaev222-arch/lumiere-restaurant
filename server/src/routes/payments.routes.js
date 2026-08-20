import { Router } from 'express';
import { yookassaWebhook } from '../controllers/payments.controller.js';

export const paymentsRouter = Router();

paymentsRouter.post('/yookassa/webhook', yookassaWebhook);
