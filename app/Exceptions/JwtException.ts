import { Exception } from '@adonisjs/core/build/standalone'

export enum CODE {
  UNAUTHORIZED = 'E_UNAUTHORIZED',
  EXPIRED = 'E_JWT_EXPIRED',
}

const statusCode: { [key in CODE]: number } = {
  [CODE.UNAUTHORIZED]: 400,
  [CODE.EXPIRED]: 401,
}

export default class JwtException extends Exception {
  constructor(codeException: CODE, message?: string) {
    if (!message && codeException === CODE.EXPIRED) {
      message = 'Token Expired'
    }

    message = `JWT token validation failed: ${message}`

    super(message, statusCode[codeException], codeException)
  }
}
