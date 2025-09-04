'use server'

import { db } from '@/db'
import { customers } from '@/db/schema'
import { auth } from '@/lib/auth'
import { asc, eq } from 'drizzle-orm'
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

export async function getCustomer(id: string) {
  const customer = await db.select().from(customers).where(eq(customers.id, id))
  // customer is returned as an array - even though there is only one item
  return customer[0]
}
