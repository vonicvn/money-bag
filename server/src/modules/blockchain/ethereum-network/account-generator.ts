// tslint:disable-next-line: no-require-imports
import * as bip39 from 'bip39'
import { Env, EEnvKey } from '../../../global'
// tslint:disable-next-line: no-require-imports
const { hdkey } = require('ethereumjs-wallet')

export class AccountGenerator {
  async getByIndex(index: number) {
    const seed = await bip39.mnemonicToSeed(Env.get(EEnvKey.MNEMONIC))
    const hdwallet = hdkey.fromMasterSeed(seed)
    const path = `m/44'/60'/0'/0/`
    const wallet = hdwallet.derivePath(path + index).getWallet()
    const privateKey = wallet.getPrivateKey().toString('hex')
    const address = '0x' + wallet.getAddress().toString('hex')
    return { privateKey, address }
  }
}
