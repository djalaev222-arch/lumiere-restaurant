import { prisma } from '../../lib/prisma.js';
import { serializeBooking } from '../../lib/serializers.js';
import { notifyBookingStatusChange } from '../../lib/notifications.js';

export async function listBookings(req, res, next) {
  try {
    const { status, date } = req.query;
    const where = {};
    if (status) where.status = status;
    if (date) where.date = date;

    const bookings = await prisma.booking.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: bookings.map(serializeBooking) });
  } catch (error) {
    next(error);
  }
}

export async function updateBookingStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const booking = await prisma.booking
      .update({ where: { id }, data: { status: req.validated.status } })
      .catch(() => null);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    notifyBookingStatusChange(booking); // fire-and-forget

    res.json({ success: true, data: serializeBooking(booking) });
  } catch (error) {
    next(error);
  }
}
