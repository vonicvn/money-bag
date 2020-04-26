import td from 'testdouble'
import bcrypt from 'bcrypt'
import { TestUtils, JWT, deepOmit, User, Password } from '../../../../../global'
import { ApiExcutor } from '../service'
import { IInput } from '../metadata'
import { deepEqual, equal } from 'assert'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  const sampleInput: IInput = {
    email: 'example@gmail.com',
    name: 'Testing Account',
    password: '12345678',
  }

  beforeEach(TEST_TITLE, () => {
    td.replace(bcrypt, 'hash', () => Promise.resolve('SAMPLE_HASH'))
    td.replace(JWT, 'createToken', () => Promise.resolve('SAMPLE_TOKEN'))
  })

  it(`${TEST_TITLE} Can create account`, async () => {
    const result = await new ApiExcutor().excute(sampleInput)
    equal(result, undefined)

    const user = await User.findOne({ email: 'example@gmail.com' })
    deepEqual(
      deepOmit(user, ['id', 'created', 'modified']),
      {
        email: 'example@gmail.com',
        name: 'Testing Account',
      }
    )

    deepEqual(
      await Password.findById(user.id, builder => builder.select(['id', 'passwordHash'])),
      {
        id: user.id,
        passwordHash: 'SAMPLE_HASH',
      }
    )
  })
})
