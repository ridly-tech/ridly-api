import { mutationField, nonNull, stringArg } from 'nexus'
import { Context } from '../context'
import { getUserId } from '../utils'

const findJobByIdOrThrow = async (jobId: string, context: Context) => {
  return await context.prisma.job.findUniqueOrThrow({
    where: {
      id: jobId,
    },
  })
}

const findJobByIdAndReturnJob = async (jobId: string, context: Context) => {
  return await context.prisma.job.findUnique({
    where: {
      id: jobId,
    },
  })
}

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
        street,
        suburb,
        city,
        postcode,
      },
    })
  },
})

export const deleteJob = mutationField('deleteJob', {
  type: 'JobAdminMessage',
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, context: Context) => {
    findJobByIdOrThrow(id, context)
    await context.prisma.job.delete({
      where: {
        id,
      },
    })
    return {
      success: true,
      message: 'The job has been deleted.',
    }
  },
})

export const updateJob = mutationField('updateJob', {
  type: 'Job',
  args: {
    id: nonNull(stringArg()),
    street: nonNull(stringArg()),
    suburb: nonNull(stringArg()),
    city: nonNull(stringArg()),
    postcode: nonNull(stringArg()),
  },
  resolve: async (_parent, { id, street, suburb, city, postcode }, context: Context) => {
    findJobByIdOrThrow(id, context)
    await context.prisma.job.update({
      where: {
        id
      },
      data: {
        street: street,
        suburb: suburb,
        city: city,
        postcode: postcode
      }
    })
    return await findJobByIdAndReturnJob(id, context)
  }
})
