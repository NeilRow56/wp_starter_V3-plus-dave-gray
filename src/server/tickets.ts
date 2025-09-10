'use server'

import { db } from '@/db'
import { tickets } from '@/db/schema'
import { auth } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'
import {
  insertTicketSchema,
  insertTicketSchemaType
} from '@/zod-schemas/tickets'
import { eq } from 'drizzle-orm'
import { flattenValidationErrors } from 'next-safe-action'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getTicket(id: string) {
  const ticket = await db.select().from(tickets).where(eq(tickets.id, id))

  return ticket[0]
}

export const saveTicketAction = actionClient
  .metadata({ actionName: 'saveTicketAction' })
  .inputSchema(insertTicketSchema, {
    // Here we use the `flattenValidationErrors` function to customize the returned validation errors
    // object to the client.
    handleValidationErrorsShape: async ve =>
      flattenValidationErrors(ve).fieldErrors
  })
  .action(
    async ({
      parsedInput: ticket
    }: {
      parsedInput: insertTicketSchemaType
    }) => {
      const session = await auth.api.getSession({
        headers: await headers()
      })

      if (!session) redirect('/auth/sign-in')

      // New ticket
      // All new tickets are open by default - no need to set completed to true
      // createdAt and updatedAt are set by the database
      if (ticket.id === '(New)') {
        const result = await db
          .insert(tickets)
          .values({
            customerId: ticket.customerId,
            title: ticket.title,
            description: ticket.description,
            tech: ticket.tech
          })
          .returning({ insertedId: tickets.id })

        return {
          message: `Ticket ID #${result[0].insertedId} created successfully`
        }
      }

      // Updating ticket
      // updatedAt is set by the database
      const result = await db
        .update(tickets)
        .set({
          customerId: ticket.customerId,
          title: ticket.title,
          description: ticket.description,
          completed: ticket.completed,
          tech: ticket.tech
        })
        .where(eq(tickets.id, ticket.id!))
        .returning({ updatedId: tickets.id })

      return {
        message: `Ticket ID #${result[0].updatedId} updated successfully`
      }
    }
  )
