import type { Page, User, Order } from '@@types'
import { ref } from 'vue'
import { useQuery, useQueryPage, useQuerySearch } from '.'
import jumper from '@/services/jumper'

export const useUsersQuery = (
  options: {
    page?: number
    limit?: number
    search?: string
    activeOnly?: boolean
    orderBy?: Order
    searchNeeded?: boolean
    searchDebounceTime?: number
  } = {}
) => {
  const { currentPage, limit, itemsCount, catchPageError } =
    useQueryPage(options)

  const { search, debouncedSearch, isSearchDebouncing } =
    useQuerySearch(options)

  const activeOnly = ref(options.activeOnly || true)
  const orderBy = ref<Order>(
    options.orderBy || { field: 'username', direction: 'asc' }
  )

  const query = useQuery<Page<User>>(
    ['users', currentPage, limit, activeOnly, debouncedSearch, orderBy],
    catchPageError(() => {
      if (options.searchNeeded && search.value === '')
        return Promise.resolve({ count: 0, results: [] })
      return jumper.users.getUsers({
        page: currentPage.value,
        limit: limit.value,
        active: activeOnly.value ? true : undefined,
        search: debouncedSearch.value || undefined,
        ordering: `${orderBy.value.direction == 'desc' ? '-' : ''}${orderBy.value.field}`
      })
    })
  )

  return {
    ...query,

    activeOnly,
    orderBy,

    currentPage,
    limit,
    itemsCount,

    search,
    isSearchDebouncing
  }
}
