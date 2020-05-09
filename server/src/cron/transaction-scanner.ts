import { DepositContract, Transaction } from '../global'
import { OneAtMomemnt } from './one-at-moment'
import { EthereumFactoryContract } from './ethereum-factory-contract'
import { TransactionGetter, IEthereumDeposit } from './transaction-getter'

export class TransactionScanner extends OneAtMomemnt {
  constructor(private ethereumFactoryContracts: EthereumFactoryContract[]) {
    super()
  }

  async do() {
    for (let index = 0; index < this.ethereumFactoryContracts.length; index++) {
      const transactions = await TransactionGetter.get(this.ethereumFactoryContracts[index])
      for (let index = 0; index < transactions.length; index++) {
        await this.saveDeposit(transactions[index])
      }
    }
  }

  private async saveDeposit(transaction: IEthereumDeposit) {
    const depositContract = await DepositContract.findOne({ address: transaction.address })
    await Transaction.create({
      depositContractId: depositContract.depositContractId,
      hash: transaction.transactionHash,
      block: transaction.block,
      value: transaction.value,
      coinAddress: transaction.coinAddress,
    })
  }
}
