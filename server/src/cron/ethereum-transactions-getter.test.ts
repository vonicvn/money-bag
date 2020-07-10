import td from 'testdouble'
import { equal, ok, deepEqual } from 'assert'
import { TestUtils, Value, WalletService, Wallet, Redis, PartnerAsset, web3, Asset, EDefaultWalletId, Partner, AssetService } from '../global'
import { EthereumTransactionsGetter } from './ethereum-transactions-getter'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it('#get', async () => {
    td.replace(web3.eth, 'getBlock', () => ({ transactions: ['transaction1', 'transaction2'] }))
    td.replace(web3.eth, 'getPastLogs', () => (['log1', 'log2']))

    td.replace(EthereumTransactionsGetter.prototype, 'parseEthereumTransaction')
    td
      .when(EthereumTransactionsGetter.prototype['parseEthereumTransaction'](Value.wrap('transaction1')))
      .thenResolve({ hash: '0xtransaction1' })
    td
      .when(EthereumTransactionsGetter.prototype['parseEthereumTransaction'](Value.wrap('transaction2')))
      .thenResolve(null)

    td.replace(EthereumTransactionsGetter.prototype, 'parseEthereumLog')
    td
      .when(EthereumTransactionsGetter.prototype['parseEthereumLog'](Value.wrap('log1')))
      .thenResolve({ hash: '0xlog1' })
    td
      .when(EthereumTransactionsGetter.prototype['parseEthereumLog'](Value.wrap('log2')))
      .thenResolve(null)

    deepEqual(
      await EthereumTransactionsGetter.prototype.get(),
      [{ hash: '0xtransaction1' }, { hash: '0xlog1' }]
    )
    // console.log(await web3.eth.getPastLogs({ fromBlock: 10425131, toBlock: 10425131 }))
  })

  it('#parseEthereumLog case 1: not a token transfer', async () => {
    const log = Value.wrap({ topics: ['0x_wrong_topic'] })
    equal(await EthereumTransactionsGetter.prototype['parseEthereumLog'](log), null)
  })

  it('#parseEthereumLog case 2: not watched asset', async () => {
    td.replace(AssetService, 'isAssetExisted', () => false)
    const log = Value.wrap({
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
      address: 'not watched asset address',
    })
    equal(await EthereumTransactionsGetter.prototype['parseEthereumLog'](log), null)
  })

  it('#parseEthereumLog case 3: not a watched wallet', async () => {
    td.replace(AssetService, 'isAssetExisted', () => false)
    td.replace(WalletService, 'isAddressExisted', () => true)
    const log = Value.wrap({
      address: 'watched_asset_address',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '_some_from_address_does_not_matter',
        '0x0000000000000000000000001cbdd8336800dc3fe27daf5fb5188f0502ac1fc7',
      ],
    })
    equal(await EthereumTransactionsGetter.prototype['parseEthereumLog'](log), null)
  })

  it('#parseEthereumLog case 4: merchant does not subscribe for asset', async () => {
    td.replace(AssetService, 'isAssetExisted', () => true)
    td.replace(WalletService, 'isAddressExisted', () => true)
    td.replace(Wallet, 'findOne', () => ({}))
    td.replace(Asset, 'findOne', () => ({}))
    td.replace(PartnerAsset, 'findOne', () => Value.wrap(null))

    const log = Value.wrap({
      address: 'watched_asset_address',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '_some_from_address_does_not_matter',
        '0x000000000000000000000000_watched_address',
      ],
    })
    equal(await EthereumTransactionsGetter.prototype['parseEthereumLog'](log), null)
  })

  it('#parseEthereumLog case 5: create transaction', async () => {
    td.replace(AssetService, 'isAssetExisted')
    td.replace(WalletService, 'isAddressExisted')
    td.replace(Wallet, 'findOne')
    td.replace(Asset, 'findOne')
    td.replace(PartnerAsset, 'findOne')

    const log = Value.wrap({
      address: 'watched_asset_address',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '_some_from_address_does_not_matter',
        '0x000000000000000000000000_watched_address',
      ],
      blockNumber: 101,
      transactionHash: '0xhash',
      data: '0x111111111111',
    })

    td.when(AssetService.isAssetExisted('watched_asset_address')).thenResolve(true)
    td.when(WalletService.isAddressExisted('0x_watched_address')).thenResolve(true)

    td
      .when(Wallet.findOne({ address: '0x_watched_address' }))
      .thenResolve({ partnerId: 1 })
    td
      .when(Asset.findOne({ address: 'watched_asset_address' }))
      .thenResolve({ assetId: 2, decimals: 6, address: 'watched_asset_address' })

    td
      .when(PartnerAsset.findOne({ assetId: 2, partnerId: 1 }))
      .thenResolve({})

    deepEqual(
      await EthereumTransactionsGetter.prototype['parseEthereumLog'](log),
      {
        hash: log.transactionHash,
        assetId: 2,
        partnerId: 1,
        block: log.blockNumber,
        value: Number(log.data) / Math.pow(10, 6),
      }
    )
  })

  it('#parseEthereumTransaction case 1: create transaction', async () => {
    td.replace(WalletService, 'isAddressExisted', () => true)
    td.replace(Wallet, 'findOne')
    td.replace(PartnerAsset, 'findOne')
    td
      .when(Wallet.findOne({ address: '0x_watched_address' }))
      .thenResolve({ partnerId: 1 })
    td
      .when(PartnerAsset.findOne({ assetId: EDefaultWalletId.ETH, partnerId: 1 }))
      .thenResolve({})

    const ethereumTransaction = Value.wrap({
      to: '0x_watched_address',
      value: '10000000000000000000',
      hash: '0xhash',
      assetId: EDefaultWalletId.ETH,
      blockNumber: 9999,
    })
    deepEqual(
      await EthereumTransactionsGetter.prototype['parseEthereumTransaction'](ethereumTransaction),
      {
        assetId: 1,
        block: 9999,
        hash: '0xhash',
        partnerId: 1,
        value: 10,
      }
    )
  })

  it('#parseEthereumTransaction case 2: value = 0', async () => {
    const ethereumTransaction = Value.wrap({ value: '0' })
    equal(
      await EthereumTransactionsGetter.prototype['parseEthereumTransaction'](ethereumTransaction),
      null
    )
  })

  it('#parseEthereumTransaction case 2: not a watched address', async () => {
    td.replace(WalletService, 'isAddressExisted', () => false)
    const ethereumTransaction = Value.wrap({ value: '100' })
    equal(
      await EthereumTransactionsGetter.prototype['parseEthereumTransaction'](ethereumTransaction),
      null
    )
  })

  it('#parseEthereumTransaction case 3: partner do not follow ETH transactions', async () => {
    td.replace(WalletService, 'isAddressExisted', () => true)
    td.replace(Wallet, 'findOne')
    td.replace(PartnerAsset, 'findOne')
    td
      .when(Wallet.findOne({ address: '0x_watched_address' }))
      .thenResolve({ partnerId: 1 })
    td
      .when(PartnerAsset.findOne({ assetId: EDefaultWalletId.ETH, partnerId: 1 }))
      .thenResolve(null)

    const ethereumTransaction = Value.wrap({ value: '100', to: '0x_watched_address' })
    equal(
      await EthereumTransactionsGetter.prototype['parseEthereumTransaction'](ethereumTransaction),
      null
    )
  })
})
