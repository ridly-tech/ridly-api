import { objectType, inputObjectType, asNexusMethod, enumType } from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

export const Job = objectType({
  name: 'Job',
  definition(t) {
    t.string('id')
    t.string('ownerId')
    t.string('street')
    t.string('suburb')
    t.string('city')
    t.string('postcode')
    t.date('bookingDateTime')
    t.field('timeWindow', { type: 'TimeWindow' })
    t.list.field('typeOfRubbish', { type: 'TypeOfRubbish' })
    t.date('createdAt')
    t.date('updatedAt')
  },
})

export const JobCreateInput = inputObjectType({
  name: 'JobCreateInput',
  definition(t) {
    t.nonNull.string('ownerId')
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
