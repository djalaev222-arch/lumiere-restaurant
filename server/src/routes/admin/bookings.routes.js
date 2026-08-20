import { Router } from 'express';
import { listBookings, updateBookingStatus } from '../../controllers/admin/bookings.controller.js';
import { validate } from '../../middleware/validate.js';
import { bookingStatusSchema } from '../../validators/admin.schema.js';

export const adminBookingsRouter = Router();

adminBookingsRouter.get('/', listBookings);
adminBookingsRouter.patch('/:id/status', validate(bookingStatusSchema), updateBookingStatus);
