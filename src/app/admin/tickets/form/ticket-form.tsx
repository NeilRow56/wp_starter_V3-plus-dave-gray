'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import { InputWithLabel } from '@/components/form/input-with-label'
import { CheckboxWithLabel } from '@/components/form/checkbox-with-label'
import { TextAreaWithLabel } from '@/components/form/text-area-with-label'
import z4 from 'zod/v4'
import { ticketSchema } from '@/zod-schemas/tickets'
import { Customer, Ticket } from '@/db/schema'

type Props = {
  customer: Customer // You must have a customer to start a ticket , so it is not optional
  ticket?: Ticket
}

type insertTicketSchemaType = z4.infer<typeof ticketSchema>

export default function TicketForm({ customer, ticket }: Props) {
  const defaultValues: insertTicketSchemaType = {
    id: ticket?.id ?? '(New)',
    customerId: ticket?.customerId ?? customer.id,
    title: ticket?.title ?? '',
    description: ticket?.description ?? '',
    completed: ticket?.completed ?? false,
    tech: ticket?.tech ?? 'new-ticket@example.com'
  }

  const form = useForm<insertTicketSchemaType>({
    mode: 'onBlur',
    resolver: zodResolver(ticketSchema),
    defaultValues
  })

  async function submitForm(data: insertTicketSchemaType) {
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
          className='flex flex-col gap-4 md:flex-row md:gap-8'
        >
          <div className='flex w-full max-w-xs flex-col gap-4'>
            <InputWithLabel<insertTicketSchemaType>
              fieldTitle='Title'
              nameInSchema='title'
            />

            <InputWithLabel<insertTicketSchemaType>
              fieldTitle='Tech'
              nameInSchema='tech'
              disabled={true}
            />

            <CheckboxWithLabel<insertTicketSchemaType>
              fieldTitle='Completed'
              nameInSchema='completed'
              message='Yes'
            />

            <div className='mt-4 space-y-2'>
              <h3 className='text-lg'>Customer Info</h3>
              <hr className='w-4/5' />
              <p>
                {customer.firstName} {customer.lastName}
              </p>
              <p>{customer.address1}</p>
              {customer.address2 ? <p>{customer.address2}</p> : null}
              <p>
                {customer.city}, {customer.state} {customer.zip}
              </p>
              <hr className='w-4/5' />
              <p>{customer.email}</p>
              <p>Phone: {customer.phone}</p>
            </div>
          </div>

          <div className='flex w-full max-w-xs flex-col gap-4'>
            <TextAreaWithLabel<insertTicketSchemaType>
              fieldTitle='Description'
              nameInSchema='description'
              className='h-96'
            />

            <div className='flex gap-2'>
              <Button
                type='submit'
                className='w-3/4'
                variant='default'
                title='Save'
              >
                Save
              </Button>

              <Button
                type='button'
                variant='destructive'
                title='Reset'
                onClick={() => form.reset(defaultValues)}
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
