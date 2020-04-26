import { TestUtils } from '../../../global'
import { equal } from 'assert'
import { ApiService, NullInputGetter, SkippedInputValidator, AbstractApiExcutor } from '../'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

class DummyApiExcutor extends AbstractApiExcutor<null, null> {
  async process(): Promise<null> {
    return null
  }
}

class DummyApiService extends ApiService<null, null> {
  inputGetter = new NullInputGetter()
  inputValidator = new SkippedInputValidator()
  excutor = new DummyApiExcutor()
}

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} ApiService works`, async () => {
    equal(await new DummyApiService().setContext(null, null).process(), null)
  })
})
