import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { adminBookingsRouter } from './bookings.routes.js';
import { adminOrdersRouter } from './orders.routes.js';
import { adminMenuRouter } from './menu.routes.js';
import { adminSettingsRouter } from './settings.routes.js';

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.use('/bookings', adminBookingsRouter);
adminRouter.use('/orders', adminOrdersRouter);
adminRouter.use('/menu', adminMenuRouter);
adminRouter.use('/settings', adminSettingsRouter);
