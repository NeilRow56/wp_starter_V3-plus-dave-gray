import { BackButton } from '@/components/back-button'
import * as Sentry from '@sentry/nextjs'

import { getCustomerUser } from '@/server/users'
import { getCustomerTwo } from '@/server/customers'
import CustomerForm from './customer-form'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function CustomerTwoFormPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  try {
    const { customerId } = await searchParams

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      redirect('/auth/sign-in')
    }

    const userId = session.session.userId

    if (!userId && !customerId) {
      return (
        <>
          <h2 className='mb-2 text-2xl'>
            Customer ID OR User ID required to load customer form
          </h2>
          <BackButton title='Go Back' variant='default' className='w-[100px]' />
        </>
      )
    }

    // New customer form

    if (userId) {
      const user = await getCustomerUser(userId)

      if (!user) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>User ID #{userId} not found</h2>
            <BackButton
              title='Go Back'
              variant='default'
              className='flex w-[100px]'
            />
          </>
        )
      }

      //   if (!customer.active) {
      //     return (
      //       <>
      //         <h2 className='mb-2 text-2xl'>
      //           Customer ID #{customerId} is not active.
      //         </h2>
      //         <BackButton title='Go Back' variant='default' />
      //       </>
      //     )
      //   }

      // return customer form
      if (userId && !customerId) {
        return <CustomerForm user={user} />
      }
    }

    // Edit customer form

    if (customerId) {
      const customer = await getCustomerTwo(customerId)

      if (!customer) {
        return (
          <>
            <h2 className='mb-2 text-2xl'>
              Customer ID #{customerId} not found
            </h2>
            <BackButton title='Go Back' variant='default' />
          </>
        )
      }

      const user = await getCustomerUser(customer.userId)

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

      // return customer form

      return <CustomerForm customer={customer} user={user} />
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error)
      throw error
    }
  }
}
