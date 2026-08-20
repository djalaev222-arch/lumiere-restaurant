import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app, loginAsAdmin } from './helpers.js';

describe('Admin auth', () => {
  it('rejects an unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'whatever' });
    expect(res.status).toBe(401);
  });

  it('rejects a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@lumiere-restaurant.ru', password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('logs in and sets an httpOnly session cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@lumiere-restaurant.ru', password: 'test-admin-password' });

    expect(res.status).toBe(200);
    expect(res.body.data.staff.role).toBe('ADMIN');

    const setCookie = res.headers['set-cookie']?.[0] ?? '';
    expect(setCookie).toContain('admin_session=');
    expect(setCookie.toLowerCase()).toContain('httponly');
  });

  it('rejects /admin/* routes without a session', async () => {
    const res = await request(app).get('/api/admin/bookings');
    expect(res.status).toBe(401);
  });

  it('allows /admin/* routes with a valid session', async () => {
    const agent = await loginAsAdmin();
    const res = await agent.get('/api/admin/bookings');
    expect(res.status).toBe(200);
  });

  it('clears the session on logout', async () => {
    const agent = await loginAsAdmin();
    await agent.post('/api/auth/logout').expect(200);
    const res = await agent.get('/api/admin/bookings');
    expect(res.status).toBe(401);
  });
});
