import { Context } from '../context'
import { queryField, nonNull, stringArg } from 'nexus'
import { getUserId, getUserIdFromEmail } from '../utils'

export const usersOwnedJobs = queryField((t) => {
  t.nonNull.list.nonNull.field('usersOwnedJobs', {
    type: 'Job',
    resolve: (_parent, _args, context: Context) => {
      const userId = getUserId(context)
      return context.prisma.job.findMany({
        where: {
          ownerId: userId,
        },
      })
    },
  })
})

export const findUsersOwnedJobsByEmail = queryField((t) => {
  t.nonNull.list.nonNull.field('findUsersOwnedJobsByEmail', {
    type: 'Job',
    args: {
      email: nonNull(stringArg()),
    },
    resolve: async (_parent, { email }, context: Context) => {
      const userId = await getUserIdFromEmail(email, context)
      return context.prisma.job.findMany({
        where: {
          ownerId: userId,
        },
      })
    },
  })
})
