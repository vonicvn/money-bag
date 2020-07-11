import { Env, EEnvKey } from '../global'
import Web3 from 'web3'
import HDWalletProvider from '@truffle/hdwallet-provider'

export const web3 = new Web3(new HDWalletProvider(
  Env.get(EEnvKey.MNEMONIC),
  Env.get(EEnvKey.INFURA_URL)
// tslint:disable-next-line: no-any
) as any)

export class WebInstanceManager {
  static getWeb3ByKey(privateKeyOrMnemonic: string): Web3 {
    return new Web3(
      new HDWalletProvider(
        privateKeyOrMnemonic,
        Env.get(EEnvKey.INFURA_URL),
        1,
        1
      // tslint:disable-next-line: no-any
      ) as any
    )
  }

  static getWeb3ByWalletIndex(index: number) {
    return new Web3(
      new HDWalletProvider(
        Env.get(EEnvKey.MNEMONIC),
        Env.get(EEnvKey.INFURA_URL),
        index,
        1
      // tslint:disable-next-line: no-any
      ) as any
    )
  }
}
