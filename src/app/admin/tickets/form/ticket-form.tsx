'use client'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Form } from '@/components/ui/form'

import { Customer, Ticket } from '@/db/schema'
import { ticketSchema } from '@/zod-schemas/tickets'

interface TicketFormProps {
  customer: Customer // You must have a customer to start a ticket - so it is not optional
  ticket?: Ticket
}

export default function TicketForm({ customer, ticket }: TicketFormProps) {
  const form = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    mode: 'onBlur',
    defaultValues: {
      id: ticket?.id ?? '(New)',
      customerId: ticket?.customerId ?? customer.id,
      title: ticket?.title ?? '',
      description: ticket?.description ?? '',
      completed: ticket?.completed ?? false,
      tech: ticket?.tech ?? 'new-ticket@example.com'
    }
  })

  async function submitForm(data: z.infer<typeof ticketSchema>) {
    console.log(data)
  }

  return (
    <div className='flex flex-col gap-1 sm:px-8'>
      <div>
        <h2 className='text-2xl font-bold'>
          {ticket?.id ? `Edit Ticket # ${ticket.id}` : 'New Ticket Form'}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className='flex flex-col gap-4 sm:flex-row sm:gap-8'
        >
          <p>{JSON.stringify(form.getValues())}</p>
        </form>
      </Form>
    </div>
  )
}
