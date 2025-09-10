import { z } from 'zod/v4'

// export const ticketSchema = z.object({
//   id: z.union([z.string(), z.literal('(New)')]),
//   customerId: z
//     .string()
//     .min(1, { error: 'Customer Id is required' })
//     .max(40, { error: 'Customer id must be at most 40 characters!' }),
//   title: z
//     .string()
//     .min(1, { error: 'Title is required' })
//     .max(40, { error: 'Title must be at most 40 characters!' }),
//   description: z
//     .string()
//     .min(1, { error: 'Description is required' })
//     .max(2000, { error: 'Description must be at most 2000 characters!' }),
//   tech: z.email('Invalid email address'),
//   completed: z.boolean()
// })

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { tickets } from '@/db/schema'

export const insertTicketSchema = createInsertSchema(tickets, {
  id: z.union([z.string(), z.literal('(New)')]),
  title: schema => schema.min(1, 'Title is required'),
  description: schema => schema.min(1, 'Description is required'),
  tech: schema => schema.email('Invalid email address')
})

export const selectTicketSchema = createSelectSchema(tickets)

export type insertTicketSchemaType = z.infer<typeof insertTicketSchema>
export type selectTicketSchemaType = z.infer<typeof selectTicketSchema>
