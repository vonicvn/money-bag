// tslint:disable-next-line: no-require-imports
import * as bip39 from 'bip39'
import * as bip32 from 'bip32'
import { Env, EEnvKey, TronWeb } from '../../../global'

export class AccountGenerator {
  async getByIndex(index: number) {
    const seed = await bip39.mnemonicToSeed(Env.get(EEnvKey.MNEMONIC))
    const node = bip32.fromSeed(seed)
    const child = node.derivePath(`m/44'/195'/${index}'/0/0`)
    const privateKey = child.privateKey.toString('hex')
    const address = TronWeb.address.fromPrivateKey(privateKey)
    return {
      privateKey,
      address,
    }
  }
}
