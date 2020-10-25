import { deepStrictEqual } from 'assert'
import { TestUtils } from '../global'
import { deepOmit } from './deep-omit'

const TEST_TITLE = TestUtils.getTestTitle(__filename)

describe(TEST_TITLE, () => {
  it(`${TEST_TITLE} - Can omit level 1`, () => {
    const value = { a: 1, b: 2, c: 3 }
    const omitted = deepOmit(value, ['a', 'b'])
    deepStrictEqual({ c: 3 }, omitted)
  })

  it(`${TEST_TITLE} - Can omit level 2`, () => {
    const value = { a: 1, b: 2, c: { b: 3, d: { x: 1 } } }
    const omitted = deepOmit(value, ['a', 'b'])
    deepStrictEqual({ c: { d: { x: 1 } } }, omitted)
  })

  it(`${TEST_TITLE} - Can omit level with array`, () => {
    // tslint:disable-next-line: no-any
    const value: any = { result: [ { a: 1 }, { b: 2 }, { c: 3 } ] }
    const omitted = deepOmit(value, ['a', 'b'])
    deepStrictEqual({ result: [ {}, {}, { c: 3 } ] }, omitted)
  })
})
