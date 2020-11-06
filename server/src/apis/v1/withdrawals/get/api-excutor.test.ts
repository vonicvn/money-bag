import td from 'testdouble'
import { strictEqual } from 'assert'
import { TestUtils, Withdrawal, Value } from '../../../../global'
import { ApiExcutor } from './api-excutor'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} ApiExcutor works`, async () => {
    td.replace(Withdrawal, 'findById', (id: number) => `find_with_id_${id}`)
    const response = await new ApiExcutor().excute(
      { withdrawalId: 1 },
      Value.NO_MATTER_OBJECT
    )

    strictEqual(response, 'find_with_id_1')
  })
})
