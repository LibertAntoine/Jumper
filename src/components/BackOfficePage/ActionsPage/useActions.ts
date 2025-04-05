import type { Action, DetailedAction } from '@@types'
import jumper from '@/services/jumper'
import { ref } from 'vue'
import { useQuery } from '@/composables'

export type ActionsComposable = ReturnType<typeof useActions>

export const useActions = () => {
  const search = ref('')
  const selectedAction = ref<Action | null>(null)

  // TODO: see how to manage infinite scroll
  const actionsQuery = useQuery<Action[]>(['actions', search], async () => {
    const data = await jumper.actions.getActions({
      limit: 50,
      search: search.value
    })
    if (!selectedAction.value && data.results.length)
      selectedAction.value = data.results[0]
    return data.results
  })

  const actionDetailedQuery = useQuery<DetailedAction | null>(
    ['action-detailed', selectedAction],
    async () => {
      if (!selectedAction.value) return null
      return jumper.actions.getDetailedAction(selectedAction.value.id)
    }
  )

  return {
    actions: actionsQuery.data,
    actionDetailed: actionDetailedQuery.data,
    selectedAction,
    actionsQuery,
    actionDetailedQuery,
    search
  }
}
