'use server'

import { db } from '@/db'
import { Customer, customers } from '@/db/schema'
import { auth } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'
import {
  insertCustomerSchema,
  insertCustomerSchemaType
} from '@/zod-schemas/customers'

import { and, asc, eq } from 'drizzle-orm'
import { flattenValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getAllCustomers() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect('/auth/sign-in')

  const allCustomers = await db
    .select()
    .from(customers)
    .orderBy(asc(customers.lastName))

  return allCustomers
}

export async function getExistingCustomerEmails() {
  const allCustomerEmails = await db.select().from(customers)

  return allCustomerEmails
}

// export async function getCustomer(userId: string) {
//   const customer = await db
//     .select()
//     .from(customers)
//     .where(and(eq(customers.userId, userId)))
//   // customer is returned as an array - even though there is only one item
//   return customer[0]
// }

export async function getCustomerById(id: string, userId: string) {
  return db.query.customers.findFirst({
    where: and(eq(customers.id, id), eq(customers.userId, userId))
  })
}

export async function getCustomer(id: string) {
  const customer = await db.select().from(customers).where(eq(customers.id, id))
  // customer is returned as an array - even though there is only one item
  return customer[0]
}

export async function createCustomer(
  customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    await db.insert(customers).values(customer)
    // return { success: true, message: 'Client created successfully' }
  } catch (error) {
    console.error(error)
    // return { success: false, message: 'Failed to create client' }
    return {
      error: 'Failed to create customer - email or username already exists'
    }
  }
}

export async function updateCustomer(
  customer: Omit<Customer, 'createdAt' | 'updatedAt'>
) {
  try {
    await db
      .update(customers)
      .set(customer)
      .where(eq(customers.id, customer.id))
  } catch (error) {
    console.error(error)
    return { error: 'Failed to update customer' }
  }
  revalidatePath('/admin/customers')
}

export const getAllCustomerByUserId = async (id: string, userId: string) => {
  try {
    const customersByUser = await db.query.customers.findFirst({
      where: and(eq(customers.id, id), eq(customers.userId, userId))
    })

    //   return { success: true, customer: customersByUser }
    // } catch {
    //   return { success: false, message: 'Failed to get customer' }
    // }

    return customersByUser
  } catch (error) {
    console.error(error)
    return { error: 'Failed to update customer' }
  }
}

export async function getCustomerTwo(id: string) {
  const customer = await db.select().from(customers).where(eq(customers.id, id))

  return customer[0]
}

//use-safe-actions

export const saveCustomerAction = actionClient
  .metadata({ actionName: 'saveCustomerAction' })
  .inputSchema(insertCustomerSchema, {
    handleValidationErrorsShape: async ve =>
      flattenValidationErrors(ve).fieldErrors
  })
  .action(
    async ({
      parsedInput: customer
    }: {
      parsedInput: insertCustomerSchemaType
    }) => {
      const session = await auth.api.getSession({
        headers: await headers()
      })

      if (!session) redirect('/auth/sign-in')

      // ERROR TESTS

      // throw Error('test error customer create action')

      // const data = await fetch('https://jsoplaceholder')

      // New Customer
      // All new customers are active by default - no need to set active to true
      // createdAt and updatedAt are set by the database

      if (customer.id === '') {
        const result = await db
          .insert(customers)
          .values({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            userId: customer.userId,
            phone: customer.phone,
            address1: customer.address1,
            // customer.address2 is an optional field
            ...(customer.address2?.trim()
              ? { address2: customer.address2 }
              : {}),
            city: customer.city,
            state: customer.state,
            zip: customer.zip,
            // customer.notes is an optional field
            ...(customer.notes?.trim() ? { notes: customer.notes } : {})
          })
          .returning({ insertedId: customers.id })

        return {
          message: `Customer ID #${result[0].insertedId} created successfully`
        }
      }

      // Existing customer
      // updatedAt is set by the database
      const result = await db
        .update(customers)
        .set({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          userId: customer.userId,
          phone: customer.phone,
          address1: customer.address1,
          // customer.address2 is an optional field
          address2: customer.address2?.trim() ?? null,
          city: customer.city,
          state: customer.state,
          zip: customer.zip,
          // customer.notes is an optional field
          notes: customer.notes?.trim() ?? null,
          active: customer.active
        })
        // ! confirms customer.id will always exist for the update function
        .where(eq(customers.id, customer.id!))
        .returning({ updatedId: customers.id })

      return {
        message: `Customer ID #${result[0].updatedId} updated successfully`
      }
    }
  )
