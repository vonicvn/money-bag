import td from 'testdouble'
import { equal, ok } from 'assert'
import { TestUtils, Value, ErrorHandler, Wallet, Redis } from '../global'
import { WalletService } from './wallet.service'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it('#createWallet case 1: throw error when isCreatingWallet', async () => {
    WalletService.isCreatingWallet = true
    const error = await new WalletService().createWallet(
      Value.NO_MATTER,
      Value.NO_MATTER
    ).catch(error => error)
    ok(error instanceof Error)
    equal(WalletService.isCreatingWallet, true)
  })

  it('#createWallet case 2: run when not isCreatingWallet', async () => {
    WalletService.isCreatingWallet = false
    td.replace(WalletService.prototype, 'create')
    td.replace(ErrorHandler, 'handle')
    await new WalletService().createWallet(123, 321)

    td.verify(WalletService.prototype['create'](123, 321))
    equal(td.explain(ErrorHandler.handle).callCount, 0)
    equal(WalletService.isCreatingWallet, false)
  })

  it('#createWallet case 3: can handle error', async () => {
    WalletService.isCreatingWallet = false
    td.replace(WalletService.prototype, 'create', () => Promise.reject('_an_error_'))
    td.replace(ErrorHandler, 'handle')

    await new WalletService().createWallet(123, 321)
    td.verify(ErrorHandler.handle(Value.wrap('_an_error_')))
    equal(WalletService.isCreatingWallet, false)
  })

  it('#create', async () => {
    td.replace(Wallet, 'findOne', () => Promise.resolve({ index: 10 }))
    td.replace(Wallet, 'create')
    td.replace(Redis, 'setJson')
    td.replace(WalletService.prototype, 'getAddressAtIndex')

    td.when(WalletService.prototype['getAddressAtIndex'](11)).thenResolve('address_index_11')
    td.when(WalletService.prototype['getAddressAtIndex'](12)).thenResolve('address_index_12')

    await WalletService.prototype['create'](123, 2)

    td.verify(Wallet.create({
      address: 'address_index_11',
      index: 11,
      partnerId: 123,
    }))

    td.verify(Wallet.create({
      address: 'address_index_12',
      index: 12,
      partnerId: 123,
    }))

    td.verify(Redis.setJson(`SAVED_ADDRESS_address_index_11`, true))
    td.verify(Redis.setJson(`SAVED_ADDRESS_address_index_12`, true))
  })

  it('#getAddressAtIndex', async () => {
    const address = await WalletService.prototype['getAddressAtIndex'](0)
    ok(address.startsWith('0x'))
  })
})
