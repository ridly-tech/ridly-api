import { APP_SECRET, getUserId } from '../utils'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import {
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  enumType,
} from 'nexus'
import { Context } from '../context'
import { UserInputError } from 'apollo-server'

// Role enum type

export const Role = enumType({
  name: 'Role',
  members: ['admin', 'office', 'driver']
})

// User Type

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('id')
    t.string('name')
    t.string('email')
    t.field('role', { type: Role })
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
    t.nonNull.string('name')
    t.nonNull.field('role', { type: Role })
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
        role: nonNull(stringArg())
      },
      resolve: async (_parent, args, context: Context) => {
        if (args.role !== 'admin' && args.role !== 'office' && args.role !== 'driver') {
          throw new UserInputError(`User role must be 'admin', 'office' or 'driver'.`)
        }
        const hashedPassword = await hash(args.password, 10)
        const user = await context.prisma.user.create({
          data: {
            name: args.name,
            email: args.email,
            password: hashedPassword,
            role: args.role
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
