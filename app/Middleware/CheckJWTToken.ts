import jose from 'node-jose'
import jwt, { JwtHeader } from 'jsonwebtoken'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import ApiHelper from 'App/Helpers/ApiHelper'
import CacheHelper from 'App/Helpers/CacheHelper'
import UserService from 'App/Services/UserService'
import JwtException, { CODE } from 'App/Exceptions/JwtException'

interface TokenPayload {
  [key: string]: any
}

interface TokenDecoded {
  header: JwtHeader
  payload: TokenPayload
  token: string
}

const PUBLIC_KEY_URL = 'url alla public key'
const PUBLIC_KEY_CACHE_KEY = 'jwt_token'

export default class CheckJWTToken {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const authorizationHeader = ctx.request.header('Authorization')
    if (!authorizationHeader) {
      throw new JwtException(CODE.UNAUTHORIZED, 'Missing token')
    }

    const { header, payload, token } = await CheckJWTToken.decodeToken(authorizationHeader)

    await CheckJWTToken.checkExpiration(payload)

    try {
      await CheckJWTToken.checkSignature(header, token)
    } catch (e) {
      // If the token check fails it might be the fault of the stored and expired keys,
      // let's try again by forcing a key update.
      await CheckJWTToken.checkSignature(header, token, true)
    }

    await CheckJWTToken.saveContextUser(ctx, payload)

    await next()
  }

  private static async decodeToken(token: string): Promise<TokenDecoded> {
    token = token.replace('Bearer ', '')
    let decodeResult

    try {
      decodeResult = jwt.decode(token, { complete: true })
    } catch (e) {
      throw new JwtException(CODE.UNAUTHORIZED, 'Not a valid token')
    }

    if (!decodeResult) {
      throw new JwtException(CODE.UNAUTHORIZED, 'Not a valid token')
    }

    return {
      header: decodeResult.header,
      payload: decodeResult.payload,
      token,
    }
  }

  private static async checkExpiration(payload: TokenPayload) {
    if (Date.now() >= payload.exp * 1000) {
      throw new JwtException(CODE.EXPIRED)
    }
  }

  private static async checkSignature(
    header: JwtHeader,
    token: string,
    forceRefreshPublicKey = false
  ) {
    if (!header.kid) {
      throw new JwtException(CODE.UNAUTHORIZED, 'Invalid Kid')
    }

    const publicKeys = await CheckJWTToken.getPublicKey(forceRefreshPublicKey)
    const keystore = await jose.JWK.asKeyStore(publicKeys)
    const key = keystore.get(header.kid)

    try {
      await jose.JWS.createVerify(key).verify(token)
    } catch (e) {
      throw new JwtException(CODE.UNAUTHORIZED, 'Invalid JWT token')
    }
  }

  /**
   * This method takes care of caching the public key
   *
   * @param {boolean} force If true, forces the update of the public key
   * @returns {string} Public keys
   */
  private static async getPublicKey(force = false): Promise<string> {
    if (!CacheHelper.has(PUBLIC_KEY_CACHE_KEY) || force) {
      const keysValue = await ApiHelper({
        method: 'GET',
        url: PUBLIC_KEY_URL,
      })

      CacheHelper.set(PUBLIC_KEY_CACHE_KEY, keysValue)
    }

    return CacheHelper.get(PUBLIC_KEY_CACHE_KEY) as string
  }

  private static async handleUserData(payload: { [key: string]: any }): Promise<Partial<User>> {
    return {
      email: payload.email,
      firstname: payload.given_name,
      lastname: payload.family_name,
    }
  }

  private static async saveContextUser(ctx: HttpContextContract, payload: TokenPayload) {
    const partialUser = await CheckJWTToken.handleUserData(payload)
    const user = await UserService.firstOrCreate(partialUser.email!, partialUser)
    ctx.auth.login(user)

    // o se non si vuole usare il modulo Authentication di Adonis,
    // si può salvare l'utente in una variabile custom
    //    -> in questo caso bisogna registrare la variabile nel file 'contracts/Context.ts'
    ctx.loggedUser = await UserService.firstOrCreate(partialUser.email!, partialUser)
  }
}
