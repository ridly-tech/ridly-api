import { objectType, inputObjectType } from 'nexus'

export const Job = objectType({
  name: 'Job',
  definition(t) {
    t.string('id')
    t.string('ownerId')
    t.string('creatorId')
    t.string('street')
    t.string('suburb')
    t.string('city')
    t.string('postcode')
  },
})

export const JobCreateInput = inputObjectType({
  name: 'JobCreateInput',
  definition(t) {
    t.nonNull.string('ownerId')
    t.nonNull.string('creatorId')
    t.nonNull.string('street')
    t.nonNull.string('suburb')
    t.nonNull.string('city')
    t.nonNull.string('postcode')
  },
})
