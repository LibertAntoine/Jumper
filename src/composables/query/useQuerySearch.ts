
import { ref, watch } from 'vue'
import { useDebounce } from '@vueuse/core'

export const useQuerySearch = (options: {
    search?: string
    searchDebounceTime?: number
}) => {
    const search = ref(options.search || '')
    const isSearchDebouncing = ref(false)
    const debouncedSearch = useDebounce(search, options.searchDebounceTime || 0)

    watch(debouncedSearch, () => (isSearchDebouncing.value = false))
    watch(search, () => (isSearchDebouncing.value = true))
  
    return {
        search,
        debouncedSearch,
        isSearchDebouncing
    }
}