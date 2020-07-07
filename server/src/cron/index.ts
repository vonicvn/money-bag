/* istanbul ignore file */
// import { FactoryContract } from '../global'
import { CronJob, CronCommand } from 'cron'
import { map } from 'lodash'
// import { EthereumFactoryContract } from './ethereum-factory-contract'
// import { DepositContractScanner } from './deposit-contract-scanner'
// import { TransactionScanner } from './transaction-scanner'

function createJob(time: string, cb: CronCommand, runOnInit = false) {
  new CronJob(time, cb, null, true, null, undefined, runOnInit).start()
}

enum ECronTime {
  EVERY_ONE_SECOND = '*/1 * * * * *',
  EVERY_TWO_SECOND = '*/1 * * * * *',
  EVERY_FIFTEEN_SECONDS = '*/15 * * * * *',
  EVERY_ONE_MINUTE = '0 */1 * * * *',
  EVERY_THREE_MINUTES = '0 */3 * * * *',
  EVERY_FIVE_MINUTES = '0 */5 * * * *',
  EVERY_TEN_MINUTES = '0 */10 * * * *',
}

export async function registerCronJobs() {
  // const factoryContracts = await FactoryContract.findAll({ status: 'ENABLED' })
  // const ethereumFactoryContracts = map(factoryContracts, contract => new EthereumFactoryContract(contract))
  // const depositContractScanner = new DepositContractScanner(ethereumFactoryContracts)
  // const transactionScannder = new TransactionScanner(ethereumFactoryContracts)
  // createJob(ECronTime.EVERY_TEN_MINUTES, () => depositContractScanner.process(), true)
  // createJob(ECronTime.EVERY_ONE_MINUTE, () => transactionScannder.process(), true)
}
