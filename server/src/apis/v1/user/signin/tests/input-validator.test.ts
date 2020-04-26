import { hashSync } from 'bcrypt'
import { TestUtils, User, Password } from '../../../../../global'
import { InputValidator } from '../service'
import { equal } from 'assert'
import { EErrorCode } from '../metadata'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  const sampleInput = {
    email: 'example@gmail.com',
    password: '12345678',
  }

  beforeEach(async () => {
    const user = await User.create({
      email: sampleInput.email,
      name: 'Testing Account',
    })
    await Password.create({
      id: user.id,
      passwordHash: hashSync(sampleInput.password, 8),
    })
  })

  it(`${TEST_TITLE} InputValidator works with valid input`, async () => {
    await new InputValidator().validate(sampleInput)
  })

  it(`${TEST_TITLE} Given non existed email, it should throw an error`, async () => {
    const error = await new InputValidator()
      .validate({ ...sampleInput, email: 'nonexisted@gmail.com' })
      .catch(error => error)
    equal(error.code, EErrorCode.INVALID_CREDENTIALS)
  })

  it(`${TEST_TITLE} Given invalid password email, it should throw an error`, async () => {
    const error = await new InputValidator()
      .validate({ ...sampleInput, password: 'invalid-password' })
      .catch(error => error)
    equal(error.code, EErrorCode.INVALID_CREDENTIALS)
  })
})
