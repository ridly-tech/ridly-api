import { APP_SECRET, getUserId } from '../utils'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import {
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  asNexusMethod,
  enumType,
  booleanArg,
} from 'nexus'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from '../context'
import { UserInputError } from 'apollo-server'

export const DateTime = asNexusMethod(DateTimeResolver, 'date')

// User Type

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('id')
    t.string('name')
    t.string('email')
  },
})

// Unique User Input Type

export const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.string('id')
    t.string('email')
  },
})

// Create User Input Type

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.string('name')
    t.nullable.boolean('isAdmin')
  },
})

// AuthPayload (login and logout with JWT) object

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  },
})

// User Queries

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: (_parent, _args, context: Context) => {
        return context.prisma.user.findMany()
      },
    })

    t.nullable.field('me', {
      type: 'User',
      resolve: (parent, args, context: Context) => {
        const userId = getUserId(context)
        console.log(userId)
        return context.prisma.user.findUnique({
          where: {
            id: String(userId),
          },
        })
      },
    })
  },
})

// User Mutations

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        isAdmin: nonNull(booleanArg())
      },
      resolve: async (_parent, args, context: Context) => {
        if (args.name === 'Daniel') {
          throw new UserInputError('Nobody called Daniel allowed.')
        }
        const hashedPassword = await hash(args.password, 10)
        const user = await context.prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
            isAdmin: args.isAdmin ?? false
          },
        })
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })
    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, { email, password }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: {
            email,
          },
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        }
      },
    })
  },
})
