import { prisma } from '../lib/prisma.js';
import { fetchYookassaPayment, isYookassaConfigured } from '../lib/yookassa.js';

// YooKassa can retry/duplicate webhook deliveries and the POST body is
// attacker-guessable, so we never trust it directly — we take only the
// payment id from it and re-fetch the authoritative status ourselves.
export async function yookassaWebhook(req, res) {
  if (!isYookassaConfigured()) {
    return res.status(200).end();
  }

  const paymentId = req.body?.object?.id;
  if (!paymentId || typeof paymentId !== 'string') {
    return res.status(200).end();
  }

  try {
    const payment = await fetchYookassaPayment(paymentId);
    const orderId = Number(payment.metadata?.orderId);
    if (!orderId) return res.status(200).end();

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.paymentId !== paymentId) return res.status(200).end();

    if (payment.status === 'succeeded') {
      await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'SUCCEEDED' } });
    } else if (payment.status === 'canceled') {
      await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'CANCELED' } });
    }
  } catch (error) {
    console.error('YooKassa webhook processing failed:', error.message);
  }

  res.status(200).end();
}
