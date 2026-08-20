import { prisma } from '../lib/prisma.js';
import { serializeOrder } from '../lib/serializers.js';
import { calculateDeliveryFee } from '../lib/pricing.js';
import { isYookassaConfigured, createYookassaPayment } from '../lib/yookassa.js';
import { notifyNewOrder } from '../lib/notifications.js';

export async function createOrder(req, res, next) {
  try {
    const data = req.validated;

    const dishIds = data.items.map((item) => item.dishId);
    const dishes = await prisma.dish.findMany({ where: { id: { in: dishIds } } });
    const dishById = new Map(dishes.map((dish) => [dish.id, dish]));

    const missing = dishIds.filter((id) => !dishById.has(id));
    if (missing.length > 0) {
      return res.status(400).json({ success: false, error: `Unknown dish id(s): ${missing.join(', ')}` });
    }

    const unavailable = dishIds.filter((id) => !dishById.get(id).isAvailable);
    if (unavailable.length > 0) {
      return res.status(409).json({ success: false, error: `Dish(es) no longer available: ${unavailable.join(', ')}` });
    }

    const lineItems = data.items.map((item) => {
      const dish = dishById.get(item.dishId);
      return {
        dishId: dish.id,
        name: dish.nameRu,
        price: dish.price,
        qty: item.qty,
      };
    });

    const subtotal = lineItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const deliveryFee = await calculateDeliveryFee(data.method, subtotal);
    const total = subtotal + deliveryFee;

    let order = await prisma.order.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        method: data.method === 'delivery' ? 'DELIVERY' : 'PICKUP',
        address: data.method === 'delivery' ? data.address : null,
        timeType: data.timeType === 'asap' ? 'ASAP' : 'SCHEDULED',
        payment: data.payment === 'online' ? 'ONLINE' : 'CASH',
        comment: data.comment || null,
        subtotal,
        deliveryFee,
        total,
        items: { create: lineItems },
      },
      include: { items: true },
    });

    let paymentUrl = null;
    let paymentError = false;

    if (data.payment === 'online' && isYookassaConfigured()) {
      try {
        const origin = process.env.YOOKASSA_RETURN_URL || `${process.env.CORS_ORIGIN}/delivery/payment-result`;
        const payment = await createYookassaPayment({
          orderId: order.id,
          amountRub: total,
          description: `Заказ №${order.id} — Lumière`,
          returnUrl: `${origin}?orderId=${order.id}`,
        });

        order = await prisma.order.update({
          where: { id: order.id },
          data: { paymentId: payment.id, paymentStatus: 'PENDING' },
          include: { items: true },
        });
        paymentUrl = payment.confirmation?.confirmation_url ?? null;
      } catch (error) {
        console.error('YooKassa payment creation failed:', error.message);
        paymentError = true;
      }
    }

    notifyNewOrder(order); // fire-and-forget — never blocks or fails the order response

    res.status(201).json({ success: true, data: { ...serializeOrder(order), paymentUrl, paymentError } });
  } catch (error) {
    next(error);
  }
}

export async function getOrderPaymentStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const order = await prisma.order.findUnique({ where: { id }, select: { paymentStatus: true, status: true } });
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, data: { paymentStatus: order.paymentStatus, status: order.status } });
  } catch (error) {
    next(error);
  }
}
