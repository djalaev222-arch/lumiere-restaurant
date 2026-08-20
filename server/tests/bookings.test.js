import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './helpers.js';

function futureDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split('T')[0];
}

describe('POST /api/bookings', () => {
  it('creates a booking with valid data', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ name: 'Иван Иванов', phone: '+79991234567', date: futureDate(), time: '19:00', guests: 2 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('NEW');
    expect(res.body.data.id).toBeGreaterThan(0);
  });

  it('rejects an invalid phone number', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ name: 'Иван', phone: '123', date: futureDate(), time: '19:00', guests: 2 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects a past date', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ name: 'Иван', phone: '+79991234567', date: '2020-01-01', time: '19:00', guests: 2 });

    expect(res.status).toBe(400);
  });

  it('rejects guest counts outside 1-20', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({ name: 'Иван', phone: '+79991234567', date: futureDate(), time: '19:00', guests: 25 });

    expect(res.status).toBe(400);
  });

  it('silently drops honeypot submissions without creating a booking', async () => {
    const res = await request(app).post('/api/bookings').send({
      name: 'Bot',
      phone: '+79991234567',
      date: futureDate(),
      time: '19:00',
      guests: 2,
      company: 'spam-inc',
    });

    // Reports success to the bot, but the id is the honeypot sentinel (0),
    // never a real auto-incremented row.
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe(0);
  });
});
