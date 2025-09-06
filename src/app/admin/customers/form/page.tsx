import { BackButton } from '@/components/back-button'
import * as Sentry from '@sentry/nextjs'

import { getCustomerUser } from '@/server/users'
import { getCustomerTwo } from '@/server/customers'
import CustomerForm from './customer-form'

export default async function CustomerTwoFormPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  try {
    const { userId, customerId } = await searchParams

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
      console.log(user)
      return <CustomerForm user={user} />
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

      // return customer form
      console.log('customer: ', customer)
      console.log('user: ', user)
      return <CustomerForm customer={customer} user={user} />
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error)
      throw error
    }
  }
}
