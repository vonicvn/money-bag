// tslint:disable-next-line: no-require-imports
const hdAddress = require('hd-address')
import { Env, EEnvKey } from '../../global'

const hd = hdAddress.HD(Env.get(EEnvKey.MNEMONIC), hdAddress.keyType.mnemonic)

export class AccountGenerator {
  generate(index: number) {
    return hd.TRX.getAddress(index, 'aaa')
  }
}
