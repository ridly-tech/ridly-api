import { objectType, asNexusMethod, inputObjectType } from "nexus";
import { GraphQLDateTime } from "graphql-scalars";

export const DateTime = asNexusMethod(GraphQLDateTime, 'date')

export const Job = objectType({
    name: 'Job',
    definition(t) {
        t.string('id')
        t.string('ownerId')
        t.string('creatorId')
        t.list.string('typeOfRubbish')
        t.string('street')
        t.string('suburb')
        t.string('city')
        t.string('postcode')
        t.date('date')
        t.date('createdAt')
        t.date('updatedAt')
    },
})

export const JobCreateInput = inputObjectType({
    name: 'JobCreateInput',
    definition(t) {
        t.nonNull.list.nonNull.string('typeOfRubbish')
        t.nonNull.string('street')
        t.nonNull.string('suburb')
        t.nonNull.string('city')
        t.nonNull.string('postcode')
        t.nonNull.date('date')
    },
})