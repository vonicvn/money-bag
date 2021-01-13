import _ from 'lodash'
import {
  Asset,
  AssetService,
  Wallet,
  WalletService,
} from '../global'
import { IBootstrapable } from './metadata'

export class RedisBoostrap implements IBootstrapable {
  async bootstrap() {
    await this.loadAssets()
    await this.loadWalletsForNewRedis()
  }

  private async loadAssets() {
    const assets = await Asset.findAll({}, builder => builder.whereNot({ address: null }))
    for (const asset of assets) await AssetService.cacheAssetOnRedis(asset.address)
  }

  private async loadWalletsForNewRedis() {
    if (await this.getShouldSkipLoadWallets()) return
    this.loadWallets()
  }

  private async loadWallets() {
    console.log('Load wallets')
    const assets = await Asset.findAll({}, builder => builder.whereNot({ address: null }))
    for (const asset of assets) await AssetService.cacheAssetOnRedis(asset.address)
    console.log('Done Loading wallets')
  }

  private async getShouldSkipLoadWallets() {
    const wallet = await Wallet.findOne({})
    if (_.isNil(wallet)) return true
    const existed = await WalletService.isAddressExisted(wallet.address)
    return existed
  }
}
