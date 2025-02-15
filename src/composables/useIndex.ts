import { computed, toRef, type MaybeRef } from 'vue'

export const useIndex = <
  T extends Record<string | number | symbol, any>,
  TField extends keyof T
>(
  items: MaybeRef<T[] | undefined>,
  field: TField
) => {
  return computed(() => {
    const refItems = toRef(items)
    if (!refItems.value) return undefined
    return refItems.value.reduce(
      (acc, item) => {
        acc[item[field]] = item
        return acc
      },
      {} as Record<T[TField], T>
    )
  })
}
