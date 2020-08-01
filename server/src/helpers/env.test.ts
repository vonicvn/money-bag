import td from 'testdouble'
import { equal } from 'assert'
import { TimeHelper } from './time-helper'
import { TestUtils } from './test-utils'
import { Env } from './env'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`#INFURA_URL`, async () => {
    td.replace(TimeHelper, 'now')
    td.replace(Env, 'get', () => '["key1", "key2", "key3"]')

    td.when(TimeHelper.now()).thenReturn(
      new Date('08/04/2019 00:00:00 GMT+0').getTime(),
      new Date('08/04/2019 09:00:00 GMT+0').getTime(),
      new Date('08/04/2019 23:00:00 GMT+0').getTime()
    )

    equal(Env['getInfuraURL'](), 'key1')
    equal(Env['getInfuraURL'](), 'key2')
    equal(Env['getInfuraURL'](), 'key3')
  })
})
