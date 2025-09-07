import { z } from 'zod/v4'

export const ticketSchema = z.object({
  id: z.union([z.string(), z.literal('(New)')]),
  customerId: z
    .string()
    .min(1, { error: 'Customer Id is required' })
    .max(40, { error: 'Customer id must be at most 40 characters!' }),
  title: z
    .string()
    .min(1, { error: 'Title is required' })
    .max(40, { error: 'Title must be at most 40 characters!' }),
  description: z
    .string()
    .min(1, { error: 'Description is required' })
    .max(2000, { error: 'Description must be at most 2000 characters!' }),
  tech: z.email('Invalid email address'),
  completed: z.boolean()
})
