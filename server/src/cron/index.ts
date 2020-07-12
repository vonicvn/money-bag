/* istanbul ignore file */
import { CronJob, CronCommand } from 'cron'
import { Scanner as EthereumScanner } from './ethereum/scanner'

function createJob(time: string, cb: CronCommand, runOnInit = false) {
  new CronJob(time, cb, null, true, null, undefined, runOnInit).start()
}

// const EVERY_ONE_SECOND = '*/1 * * * * *'
// const EVERY_TWO_SECOND = '*/1 * * * * *'
const EVERY_FIFTEEN_SECONDS = '*/15 * * * * *'
// const EVERY_ONE_MINUTE = '0 */1 * * * *'
// const EVERY_THREE_MINUTES = '0 */3 * * * *'
// const EVERY_FIVE_MINUTES = '0 */5 * * * *'
// const EVERY_TEN_MINUTES = '0 */10 * * * *'

export async function registerCronJobs() {
  createJob(EVERY_FIFTEEN_SECONDS, () => new EthereumScanner().process())
}
