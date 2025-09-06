import { z } from 'zod/v4'

export const ticketSchema = z.object({
  id: z.union([z.string(), z.literal('(New)')]),
  customerId: z
    .string()
    .min(1, { error: 'First name is required' })
    .max(20, { error: 'First name must be at most 20 characters!' }),
  title: z
    .string()
    .min(1, { error: 'First name is required' })
    .max(20, { error: 'First name must be at most 20 characters!' }),
  description: z
    .string()
    .min(1, { error: 'First name is required' })
    .max(20, { error: 'First name must be at most 20 characters!' }),
  tech: z.email('Invalid email address'),
  completed: z.boolean()
})
