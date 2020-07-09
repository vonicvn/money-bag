import { Asset, AssetService } from '../global'
import { IBootstrapable } from './metadata'

export class RedisBoostrap implements IBootstrapable {
  async bootstrap() {
    const assets = await Asset.findAll({}, builder => builder.whereNot({ address: null }))
    for (const asset of assets) await AssetService.cacheAssetOnRedis(asset.address)
  }
}
