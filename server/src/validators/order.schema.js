import { z } from 'zod';

const itemSchema = z.object({
  dishId: z.string().min(1),
  qty: z.coerce.number().int().min(1).max(50),
});

export const orderSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d][\d\s()-]{7,}$/),
    email: z.string().trim().email().optional().or(z.literal('')),
    method: z.enum(['delivery', 'pickup']),
    address: z.string().trim().max(300).optional().or(z.literal('')),
    timeType: z.enum(['asap', 'scheduled']),
    payment: z.enum(['online', 'cash']),
    comment: z.string().trim().max(500).optional().or(z.literal('')),
    items: z.array(itemSchema).min(1),
  })
  .strict()
  .refine((data) => data.method !== 'delivery' || (data.address && data.address.length >= 5), {
    message: 'Address is required for delivery',
    path: ['address'],
  });
