import { prisma } from '../../lib/prisma.js';
import { serializeOrder } from '../../lib/serializers.js';
import { notifyOrderStatusChange } from '../../lib/notifications.js';

export async function listOrders(req, res, next) {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: orders.map(serializeOrder) });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const order = await prisma.order
      .update({ where: { id }, data: { status: req.validated.status }, include: { items: true } })
      .catch(() => null);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    notifyOrderStatusChange(order); // fire-and-forget

    res.json({ success: true, data: serializeOrder(order) });
  } catch (error) {
    next(error);
  }
}

export async function stats(req, res, next) {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);

    const [todayOrders, weekOrders, pendingBookings, activeOrders] = await Promise.all([
      prisma.order.findMany({ where: { createdAt: { gte: startOfToday } } }),
      prisma.order.findMany({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.booking.count({ where: { status: 'NEW' } }),
      prisma.order.count({ where: { status: { in: ['NEW', 'PREPARING', 'ON_THE_WAY'] } } }),
    ]);

    const sumTotal = (orders) => orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      success: true,
      data: {
        today: { orders: todayOrders.length, revenue: sumTotal(todayOrders) },
        week: { orders: weekOrders.length, revenue: sumTotal(weekOrders) },
        pendingBookings,
        activeOrders,
      },
    });
  } catch (error) {
    next(error);
  }
}
