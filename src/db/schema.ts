import { relations, sql } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  varchar
} from 'drizzle-orm/pg-core'

export const role = pgEnum('role', ['admin', 'member', 'owner'])

export type Role = (typeof role.enumValues)[number]

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: role('role').default('admin').notNull(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull()
})

export type User = typeof user.$inferSelect

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  )
})

export const customers = pgTable('customers', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'restrict' }),
  phone: varchar('phone').unique().notNull(),
  address1: varchar('address1').notNull(),
  address2: varchar('address2'),
  city: varchar('city').notNull(),
  state: varchar('state', { length: 2 }).notNull(),
  zip: varchar('zip', { length: 10 }).notNull(),
  notes: text('notes'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export type Customer = typeof customers.$inferSelect

export const tickets = pgTable('tickets', {
  id: text('id')
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  customerId: text('customer_id')
    .notNull()
    .references(() => customers.id),
  title: varchar('title').notNull(),
  description: text('description'),
  completed: boolean('completed').notNull().default(false),
  tech: varchar('tech').notNull().default('unassigned'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date())
})

export type Ticket = typeof tickets.$inferSelect

// Create relations
export const customersRelations = relations(customers, ({ many }) => ({
  tickets: many(tickets)
}))

export const ticketsRelations = relations(tickets, ({ one }) => ({
  customer: one(customers, {
    fields: [tickets.customerId],
    references: [customers.id]
  })
}))

export const schema = {
  user,
  session,
  account,
  verification,
  customers,
  customersRelations,
  tickets,
  ticketsRelations
}
