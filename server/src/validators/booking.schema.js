import { z } from 'zod';

const todayIso = () => new Date().toISOString().split('T')[0];

export const bookingSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    phone: z
      .string()
      .trim()
      .regex(/^[+\d][\d\s()-]{7,}$/),
    email: z.string().trim().email().optional().or(z.literal('')),
    date: z.string().refine((value) => value >= todayIso(), 'Date must not be in the past'),
    time: z.string().regex(/^\d{2}:\d{2}$/),
    guests: z.coerce.number().int().min(1).max(20),
    comment: z.string().trim().max(500).optional().or(z.literal('')),
    company: z.string().max(200).optional().or(z.literal('')),
  })
  .strict();
