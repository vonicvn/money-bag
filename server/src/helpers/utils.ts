import { isNil } from 'lodash'

// tslint:disable-next-line: no-any
export const exists = (value: any) => {
  return !isNil(value)
}
