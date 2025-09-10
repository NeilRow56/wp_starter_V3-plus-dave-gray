'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import { InputWithLabel } from '@/components/form/input-with-label'
import { CheckboxWithLabel } from '@/components/form/checkbox-with-label'
import { TextAreaWithLabel } from '@/components/form/text-area-with-label'

import {
  insertTicketSchema,
  insertTicketSchemaType,
  selectTicketSchemaType
} from '@/zod-schemas/tickets'
import { useAction } from 'next-safe-action/hooks'
import { saveTicketAction } from '@/server/tickets'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'
import { selectCustomerSchemaType } from '@/zod-schemas/customers'
import { DisplayServerActionResponse } from '@/components/display-server-action-response'
import { SelectWithLabel } from '@/components/form/select-with-label'

type Props = {
  customer: selectCustomerSchemaType
  ticket?: selectTicketSchemaType

  // techs array not completed. It will need adding to props in ticket form when used
  techs?: {
    id: string
    description: string
  }[]
  isEditable?: boolean
}

export default function TicketForm({
  customer,
  ticket,
  techs,
  isEditable
}: Props) {
  const isManager = Array.isArray(techs)
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
    resolver: zodResolver(insertTicketSchema),
    defaultValues
  })

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction
  } = useAction(saveTicketAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast.success(`Ticket ${ticket ? 'updated ' : 'added'} successfully`)
      }
    },
    onError({ error }) {
      console.log(error)
      toast.error(`Failed to ${ticket ? 'update' : 'add'} ticket`)
    }
  })

  async function submitForm(data: insertTicketSchemaType) {
    executeSave(data)
  }

  return (
    <div className='flex flex-col gap-1 sm:px-8'>
      <DisplayServerActionResponse result={saveResult} />
      <div>
        <h2 className='text-2xl font-bold'>
          {/* {ticket?.id ? `Edit Ticket # ${ticket.id}` : 'New Ticket Form'} */}
          {ticket?.id && isEditable
            ? `Edit Ticket # ${ticket.id}`
            : ticket?.id
              ? `View Ticket # ${ticket.id}`
              : 'New Ticket Form'}
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
              disabled={isEditable}
            />
            {isManager ? (
              <SelectWithLabel<insertTicketSchemaType>
                fieldTitle='Tech ID'
                nameInSchema='tech'
                data={[
                  {
                    id: 'new-ticket@example.com',
                    description: 'new-ticket@example.com'
                  },
                  ...techs
                ]}
              />
            ) : (
              <InputWithLabel<insertTicketSchemaType>
                fieldTitle='Tech'
                nameInSchema='tech'
                disabled={true}
              />
            )}

            {ticket?.id ? (
              <CheckboxWithLabel<insertTicketSchemaType>
                fieldTitle='Completed'
                nameInSchema='completed'
                message='Yes'
                // disabled={!isEditable}
              />
            ) : null}

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

            {!isEditable ? (
              <div className='flex gap-2'>
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
            ) : null}
          </div>
        </form>
      </Form>
    </div>
  )
}
