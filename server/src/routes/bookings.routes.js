import { Router } from 'express';
import { createBooking } from '../controllers/bookings.controller.js';
import { validate } from '../middleware/validate.js';
import { bookingSchema } from '../validators/booking.schema.js';
import { submissionLimiter } from '../middleware/rateLimit.js';

export const bookingsRouter = Router();

bookingsRouter.post('/', submissionLimiter, validate(bookingSchema), createBooking);
