import { makeSchema } from 'nexus'
import { permissions } from './permissions'
import { applyMiddleware } from 'graphql-middleware'
import * as types from './graphql'

const schemaWithoutPermissions = makeSchema({
  types,
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

export const schema = applyMiddleware(schemaWithoutPermissions, permissions)
