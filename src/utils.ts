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
