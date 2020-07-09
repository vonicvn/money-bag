import { Redis } from '../global'
import { defaultTo, toLower } from 'lodash'

export class AssetService {
  static async cacheAssetOnRedis(address: string) {
    return Redis.setJson(`WALLET_${toLower(address)}`, true)
  }

  static async isAssetExisted(address: string) {
    return defaultTo(await Redis.getJson(`WALLET_${toLower(address)}`), false)
  }
}
