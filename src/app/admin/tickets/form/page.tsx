import { BackButton } from '@/components/back-button'
import { getCustomer } from '@/server/customers'
import { getTicket } from '@/server/tickets'
import * as Sentry from '@sentry/nextjs'

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
      console.log(customer)
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
      console.log('ticket: ', ticket)
      console.log('customer: ', customer)
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error)
      throw error
    }
  }
}
