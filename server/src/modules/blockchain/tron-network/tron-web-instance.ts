import { defaultTo } from 'lodash'
import { Env, EEnvKey, TronWeb } from '../../../global'
import { AccountGenerator } from './account-generator'

export class TronWebInstance {
  static default = new TronWeb({
    fullHost: Env.get(EEnvKey.TRON_GRID_URL),
    privateKey: Env.get(EEnvKey.TRON_PRIVATE_KEY),
  })

  static getByPrivateKey(privateKey?: string) {
    return new TronWeb({
      fullHost: Env.get(EEnvKey.TRON_GRID_URL),
      privateKey: defaultTo(privateKey, Env.get(EEnvKey.TRON_PRIVATE_KEY)),
    })
  }

  static async getByWalletIndex(index: number) {
    const { privateKey } = await new AccountGenerator().getByIndex(index)
    return this.getByPrivateKey(privateKey)
  }
}
