import { prisma } from '../lib/prisma.js';
import { serializeBooking } from '../lib/serializers.js';
import { notifyNewBooking } from '../lib/notifications.js';

export async function createBooking(req, res, next) {
  try {
    const { company, ...data } = req.validated;

    if (company) {
      // Honeypot triggered: report fake success so the bot doesn't learn
      // the field is being checked, but skip the actual write.
      return res.status(201).json({ success: true, data: { id: 0 } });
    }

    const booking = await prisma.booking.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        date: data.date,
        time: data.time,
        guests: data.guests,
        comment: data.comment || null,
      },
    });

    notifyNewBooking(booking); // fire-and-forget

    res.status(201).json({ success: true, data: serializeBooking(booking) });
  } catch (error) {
    next(error);
  }
}
