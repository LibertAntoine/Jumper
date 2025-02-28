import { computed } from 'vue'
import {
  useQuery as useInternalQuery,
  useQueryClient,
  type UseQueryOptions
} from '@tanstack/vue-query'

export const useQuery = <TData = unknown, TError = unknown>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey">
) => {
  const queryClient = useQueryClient()
  const query = useInternalQuery({
    queryKey,
    queryFn,
    ...options
  })
  return {
    ...query,
    setData: (updater: (old: TData) => TData | undefined) => {
      queryClient.setQueryData(queryKey, updater)
    },
    errorMessage: computed(() =>
      query.error instanceof Error ? query.error.message : undefined
    )
  }
}
