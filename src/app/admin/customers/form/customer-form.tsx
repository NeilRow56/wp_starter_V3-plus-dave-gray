'use client'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { InputWithLabel } from '@/components/form/input-with-label'
import { Customer, User } from '@/db/schema'
import { customerSchema } from '@/zod-schemas/customers'

import { TextAreaWithLabel } from '@/components/form/text-area-with-label'
import { Button } from '@/components/ui/button'
import { SelectWithLabel } from '@/components/form/select-with-label'
import { StatesArray } from '@/constants/states-array'

import { Input } from '@/components/ui/input'

interface CustomerFormProps {
  user: User // You must have a user to start a customer - so it is not optional
  customer?: Customer
}

type insertCustomerSchema = z.infer<typeof customerSchema>

export default function CustomerForm({ user, customer }: CustomerFormProps) {
  const defaultValues: insertCustomerSchema = {
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

  const form = useForm<insertCustomerSchema>({
    resolver: zodResolver(customerSchema),
    mode: 'onBlur',
    defaultValues
  })

  async function submitForm(data: insertCustomerSchema) {
    console.log(data)
  }

  return (
    <div className='container mx-auto mt-24'>
      <div className='flex flex-col gap-1 sm:px-8'>
        <div className='items-center justify-center'>
          <h2 className='text-2xl font-bold lg:text-3xl'>
            {customer?.id
              ? `Edit Customer # ${customer.id}`
              : 'New Customer Form'}
          </h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitForm)}
            className='mx-auto mt-8 flex w-4xl flex-col gap-4 md:gap-8 xl:flex-row'
          >
            <div className='flex w-full flex-col gap-4'>
              <FormField
                control={form.control}
                name='userId'
                render={({ field }) => (
                  <FormItem className='hidden'>
                    <FormControl>
                      <Input placeholder='' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <InputWithLabel<insertCustomerSchema>
                fieldTitle='First Name'
                nameInSchema='firstName'
              />

              <InputWithLabel<insertCustomerSchema>
                fieldTitle='Last Name'
                nameInSchema='lastName'
              />

              <InputWithLabel<insertCustomerSchema>
                fieldTitle='Address 1'
                nameInSchema='address1'
              />

              <InputWithLabel<insertCustomerSchema>
                fieldTitle='Address 2'
                nameInSchema='address2'
              />

              <InputWithLabel<insertCustomerSchema>
                fieldTitle='City'
                nameInSchema='city'
              />

              <SelectWithLabel<insertCustomerSchema>
                fieldTitle='State'
                nameInSchema='state'
                data={StatesArray}
              />
            </div>

            <div className='flex w-full flex-col gap-4'>
              <InputWithLabel<insertCustomerSchema>
                fieldTitle='Zip Code'
                nameInSchema='zip'
              />

              <InputWithLabel<insertCustomerSchema>
                fieldTitle='Email'
                nameInSchema='email'
              />

              <InputWithLabel<insertCustomerSchema>
                fieldTitle='Phone'
                nameInSchema='phone'
              />

              <TextAreaWithLabel<insertCustomerSchema>
                fieldTitle='Notes'
                nameInSchema='notes'
                className='h-40 p-0'
              />

              <div className='flex max-w-md justify-between'>
                <Button
                  type='submit'
                  className='w-3/5'
                  variant='default'
                  title='Save'
                >
                  Save
                </Button>

                <Button
                  type='button'
                  className='w-1/5'
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
    </div>
  )
}
