import { nonNull, arg, queryField } from 'nexus'
import { Context } from '../context'
import { getUserId } from '../utils'

export const allUsers = queryField((t) => {
  t.nonNull.list.nonNull.field('allUsers', {
    type: 'User',
    resolve: (_parent, _args, context: Context) => {
      return context.prisma.user.findMany()
    },
  })
})

export const me = queryField('me', {
  type: 'User',
  resolve: (_parent, _args, context: Context) => {
    const userId = getUserId(context)
    return context.prisma.user.findUnique({
      where: {
        id: String(userId),
      },
    })
  },
})

export const getUserType = queryField((t) => {
  t.nonNull.list.nonNull.field('getUserType', {
    type: 'User',
    args: {
      role: nonNull(arg({ type: 'Role' })),
    },
    resolve: (_parent, _args, context: Context) => {
      return context.prisma.user.findMany()
    },
  })
})
