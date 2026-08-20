import { Router } from 'express';
import { getPublicSettings } from '../controllers/settings.controller.js';

export const settingsRouter = Router();

settingsRouter.get('/', getPublicSettings);
