import { z } from 'zod';

export const createOrderSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().optional(),
  address: z.string().trim().min(1, 'Address is required'),
  upazila: z.string().trim().optional(),
  district: z.string().trim().min(1),
  mobile: z
    .string()
    .trim()
    .min(1, 'Mobile number is required')
    .transform((value) => value.replace(/[\s-]/g, ''))
    .refine((value) => /^(\+?88)?01[3-9]\d{8}$/.test(value), 'Invalid mobile number'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  comment: z.string().trim().max(1000).optional(),
  deliveryMethod: z.enum(['HOME_DELIVERY', 'STORE_PICKUP', 'EXPRESS']),
  paymentMethod: z.literal('CASH_ON_DELIVERY'),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive().max(99),
        variantLabel: z.string().max(120).optional(),
      })
    )
    .min(1)
    .max(30),
});
