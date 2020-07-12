import td from 'testdouble'
import { TestUtils, ErrorHandler } from '../global'
import { equal } from 'assert'
import { OneAtMomemnt } from './one-at-moment'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

class DummyJob extends OneAtMomemnt {
  async do() { return }
}

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} call #do if not running`, async () => {
    const job = new DummyJob()
    td.replace(job, 'do', td.function())
    await job.process()

    td.verify(job.do())
    equal(job.isRunning, false)
  })

  it(`${TEST_TITLE} dont call #do if it is running`, async () => {
    const job = new DummyJob()
    td.replace(job, 'isRunning', true)
    td.replace(job, 'do', td.function())

    await job.process()
    equal(td.explain(job.do).callCount, 0)
  })

  it(`${TEST_TITLE} Finish process even method #do throws error`, async () => {
    td.replace(ErrorHandler, 'handle', td.function())
    const job = new DummyJob()

    const sampleError = new Error('SAMPLE_ERROR')
    td.replace(job, 'do', () => { throw sampleError })

    await job.process()
    td.verify(ErrorHandler.handle(sampleError))
    equal(job.isRunning, false)
  })
})
