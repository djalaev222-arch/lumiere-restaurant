import { Router } from 'express';
import { getSettings, updateSettings } from '../../controllers/admin/settings.controller.js';
import { validate } from '../../middleware/validate.js';
import { settingsSchema } from '../../validators/admin.schema.js';
import { requireRole } from '../../middleware/auth.js';

export const adminSettingsRouter = Router();

adminSettingsRouter.get('/', getSettings);
adminSettingsRouter.patch('/', requireRole('ADMIN', 'MANAGER'), validate(settingsSchema), updateSettings);
