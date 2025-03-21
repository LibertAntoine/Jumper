import type { Action, DetailedAction } from '@@types'
import { ref } from 'vue'
import { useQuery } from '@/composables'


export const useActionManager = () => {
  const search = ref('')
  const selectedAction = ref<DetailedAction | null>(null)

  const { data: actions, isFetched } = useQuery<Action[]>(
    ['actions', search],
    async () => {
      const data = await jumper.actions.getActions({
        limit: 50,
        search: search.value
      })
      if (!selectedAction.value && data.results.length)
        selectedAction.value = data.results[0]
      return data.results
    }
  )

  const select = (actionId: Action['id']) => {
    

  return {
    search,
    actions,
    isFetched
  }
}
