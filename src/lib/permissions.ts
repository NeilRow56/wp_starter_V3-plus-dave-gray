import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access'

const statements = {
  ...defaultStatements,
  project: ['create', 'read', 'update', 'delete']
} as const

export const ac = createAccessControl(statements)

export const roles = {
  team: ac.newRole({
    project: ['read']
  }),
  manager: ac.newRole({
    project: ['read', 'update']
  }),

  admin: ac.newRole({
    project: ['create', 'read', 'update', 'delete'],
    ...adminAc.statements
  })
}
