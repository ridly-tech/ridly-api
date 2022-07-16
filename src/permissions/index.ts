import { rule, shield, or } from 'graphql-shield'
import { getUserId, getUserDetails } from '../utils'
import { Context } from '../context'

const rules = {
  isAuthenticatedUser: rule()((_parent, _args, context: Context) => {
    const userId = getUserId(context)
    return Boolean(userId)
  }),
  isCurrentUserEmail: rule()( async (_parent, {email}, context: Context) => {
    const user = await getUserDetails(context)
    if (user?.email === email) {
      return true
    } else {
      return new Error('You do not have authorization to execute this query or mutation.')
    }
  }),
  isAdmin: rule()( async (_parent, _args, context: Context) => {
    const user = await getUserDetails(context)
    if (user?.role === 'admin') {
      return true
    } else {
      return new Error('You are an admin. An error has been found.')
    }
  }),
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
  },
  Mutation: {
    updateUser: or(rules.isCurrentUserEmail, rules.isAdmin),
    deleteUser: or(rules.isAdmin, rules.isAuthenticatedUser)
  },
}, {allowExternalErrors: true} )
