import { objectType, inputObjectType, asNexusMethod } from 'nexus'
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
  },
})

export const JobAdminMessage = objectType({
  name: 'JobAdminMessage',
  definition(t) {
    t.boolean('success')
    t.string('message')
  },
})
