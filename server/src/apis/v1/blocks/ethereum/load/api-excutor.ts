import { AbstractApiExcutor } from '../../../../shared'
import { IInput, IOutput } from './metadata'
import { EBlockchainNetwork, BlockchainModule } from '../../../../../global'

export class ApiExcutor extends AbstractApiExcutor<IInput, IOutput> {
  async process(): Promise<IOutput> {
    const transactions = await BlockchainModule
      .get(EBlockchainNetwork.ETHEREUM)
      .getTransactionInputs(this.input.blockNumber)
    console.log(transactions)
  }
}
