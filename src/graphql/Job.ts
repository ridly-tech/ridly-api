import { objectType, inputObjectType, asNexusMethod, enumType } from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from '../context'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

const findUserOrThrow = async (userId: string, context: Context) => {
  return await context.prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  })
}

export const Job = objectType({
  name: 'Job',
  definition(t) {
    t.string('id')
    t.string('ownerId')
    t.field('owner', {
      type: 'User',
      resolve: async (parent, _args, context: Context) => {
        if (!parent.ownerId) {
          throw new Error('No user associated with this job')
        }
        return context.prisma.user.findUniqueOrThrow({
          where: {
            id: parent.ownerId
          }
        })
      },
    })
    t.string('customerId')
    t.field('jobStatus', { type: 'JobStatus' })
    t.int('quote')
    t.int('revenue')
    t.string('street')
    t.string('suburb')
    t.string('city')
    t.string('postcode')
    t.date('bookingDateTime')
    t.field('timeWindow', { type: 'TimeWindow' })
    t.list.field('typeOfRubbish', { type: 'TypeOfRubbish' })
    t.boolean('firstConfirm')
    t.boolean('secondConfirm')
    t.date('createdAt')
    t.date('updatedAt')
  },
})

export const JobCreateInput = inputObjectType({
  name: 'JobCreateInput',
  definition(t) {
    t.nonNull.string('ownerId')
    t.nonNull.field('jobStatus', { type: 'JobStatus' })
    t.nonNull.string('street')
    t.nonNull.string('suburb')
    t.nonNull.string('city')
    t.nonNull.string('postcode')
    t.nonNull.date('bookingDateTime')
    t.nonNull.field('timeWindow', { type: 'TimeWindow' })
    t.nonNull.list.nonNull.field('typeOfRubbish', { type: 'TypeOfRubbish' })
  },
})

export const JobAdminMessage = objectType({
  name: 'JobAdminMessage',
  definition(t) {
    t.boolean('success')
    t.string('message')
  },
})

export const TimeWindow = enumType({
  name: 'TimeWindow',
  members: [
    'none',
    'six_am',
    'seven_am',
    'eight_am',
    'nine_am',
    'ten_am',
    'eleven_am',
    'twelve_pm',
    'one_pm',
    'two_pm',
    'three_pm',
    'four_pm',
    'five_pm',
  ],
})

export const TypeOfRubbish = enumType({
  name: 'TypeOfRubbish',
  members: ['sofa', 'mattress', 'fridge', 'washing_machine', 'misc'],
})

export const JobStatus = enumType({
  name: 'JobStatus',
  members: ['created', 'quoted', 'paid', 'cancelled'],
})
