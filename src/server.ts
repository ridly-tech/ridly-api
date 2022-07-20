import { ApolloServer } from 'apollo-server'
import { createContext } from './context'
import { schema } from './schema'

const server = new ApolloServer({
  schema,
  context: createContext,
})

server.listen().then(({ url }) =>
  console.log(
    `\
🚀 Ridly Server ready at: ${url}. And it's definitely not rubbish.`,
  ),
)
