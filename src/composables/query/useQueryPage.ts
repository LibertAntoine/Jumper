import type { Page } from '@@types'
import { ref } from 'vue'

export const useQueryPage = (
  options: {
    page?: number
    limit?: number
  } = {}
) => {
  const currentPage = ref(options.page || 1)
  const limit = ref(options.limit || 25)
  const itemsCount = ref<number | undefined>(undefined)

  const catchPageError = (query: () => Promise<Page<any>>) => {
    return async () => {

        const data = await query()
        itemsCount.value = data.count
        return data

    }
  }

  return {
    currentPage,
    limit,
    itemsCount,
    catchPageError,
    keys: [currentPage, limit],
  }
}
