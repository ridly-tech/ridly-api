import { objectType, inputObjectType, enumType, list } from 'nexus'
import { Context } from '../context'
export const Role = enumType({
  name: 'Role',
  members: ['admin', 'office', 'driver'],
})

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('id')
    t.string('firstName')
    t.string('lastName')
    t.string('email')
    t.string('phone')
    t.string('image')
    t.string('password')
    t.field('role', { type: Role })
    t.list.field('ownedJobs', {
      type: 'Job',
      resolve: async (parent, _args, context: Context) => {
        if (!parent.id) {
          throw new Error('No user')
        }
        return context.prisma.job.findMany({
          where: {
            ownerId: parent.id,
          },
        })
      },
    })
  },
})

export const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('email')
  },
})

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.string('firstName')
    t.nonNull.string('lastName')
    t.nonNull.string('phone')
    t.nonNull.string('image')
    t.nonNull.field('role', { type: Role })
  },
})

export const UserAdminMessage = objectType({
  name: 'UserAdminMessage',
  definition(t) {
    t.boolean('success')
    t.string('message')
  },
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  },
})
