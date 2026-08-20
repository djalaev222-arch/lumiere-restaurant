import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { menuRouter } from './routes/menu.routes.js';
import { bookingsRouter } from './routes/bookings.routes.js';
import { ordersRouter } from './routes/orders.routes.js';
import { settingsRouter } from './routes/settings.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { paymentsRouter } from './routes/payments.routes.js';
import { adminRouter } from './routes/admin/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));
  app.use('/api/menu', menuRouter);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/payments', paymentsRouter);
  app.use('/api/admin', adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
