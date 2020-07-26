import { Redis } from '../global'
import { defaultTo, toLower } from 'lodash'

export class AssetService {
  static async cacheAssetOnRedis(address: string) {
    return Redis.setJson(`ASSET_${toLower(address)}`, true)
  }

  static async isAssetExisted(address: string) {
    return defaultTo(await Redis.getJson(`ASSET_${toLower(address)}`), false)
  }
}
