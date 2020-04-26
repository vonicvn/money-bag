import { TestUtils, IRequest } from '../../../../../global'
import { InputGetter } from '../service'
import { deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} InputGetter works`, async () => {
    const request: IRequest = {
      body: {
        email: ' example@gmail.com  \n',
        password: 'sample \n',
      },
    }
    deepEqual(
      new InputGetter().getInput(request),
      {
        email: 'example@gmail.com',
        password: 'sample \n',
      }
    )
  })
})
