'use client'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Form } from '@/components/ui/form'

import { Customer, User } from '@/db/schema'

import { customerSchema } from '@/zod-schemas/customers'

interface CustomerFormProps {
  user: User // You must have a user to start a customer - so it is not optional
  customer?: Customer
}

export default function CustomerForm({ user, customer }: CustomerFormProps) {
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: customer?.firstName ?? '',
      lastName: customer?.lastName ?? '',
      email: customer?.email ?? '',
      userId: customer?.userId ?? user.id,
      phone: customer?.phone ?? '',
      address1: customer?.address1 ?? '',
      address2: customer?.address2 ?? '',
      city: customer?.city ?? '',
      state: customer?.state ?? '',
      zip: customer?.zip ?? '',
      notes: customer?.notes ?? '',
      active: customer?.active ?? true
    }
  })

  async function submitForm(data: z.infer<typeof customerSchema>) {
    console.log(data)
  }

  return (
    <div className='flex flex-col gap-1 sm:px-8'>
      <div>
        <h2 className='text-2xl font-bold'>
          {customer?.id
            ? `Edit Customer # ${customer.id}`
            : 'New Customer Form'}
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
