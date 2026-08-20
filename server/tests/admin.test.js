import { describe, it, expect, beforeAll } from 'vitest';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { app, loginAsAdmin } from './helpers.js';
import { prisma } from '../src/lib/prisma.js';

async function loginAsOperator() {
  const agent = request.agent(app);
  await agent
    .post('/api/auth/login')
    .send({ email: 'operator@lumiere-restaurant.ru', password: 'operator-password' })
    .expect(200);
  return agent;
}

beforeAll(async () => {
  await prisma.staff.upsert({
    where: { email: 'operator@lumiere-restaurant.ru' },
    update: {},
    create: {
      email: 'operator@lumiere-restaurant.ru',
      passwordHash: await bcrypt.hash('operator-password', 10),
      name: 'Test Operator',
      role: 'OPERATOR',
    },
  });
});

describe('Role-based access control', () => {
  it('lets an OPERATOR view bookings and orders', async () => {
    const operator = await loginAsOperator();
    expect((await operator.get('/api/admin/bookings')).status).toBe(200);
    expect((await operator.get('/api/admin/orders')).status).toBe(200);
  });

  it('blocks an OPERATOR from creating a dish', async () => {
    const operator = await loginAsOperator();
    const res = await operator.post('/api/admin/menu/dishes').send({
      id: 'operator-attempt',
      categoryId: 'starters',
      nameRu: 'x',
      nameEn: 'x',
      descriptionRu: 'x',
      descriptionEn: 'x',
      price: 1,
      weight: 1,
      image: 'https://picsum.photos/seed/x/800/600',
    });
    expect(res.status).toBe(403);
  });

  it('lets an ADMIN create, update and delete a dish', async () => {
    const admin = await loginAsAdmin();

    const created = await admin
      .post('/api/admin/menu/dishes')
      .send({
        id: 'admin-test-dish',
        categoryId: 'starters',
        nameRu: 'Тест',
        nameEn: 'Test',
        descriptionRu: 'д',
        descriptionEn: 'd',
        price: 500,
        weight: 100,
        image: 'https://picsum.photos/seed/admin-test/800/600',
      })
      .expect(201);
    expect(created.body.data.id).toBe('admin-test-dish');

    await admin.patch('/api/admin/menu/dishes/admin-test-dish').send({ price: 600 }).expect(200);

    await admin.delete('/api/admin/menu/dishes/admin-test-dish').expect(204);

    const dishes = await admin.get('/api/admin/menu/dishes').expect(200);
    expect(dishes.body.data.map((d) => d.id)).not.toContain('admin-test-dish');
  });

  it('refuses to delete a dish that has order history', async () => {
    const admin = await loginAsAdmin();

    // Give this dish order history within the test itself — test file
    // execution order is not guaranteed, so we can't rely on another file
    // having ordered a fixture dish already.
    await request(app)
      .post('/api/orders')
      .send({
        name: 'История Заказов',
        phone: '+79990000001',
        method: 'pickup',
        timeType: 'asap',
        payment: 'cash',
        items: [{ dishId: 'craft-lemonade', qty: 1 }],
      })
      .expect(201);

    const res = await admin.delete('/api/admin/menu/dishes/craft-lemonade');
    expect(res.status).toBe(409);
  });
});

describe('Booking and order status updates', () => {
  it('updates a booking status and rejects unknown ids', async () => {
    const admin = await loginAsAdmin();

    const booking = await request(app)
      .post('/api/bookings')
      .send({ name: 'Статус Тест', phone: '+79990000000', date: '2099-01-01', time: '19:00', guests: 2 });

    const updated = await admin
      .patch(`/api/admin/bookings/${booking.body.data.id}/status`)
      .send({ status: 'CONFIRMED' })
      .expect(200);
    expect(updated.body.data.status).toBe('CONFIRMED');

    expect((await admin.patch('/api/admin/bookings/999999/status').send({ status: 'CONFIRMED' })).status).toBe(404);
    expect((await admin.patch(`/api/admin/bookings/${booking.body.data.id}/status`).send({ status: 'NOT_A_STATUS' })).status).toBe(
      400
    );
  });

  it('updates an order status', async () => {
    const admin = await loginAsAdmin();

    const order = await request(app)
      .post('/api/orders')
      .send({
        name: 'Статус Заказ',
        phone: '+79990000000',
        method: 'pickup',
        timeType: 'asap',
        payment: 'cash',
        items: [{ dishId: 'espresso', qty: 1 }],
      });

    const updated = await admin
      .patch(`/api/admin/orders/${order.body.data.id}/status`)
      .send({ status: 'PREPARING' })
      .expect(200);
    expect(updated.body.data.status).toBe('PREPARING');
  });
});

describe('Settings', () => {
  it('is readable publicly and writable by admins only', async () => {
    const publicRes = await request(app).get('/api/settings').expect(200);
    expect(publicRes.body.data).toHaveProperty('hoursText');

    const operator = await loginAsOperator();
    expect((await operator.patch('/api/admin/settings').send({ hoursText: 'x' })).status).toBe(403);

    const admin = await loginAsAdmin();
    const updated = await admin.patch('/api/admin/settings').send({ hoursText: 'Пн–Вс: 10:00–22:00' }).expect(200);
    expect(updated.body.data.hoursText).toBe('Пн–Вс: 10:00–22:00');

    // restore
    await admin.patch('/api/admin/settings').send({ hoursText: 'Пн–Вс: 12:00–00:00' }).expect(200);
  });
});
