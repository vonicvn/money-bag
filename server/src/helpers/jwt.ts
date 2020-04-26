import { sign, verify, VerifyErrors } from 'jsonwebtoken'
import { Configs } from '../global'
import { Env, EEnvKey } from '.'

const JWT_SECRET_KEY = Env.get(EEnvKey.JWT_SECRET_KEY)

export class JWT {
  public static createToken<T>(obj: T, expiresIn = Configs.DEFAULT_TOKEN_EXPIRED_TIME): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(obj as Object | string | Buffer, JWT_SECRET_KEY, { expiresIn }, (err, token) => {
        if (err) return reject(err)
        resolve(token)
      })
    })
  }

  public static verifyToken<T>(token: string): Promise<T & { iat: number, exp: number }> {
    return new Promise((resolve, reject) => {
      verify(token, JWT_SECRET_KEY, (error: VerifyErrors, decoded: object) => {
        if (error) return reject(error)
        resolve(decoded as T & { iat: number, exp: number })
      })
    })
  }
}
