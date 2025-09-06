'use server'

import { db } from '@/db'
import { Customer, customers } from '@/db/schema'
import { auth } from '@/lib/auth'
import { and, asc, eq } from 'drizzle-orm'
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
