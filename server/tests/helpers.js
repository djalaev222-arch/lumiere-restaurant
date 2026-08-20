import request from 'supertest';
import { createApp } from '../src/app.js';

export const app = createApp();

export async function loginAsAdmin() {
  const agent = request.agent(app);
  await agent
    .post('/api/auth/login')
    .send({ email: 'admin@lumiere-restaurant.ru', password: 'test-admin-password' })
    .expect(200);
  return agent;
}
