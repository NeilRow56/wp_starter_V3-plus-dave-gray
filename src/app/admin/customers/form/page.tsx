import { BackButton } from '@/components/back-button'
import { getCustomer } from '@/server/customers'
import * as Sentry from '@sentry/nextjs'

export default async function CustomerFormPage({
  searchParams
}: {
  searchParams: Promise<{
    [key: string]: string | undefined
  }>
}) {
  try {
    const { customerId } = await searchParams
    //Edit customer form

    if (customerId) {
      const customer = await getCustomer(customerId)

      // searchParams are always a string. If the customerId was a number
      // const customer = await getCustomer(parseInt(customerId))

      if (!customer)
        return (
          <>
            <h2 className='mb-20 text-2xl'>
              Customer ID #{customerId} not found
            </h2>
            <BackButton
              title='Go back'
              variant='default'
              className='flex w-[100px]'
            />
          </>
        )

      // put customer form component
    } else {
      // new customer form component
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error)
      throw error
    }
  }
}
