import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './helpers.js';

describe('POST /api/orders', () => {
  it('computes subtotal/total from server-side prices, not the client', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        name: 'Мария',
        phone: '+79995551122',
        method: 'pickup',
        timeType: 'asap',
        payment: 'cash',
        // burrata-peach costs 890 — try to smuggle a fake price of 1
        items: [{ dishId: 'burrata-peach', qty: 2, price: 1 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.subtotal).toBe(1780); // 890 * 2, not 1 * 2
    expect(res.body.data.total).toBe(1780); // pickup — no delivery fee
  });

  it('applies the delivery fee for courier orders under the free threshold', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        name: 'Мария',
        phone: '+79995551122',
        method: 'delivery',
        address: 'ул. Пушкина, д. 1',
        timeType: 'asap',
        payment: 'cash',
        items: [{ dishId: 'espresso', qty: 1 }], // 250 — well under the 3000 free threshold
      });

    expect(res.status).toBe(201);
    expect(res.body.data.deliveryFee).toBeGreaterThan(0);
    expect(res.body.data.total).toBe(res.body.data.subtotal + res.body.data.deliveryFee);
  });

  it('rejects an unknown dish id', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        name: 'Мария',
        phone: '+79995551122',
        method: 'pickup',
        timeType: 'asap',
        payment: 'cash',
        items: [{ dishId: 'does-not-exist', qty: 1 }],
      });

    expect(res.status).toBe(400);
  });

  it('requires an address for delivery orders', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        name: 'Мария',
        phone: '+79995551122',
        method: 'delivery',
        timeType: 'asap',
        payment: 'cash',
        items: [{ dishId: 'espresso', qty: 1 }],
      });

    expect(res.status).toBe(400);
  });

  it('mock-completes online payment when YooKassa is not configured', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        name: 'Мария',
        phone: '+79995551122',
        method: 'pickup',
        timeType: 'asap',
        payment: 'online',
        items: [{ dishId: 'espresso', qty: 1 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.paymentUrl).toBeNull();
    expect(res.body.data.paymentError).toBe(false);
    expect(res.body.data.paymentStatus).toBe('NONE');
  });
});

describe('GET /api/orders/:id/payment-status', () => {
  it('returns 404 for a non-existent order', async () => {
    const res = await request(app).get('/api/orders/999999/payment-status');
    expect(res.status).toBe(404);
  });

  it('returns the payment status for a real order', async () => {
    const created = await request(app)
      .post('/api/orders')
      .send({
        name: 'Мария',
        phone: '+79995551122',
        method: 'pickup',
        timeType: 'asap',
        payment: 'cash',
        items: [{ dishId: 'espresso', qty: 1 }],
      });

    const res = await request(app).get(`/api/orders/${created.body.data.id}/payment-status`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('NEW');
  });
});
