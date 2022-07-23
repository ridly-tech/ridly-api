import { mutationField, nonNull, stringArg } from 'nexus'
import { Context } from '../context'
import { getUserId } from '../utils'

export const createJob = mutationField('createJob', {
  type: 'Job',
  args: {
    street: nonNull(stringArg()),
    suburb: nonNull(stringArg()),
    city: nonNull(stringArg()),
    postcode: nonNull(stringArg()),
  },
  resolve: async (
    _parent,
    { street, suburb, city, postcode },
    context: Context,
  ) => {
    const userId = getUserId(context)
    if (!userId) {
      throw new Error('No user')
    }
    return context.prisma.job.create({
      data: {
        ownerId: userId,
        creatorId: userId,
        street,
        suburb,
        city,
        postcode,
      },
    })
  },
})
