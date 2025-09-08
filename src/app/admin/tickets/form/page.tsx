import { BackButton } from '@/components/back-button'
import { getCustomer } from '@/server/customers'
import { getTicket } from '@/server/tickets'
import * as Sentry from '@sentry/nextjs'
import TicketForm from './ticket-form'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { customerId, ticketId } = await searchParams

  if (!customerId && !ticketId)
    return {
      title: 'Missing Ticket ID or Customer ID'
    }

  if (customerId)
    return {
      title: `New Ticket for Customer #${customerId}`
    }

  if (ticketId)
    return {
      title: `Edit Ticket #${ticketId}`
    }
}

export default async function TicketFormPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  try {
    const { customerId, ticketId } = await searchParams

    if (!customerId && !ticketId) {
      return (
        <>
          <h2 className='mb-2 text-2xl'>
            Ticket ID OR Customer ID required to load ticket form
          </h2>
          <BackButton title='Go Back' variant='default' className='w-[100px]' />
        </>
      )
    }

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      redirect('/auth/sign-in')
    }

    const userId = session.session.userId

    // New ticket form
    if (customerId) {
      const customer = await getCustomer(customerId)

      if (!customer) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>
              Customer ID #{customerId} not found
            </h2>
            <BackButton
              title='Go Back'
              variant='default'
              className='flex w-[100px]'
            />
          </>
        )
      }

      if (!customer.active) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>
              Customer ID #{customerId} is not active.
            </h2>
            <BackButton title='Go Back' variant='default' />
          </>
        )
      }

      // return ticket form
      // const user = await getCustomerUser(customer.userId)

      if (userId !== customer.userId) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>
              Customer-user ID and current-session-user ID do not match
            </h2>
            <BackButton
              title='Go Back'
              variant='default'
              className='w-[100px]'
            />
          </>
        )
      }

      return <TicketForm customer={customer} />
    }

    // Edit ticket form
    if (ticketId) {
      const ticket = await getTicket(ticketId)

      if (!ticket) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>Ticket ID #{ticketId} not found</h2>
            <BackButton title='Go Back' variant='default' />
          </>
        )
      }

      const customer = await getCustomer(ticket.customerId)

      // return ticket form

      return <TicketForm customer={customer} ticket={ticket} />
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error)
      throw error
    }
  }
}
