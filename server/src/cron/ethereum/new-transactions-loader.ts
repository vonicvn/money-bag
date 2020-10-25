import BigNumber from 'bignumber.js'
import { isNil } from 'lodash'
import {
  Redis,
  Transaction,
  BlockchainModule,
  Env,
  EEnvKey,
  EEnviroment,
  EBlockchainNetwork,
  ITransactionInput,
  ITransaction,
  WalletService,
  Wallet,
  Asset,
  PartnerAsset,
  AssetService,
  ECollectingStatus,
  exists,
  BlockchainJob,
} from '../../global'

export class NewTransactionsLoader {
  constructor(private network: EBlockchainNetwork) {}

  async load() {
    const { from, to } = await this.getRange()
    for (let block = from; block <= to; block++) {
      const transactionInputs = await BlockchainModule.get(this.network).getTransactionInputs(block)
      await Transaction.createMany(await this.filter(transactionInputs))
      await Redis.setJson<number>(`${this.network}_SCANNED_BLOCK`, block)
    }
  }

  async filter(transactionInputs: ITransactionInput[]): Promise<Partial<ITransaction>[]> {
    const result: Partial<ITransaction>[] = []
    for (const transactionInput of transactionInputs) {
      const { value, hash, assetAddress, block, network, toAddress } = transactionInput
      if (value === 0) continue
      if (!await AssetService.isAssetExisted(assetAddress)) return null
      if (!await WalletService.isAddressExisted(toAddress)) continue
      const wallet = await Wallet.findOne({ address: toAddress, network })
      const asset = await Asset.findOne({ address: assetAddress, network })
      const partnerWallet = await PartnerAsset.findOne({
        assetId: asset.assetId,
        partnerId: wallet.partnerId,
      })
      // prevent create transfer all ethereum transaction if it is from admin transfer to wallet to call aprrove ERC token request
      if (exists(await BlockchainJob.findOne({ hash }))) continue
      if (isNil(partnerWallet)) continue
      result.push({
        hash,
        partnerId: wallet.partnerId,
        block: block,
        value: new BigNumber(value).div(Math.pow(10, asset.decimals)).toNumber(),
        collectingStatus: ECollectingStatus.WAITING,
        assetId: asset.assetId,
        assetAddress: asset.address,
        assetName: asset.name,
        walletAddress: wallet.address,
        walletId: wallet.walletId,
      })
    }
    return result
  }

  private async getRange() {
    const currentBlock = await BlockchainModule.get(this.network).getBlockNumber()
    const defaultRange = {
      from: currentBlock - Env.SAFE_NUMBER_OF_COMFIRMATION,
      to: currentBlock - Env.SAFE_NUMBER_OF_COMFIRMATION,
    }

    const scanned = await Redis.getJson<number>(`${this.network}_SCANNED_BLOCK`)
    if (isNil(scanned)) return defaultRange

    const BIG_MISS_BLOCK = 20
    const shouldSkipBlocks = (
      Env.get(EEnvKey.NODE_ENV) !== EEnviroment.PRODUCTION &&
      currentBlock - scanned > BIG_MISS_BLOCK
    )
    if (shouldSkipBlocks) return defaultRange

    return {
      from: scanned + 1,
      to: currentBlock - Env.SAFE_NUMBER_OF_COMFIRMATION,
    }
  }
}
