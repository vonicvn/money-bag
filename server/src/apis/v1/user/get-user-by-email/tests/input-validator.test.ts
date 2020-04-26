import { TestUtils, User } from '../../../../../global'
import { InputValidator } from '../service'
import { equal } from 'assert'
import { EErrorCode } from '../metadata'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  beforeEach(async () => {
    await User.create({
      email: 'example@gmail.com',
      name: 'Testing account',
    })
  })

  it(`${TEST_TITLE} InputValidator works with valid input`, async () => {
    await new InputValidator().validate({ email: 'example@gmail.com' })
  })

  it(`${TEST_TITLE} Given non existed email, it should throw an error`, async () => {
    const error = await new InputValidator()
      .validate({ email: 'nonexisted@gmail.com' })
      .catch(error => error)
    equal(error.code, EErrorCode.NOT_FOUND)
  })
})
