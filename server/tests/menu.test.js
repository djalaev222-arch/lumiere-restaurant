import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './helpers.js';

describe('GET /api/menu', () => {
  it('returns categories and available dishes', async () => {
    const res = await request(app).get('/api/menu');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.categories.length).toBe(5);
    expect(res.body.data.dishes.length).toBeGreaterThan(0);

    const dish = res.body.data.dishes[0];
    expect(dish).toHaveProperty('id');
    expect(dish).toHaveProperty('name.ru');
    expect(dish).toHaveProperty('name.en');
    expect(dish.isAvailable).toBe(true);
  });

  it('never exposes unavailable dishes', async () => {
    const admin = (await import('./helpers.js')).loginAsAdmin;
    const agent = await admin();

    await agent.patch('/api/admin/menu/dishes/espresso').send({ isAvailable: false }).expect(200);

    const res = await request(app).get('/api/menu');
    const ids = res.body.data.dishes.map((d) => d.id);
    expect(ids).not.toContain('espresso');

    // restore for other tests
    await agent.patch('/api/admin/menu/dishes/espresso').send({ isAvailable: true }).expect(200);
  });
});
