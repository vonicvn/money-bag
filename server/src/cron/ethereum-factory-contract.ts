import Web3 from 'web3'
import { Contract } from 'web3-eth/node_modules/web3-eth-contract'
import { EventLog as EthereumEventLog } from 'web3/node_modules/web3-core/types'
import HDWalletProvider from '@truffle/hdwallet-provider'
import { IFactoryContract } from '../global'

import { factoryAbi } from './abi'

export class EthereumFactoryContract {
  public web3: Web3
  public ethereumContract: Contract

  constructor(public factoryContract: IFactoryContract) {
    const SAMPLE_MNEMONIC = 'asthma elite library zebra giggle payment exit apart manual three divide absorb'
    const ETHEREUM_ACCESS_URL = `https://${factoryContract.network.toLowerCase()}.infura.io/v3/${this.factoryContract.infuraKey}`
    // tslint:disable-next-line: no-any
    this.web3 = new Web3(new HDWalletProvider(SAMPLE_MNEMONIC, ETHEREUM_ACCESS_URL) as any)
    this.ethereumContract = new this.web3.eth.Contract(factoryAbi, this.factoryContract.address)
  }

  getEthereumLogs(fromBlock: number, event: string): Promise<EthereumEventLog[]> {
    // tslint:disable-next-line: no-any
    return this
      .ethereumContract
      .getPastEvents(event, { fromBlock, toBlock: 'latest' })
  }
}
