'use client'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { InputWithLabel } from '@/components/form/input-with-label'
import { User } from '@/db/schema'
import {
  insertCustomerSchema,
  selectCustomerSchema
} from '@/zod-schemas/customers'

import { useAction } from 'next-safe-action/hooks'

import { TextAreaWithLabel } from '@/components/form/text-area-with-label'
import { Button } from '@/components/ui/button'
import { SelectWithLabel } from '@/components/form/select-with-label'
import { StatesArray } from '@/constants/states-array'

import { Input } from '@/components/ui/input'
import { CheckboxWithLabel } from '@/components/form/checkbox-with-label'
import { useState } from 'react'
import { saveCustomerAction } from '@/server/customers'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'
import { DisplayServerActionResponse } from '@/components/display-server-action-response'

interface CustomerFormProps {
  user: User // You must have a user to start a customer - so it is not optional
  customer?: selectCustomerSchemaType
}

type insertCustomerSchemaType = z.infer<typeof insertCustomerSchema>
type selectCustomerSchemaType = z.infer<typeof selectCustomerSchema>

export default function CustomerForm({ user, customer }: CustomerFormProps) {
  const [isLoading] = useState(false)
  const defaultValues: insertCustomerSchemaType = {
    id: customer?.id ?? '',
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

  const form = useForm<insertCustomerSchemaType>({
    resolver: zodResolver(insertCustomerSchema),
    mode: 'onBlur',
    defaultValues
  })

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction
  } = useAction(saveCustomerAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast.success(
          `Customer ${customer ? 'updated ' : 'added'} successfully`
        )
      }
    },
    onError({ error }) {
      console.log(error)
      toast.error(`Failed to ${customer ? 'update' : 'add'} customer`)
    }
  })

  async function submitForm(data: insertCustomerSchemaType) {
    executeSave(data)
  }

  return (
    <div className='container mx-auto mt-24'>
      <div className='flex flex-col gap-1 sm:px-8'>
        <DisplayServerActionResponse result={saveResult} />
        <div className='items-center justify-center'>
          <h2 className='text-2xl font-bold lg:text-3xl'>
            {customer?.id ? 'Edit' : 'New'} Customer{' '}
            {customer?.id ? `#${customer.id}` : 'Form'}
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

              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='First Name'
                nameInSchema='firstName'
              />

              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Last Name'
                nameInSchema='lastName'
              />

              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Address 1'
                nameInSchema='address1'
              />

              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Address 2'
                nameInSchema='address2'
              />

              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='City'
                nameInSchema='city'
              />

              <SelectWithLabel<insertCustomerSchemaType>
                fieldTitle='State'
                nameInSchema='state'
                data={StatesArray}
              />
            </div>

            <div className='flex w-full flex-col gap-4'>
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Zip Code'
                nameInSchema='zip'
              />

              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Email'
                nameInSchema='email'
              />

              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Phone'
                nameInSchema='phone'
              />

              <TextAreaWithLabel<insertCustomerSchemaType>
                fieldTitle='Notes'
                nameInSchema='notes'
                className='h-40 p-0'
              />

              {isLoading ? (
                <p>Loading...</p>
              ) : customer?.id ? (
                <CheckboxWithLabel<insertCustomerSchemaType>
                  fieldTitle='Active'
                  nameInSchema='active'
                  message='Yes'
                />
              ) : null}

              <div className='flex max-w-md justify-between'>
                <Button
                  type='submit'
                  className='w-3/4'
                  variant='default'
                  title='Save'
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <LoaderCircle className='animate-spin' /> Saving
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>

                <Button
                  type='button'
                  variant='destructive'
                  title='Reset'
                  onClick={() => {
                    form.reset(defaultValues)
                    resetSaveAction()
                  }}
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
