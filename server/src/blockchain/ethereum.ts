import { Env, EEnvKey } from '../global'
import Web3 from 'web3'
import HDWalletProvider from '@truffle/hdwallet-provider'

export const web3 = new Web3(new HDWalletProvider(
  Env.get(EEnvKey.MNEMONIC),
  Env.get(EEnvKey.INFURA_URL)
// tslint:disable-next-line: no-any
) as any)
