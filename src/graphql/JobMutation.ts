import {
  mutationField,
  nonNull,
  stringArg,
  list,
  arg,
  intArg,
  booleanArg,
  nullable,
} from 'nexus'
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
    bookingDateTime: nonNull(arg({ type: 'DateTime' })),
    timeWindow: nonNull(arg({ type: 'TimeWindow' })),
    typeOfRubbish: nonNull(list(nonNull(arg({ type: 'TypeOfRubbish' })))),
    quote: nonNull(intArg()),
  },
  resolve: async (
    _parent,
    {
      street,
      suburb,
      city,
      postcode,
      timeWindow,
      typeOfRubbish,
      bookingDateTime,
      quote,
    },
    context: Context,
  ) => {
    const userId = getUserId(context)
    if (!userId) {
      throw new Error('No user')
    }
    return context.prisma.job.create({
      data: {
        ownerId: userId,
        jobStatus: 'created',
        firstConfirm: false,
        secondConfirm: false,
        street,
        suburb,
        city,
        postcode,
        timeWindow,
        typeOfRubbish,
        bookingDateTime,
        quote,
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
    jobStatus: nonNull(arg({ type: 'JobStatus' })),
    street: nonNull(stringArg()),
    suburb: nonNull(stringArg()),
    city: nonNull(stringArg()),
    postcode: nonNull(stringArg()),
    firstConfirm: nonNull(booleanArg()),
    secondConfirm: nonNull(booleanArg()),
    quote: nullable(intArg()),
    revenue: nullable(intArg()),
  },
  resolve: async (
    _parent,
    {
      id,
      street,
      suburb,
      city,
      postcode,
      firstConfirm,
      secondConfirm,
      quote,
      revenue,
    },
    context: Context,
  ) => {
    findJobByIdOrThrow(id, context)
    await context.prisma.job.update({
      where: {
        id,
      },
      data: {
        street,
        suburb,
        city,
        postcode,
        firstConfirm,
        secondConfirm,
        quote,
        revenue,
      },
    })
    return await findJobByIdAndReturnJob(id, context)
  },
})

export const firstConfirmation = mutationField('firstConfirmation', {
  type: 'JobAdminMessage',
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, context: Context) => {
    await findJobByIdOrThrow(id, context)
    await context.prisma.job.update({
      where: {
        id,
      },
      data: {
        firstConfirm: true,
      },
    })
    const updatedJob = await findJobByIdAndReturnJob(id, context)
    if (!updatedJob) {
      throw new Error('Updated job does not exist')
    }
    if (!updatedJob.firstConfirm === true) {
      throw new Error('The job exists, but it has not been confirmed.')
    }
    return {
      success: true,
      message: `The job in ${updatedJob.suburb} with id #${updatedJob.id} has been confirmed.`,
    }
  },
})

export const secondConfirmation = mutationField('secondConfirmation', {
  type: 'JobAdminMessage',
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_parent, { id }, context: Context) => {
    await findJobByIdOrThrow(id, context)
    await context.prisma.job.update({
      where: {
        id,
      },
      data: {
        secondConfirm: true,
      },
    })
    const updatedJob = await findJobByIdAndReturnJob(id, context)
    if (!updatedJob) {
      throw new Error('Updated job does not exist')
    }
    if (!updatedJob.secondConfirm === true) {
      throw new Error('The job exists, but it has not been confirmed.')
    }
    return {
      success: true,
      message: `The job in ${updatedJob.suburb} with id #${updatedJob.id} has been confirmed.`,
    }
  },
})