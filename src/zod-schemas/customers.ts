import { z } from 'zod/v4'

export const customerSchema = z.object({
  firstName: z
    .string()
    .min(1, { error: 'First name is required' })
    .max(20, { error: 'First name must be at most 20 characters!' }),
  lastName: z
    .string()
    .min(1, { error: 'Last name is required' })
    .max(20, { error: 'Last name must be at most 20 characters!' }),
  email: z.email('Invalid email address'),
  userId: z.string(),

  phone: z
    .string()
    .regex(
      /^\d{3}-\d{3}-\d{4}$/,
      'Invalid phone number format. Use XXX-XXX-XXXX'
    ),
  address1: z
    .string()
    .min(1, { error: 'Address is required' })
    .max(50, { error: 'Address line 1 must be at most 50 characters!' }),

  address2: z.string().optional(),
  city: z.string().min(2).max(50),
  state: z.string().length(2, 'State must be exactly 2 characters'),

  zip: z
    .string()
    .regex(
      /^\d{5}(-\d{4})?$/,
      'Invalid Zip code. Use 5 digits or 5 digits followed by a hyphen and 4 digits'
    ),
  notes: z.string().optional(),
  active: z.boolean()
})
