import { TestUtils, IRequest } from '../../../../../global'
import { InputGetter } from '../service'
import { deepEqual } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} InputGetter works`, async () => {
    const request: IRequest = {
      body: {
        email: ' example@gmail.com  \n',
        name: ' Testing Account ',
        password: 'sample',
      },
    }
    deepEqual(
      new InputGetter().getInput(request),
      {
        email: 'example@gmail.com',
        name: 'Testing Account',
        password: 'sample',
      }
    )
  })
})
