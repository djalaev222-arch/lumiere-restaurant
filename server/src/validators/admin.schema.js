import { z } from 'zod';

export const bookingStatusSchema = z
  .object({ status: z.enum(['NEW', 'CONFIRMED', 'DECLINED', 'RESCHEDULED']) })
  .strict();

export const orderStatusSchema = z
  .object({ status: z.enum(['NEW', 'PREPARING', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED']) })
  .strict();

export const categorySchema = z
  .object({
    id: z.string().trim().min(1).max(40).regex(/^[a-z0-9-]+$/),
    nameRu: z.string().trim().min(1).max(60),
    nameEn: z.string().trim().min(1).max(60),
    sortOrder: z.coerce.number().int().default(0),
  })
  .strict();

export const categoryUpdateSchema = categorySchema.partial().omit({ id: true }).strict();

export const dishSchema = z
  .object({
    id: z.string().trim().min(1).max(60).regex(/^[a-z0-9-]+$/),
    categoryId: z.string().trim().min(1),
    nameRu: z.string().trim().min(1).max(120),
    nameEn: z.string().trim().min(1).max(120),
    descriptionRu: z.string().trim().min(1).max(400),
    descriptionEn: z.string().trim().min(1).max(400),
    price: z.coerce.number().int().min(0),
    weight: z.coerce.number().int().min(0),
    image: z.string().trim().url(),
    tags: z.array(z.enum(['vegetarian', 'spicy', 'chefChoice'])).default([]),
    allergens: z.array(z.string().trim().min(1)).default([]),
    isAvailable: z.coerce.boolean().default(true),
    isFeatured: z.coerce.boolean().default(false),
    sortOrder: z.coerce.number().int().default(0),
  })
  .strict();

export const dishUpdateSchema = dishSchema.partial().omit({ id: true }).strict();

export const settingsSchema = z
  .object({
    hoursText: z.string().trim().min(1).max(200),
    phone: z.string().trim().min(1).max(40),
    email: z.string().trim().email(),
    address: z.string().trim().min(1).max(200),
    deliveryFee: z.coerce.number().int().min(0),
    freeDeliveryThreshold: z.coerce.number().int().min(0),
    aboutRu: z.string().trim().min(1).max(2000),
    aboutEn: z.string().trim().min(1).max(2000),
  })
  .partial()
  .strict();
