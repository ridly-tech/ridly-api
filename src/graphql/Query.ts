import { objectType } from "nexus"
import { Context } from '../context'
import { getUserId } from '../utils'
import { nonNull, arg } from "nexus"

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.user.findMany()
      },
    })
    t.nullable.field('me', {
      type: 'User',
      resolve: (parent, args, context: Context) => {
        const userId = getUserId(context)
        return context.prisma.user.findUnique({
          where: {
            id: String(userId),
          },
        })
      },
    })
    t.nonNull.list.nonNull.field('getUserType', {
      type: 'User',
      args: {
        role: nonNull(arg({ type: "Role" }))
      },
      resolve: async (_parent, { role }, context: Context) => {
        return context.prisma.user.findMany({
          where: {
            role
          }
        })
      }
    })
    t.nonNull.list.nonNull.field('usersJobs', {
      type: 'Job',
      resolve: (_parent, _args, context: Context) => {
        const userId = getUserId(context)
        return context.prisma.job.findMany({
          where: {
            ownerId: userId
          }
        })
      }
    })
  },
})