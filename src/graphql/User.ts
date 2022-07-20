import { APP_SECRET, getUserId } from '../utils'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import {
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  enumType,
  arg,
} from 'nexus'
import { Context } from '../context'
import { UserInputError } from 'apollo-server'

// Object and Response Types

export const Role = enumType({
  name: 'Role',
  members: ['admin', 'office', 'driver']
})

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('id')
    t.string('firstName')
    t.string('lastName')
    t.string('email')
    t.string('phone')
    t.string('image')
    t.string('password')
    t.field('role', { type: Role })
  },
})

export const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('email')
  },
})

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.string('firstName')
    t.nonNull.string('lastName')
    t.nonNull.string('phone')
    t.nonNull.string('image')
    t.nonNull.field('role', { type: Role })
  },
})

export const UserAdminMessage = objectType({
  name: 'UserAdminMessage',
  definition(t) {
    t.boolean('success')
    t.string('message')
  },
})

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
        return context.prisma.user.findUnique({
          where: {
            id: String(userId),
          },
        })
      },
    })
    t.nonNull.list.nonNull.field('getUserType', {
      type: 'User',
      args: {
        role: nonNull(arg({ type: "Role" }))
      },
      resolve: async (_parent, { role }, context: Context) => {
        return context.prisma.user.findMany({
          where: {
            role
          }
        })
      }
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
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        role: nonNull(stringArg()),
        phone: nonNull(stringArg()),
        image: nonNull(stringArg())
      },
      resolve: async (_parent, args, context: Context) => {
        const currentUserWithThatEmail = await context.prisma.user.findUnique({ where: { email: args.email } })
        if (currentUserWithThatEmail) {
          throw new UserInputError('A user with this email already exists.')
        }
        if (args.role !== 'admin' && args.role !== 'office' && args.role !== 'driver') {
          throw new UserInputError(`User role must be 'admin', 'office' or 'driver'.`)
        }
        const hashedPassword = await hash(args.password, 10)
        const user = await context.prisma.user.create({
          data: {
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            password: hashedPassword,
            role: args.role,
            phone: args.phone,
            image: args.image
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
    t.field('updateUser', {
      type: 'User',
      args: {
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        phone: nonNull(stringArg()),
        image: nonNull(stringArg())
      },
      resolve: async (_parent, { firstName, lastName, email, password, phone, image }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: {
            email,
          }
        })
        if (!user) {
          throw new Error(`No user found for email: ${email}`)
        }
        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
          throw new Error('Invalid password')
        }
        const updatedUser = {
          firstName,
          lastName,
          phone,
          image
        }
        return context.prisma.user.update({ where: { id: user.id }, data: { ...updatedUser } })
      }
    })
    t.field('deleteUser', {
      type: 'UserAdminMessage',
      args: {
        email: nonNull(stringArg())
      },
      resolve: async (_parent, { email }, context: Context) => {
        const user = await context.prisma.user.findUnique({
          where: {
            email,
          }
        })
        if (!user) {
          return new Error(`No user with the email '${email}' exists.`)
        }
        await context.prisma.user.delete({
          where: { id: user.id }
        })
        return {
          success: true,
          message: 'The user has been deleted.'
        }
      }
    })
  },
})