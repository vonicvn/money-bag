import { ok } from 'assert'
import { TestUtils } from '../../global'
import { RouteFinder } from '../route-finder'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} RouteFinder works`, async () => {
    const routes = await RouteFinder.find()
    ok(routes.length > 0)
  })
})
