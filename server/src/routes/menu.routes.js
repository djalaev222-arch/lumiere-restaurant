import { Router } from 'express';
import { listMenu } from '../controllers/menu.controller.js';

export const menuRouter = Router();

menuRouter.get('/', listMenu);
