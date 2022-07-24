import { objectType } from 'nexus'
import { Context } from '../context'

export const Customer = objectType({
  name: 'Customer',
  definition(t) {
    t.string('id')
    t.string('street')
    t.string('suburb')
    t.string('city')
    t.string('postcode')
    t.date('createdAt')
    t.date('updatedAt')
    t.list.field('jobs', {
      type: 'Job',
      resolve: async (parent, _args, context: Context) => {
        if (!parent.id) {
          throw new Error('No user')
        }
        return context.prisma.job.findMany({
          where: {
            customerId: parent.id,
          },
        })
      },
    })
    t.field('numberOfJobs', {
      type: 'Int',
      resolve: async (parent, _args, context: Context) => {
        if (!parent.id) {
          throw new Error('No user')
        }
        const jobs = await context.prisma.job.findMany({
          where: {
            customerId: parent.id,
          },
        })
        if (!jobs) {
          throw new Error('No jobs')
        }
        return jobs.length
      },
    })
    t.field('totalRevenue', {
      type: 'Float',
      resolve: async (parent, _args, context: Context) => {
        if (!parent.id) {
          throw new Error('No user')
        }
        const jobs = await context.prisma.job.findMany({
          where: {
            customerId: parent.id,
          },
        })
        if (!jobs) {
          throw new Error('No jobs')
        }
        let revenue = 0
        jobs.forEach((job) => {
          if (job.revenue) {
            revenue += job.revenue
          }
        })
        return revenue
      },
    })
    t.string('mobilePhone')
    t.string('alternatePhone')
  },
})
