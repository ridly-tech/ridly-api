import { rule, shield } from 'graphql-shield'
import { getUserId, getUserDetails } from '../utils'
import { Context } from '../context'

const rules = {
  isAuthenticatedUser: rule()((_parent, _args, context: Context) => {
    const userId = getUserId(context)
    return Boolean(userId)
  }),
  isCurrentAuthenticatedUserOrAdmin: rule()( async (_parent, {email}, context: Context) => {
    const user = await getUserDetails(context)
    // console.log(`The user requesting to make changes or to view documents is: 🤡 ${email}`)
    // console.log(`The user who is logged in is ${user?.email}`)
    if (user?.email === email || user?.role === 'admin') {
      return true
    } else {
      return false
    }
  })
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
  },
  Mutation: {
    updateUser: rules.isCurrentAuthenticatedUserOrAdmin
  },
}, {allowExternalErrors: true})
