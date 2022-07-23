import { verify } from 'jsonwebtoken'
import { Context } from './context'

const nodeSecret: string = (process.env.APP_SECRET as string)

export const APP_SECRET = nodeSecret

interface Token {
  userId: string
}

export function getUserId(context: Context) {
  const authHeader = context.req.get('Authorization')
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET) as Token
    return verifiedToken && String(verifiedToken.userId)
  }
}

export async function getUserDetails(context: Context) {
  const userId = getUserId(context)
  if (userId === undefined) {
    throw new Error('User ID is Undefined')
  }
  const user = await context.prisma.user.findUnique({
    where: {
      id: userId
    },
  })
  if (user) {
    return user
  }
}

export async function getUserEmail(context: Context) {
  const userId = getUserId(context)
  if (userId === undefined) {
    throw new Error('User ID is Undefined')
  }
  const user = await context.prisma.user.findUnique({
    where: {
      id: userId
    },
  })
  if (user) {
    if (user.email !== null) {
      return user.email
    }
  } else {
    throw new Error('User does not have an email address')
  }
}

export async function getUserIdFromEmail(email: string, context: Context) {
  const user = await context.prisma.user.findUnique({
    where: {
      email: email
    }
  })
  if (user) {
    return user.id
  } else {
    throw new Error('User with that email does not exist.')
  }
}