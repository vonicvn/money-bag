import { cloneDeepWith, cloneDeep } from 'lodash'

export function deepOmit(collection: Object | Array<unknown>, excludeKeys: string[]) {
  // tslint:disable-next-line: no-any
  function omitFn(value: any) {
    if (value && typeof value === 'object') {
      excludeKeys.forEach((key: string) => {
        delete value[key]
      })
    }
  }

  return cloneDeepWith(cloneDeep(collection), omitFn)
}
