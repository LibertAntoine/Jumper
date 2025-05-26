import type { Action, DetailedAction } from '@@types'
import jumper from '@/services/jumper'
import { computed, ref } from 'vue'
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

  const create = async (action: Partial<Action>) => {
    const newAction = await jumper.actions.create(action)
    selectedAction.value = newAction
    actionsQuery.setData((prev) => {
      if (!prev) return [newAction]
      return [...prev, newAction]
    })
    return newAction
  }

  const update = async (
    actionId: DetailedAction['id'],
    action: Partial<DetailedAction>
  ) => {
    const updatedAction = await jumper.actions.update(actionId, action)
    actionDetailedQuery.setData(() => updatedAction)
    actionsQuery.refetch()
    return updatedAction
  }

  const updateThumbnail = async (
    actionId: DetailedAction['id'],
    thumbnail: File
  ) => {
    const { thumbnailUrl } = await jumper.actions.updateActionThumbnail(
      actionId,
      thumbnail
    )
    actionDetailedQuery.setData((old) => {
      if (!old) return null
      return {
        ...old,
        thumbnailUrl
      }
    })
    actionsQuery.refetch()
    return thumbnailUrl
  }

  const remove = async (actionId: DetailedAction['id']) => {
    await jumper.actions.remove(actionId)
    await actionsQuery.refetch()
    if (selectedAction.value?.id === actionId) {
      if (actionsQuery.data.value?.length) {
        selectedAction.value = actionsQuery.data.value[0]
      } else {
        selectedAction.value = null
      }
    }
  }

  return {
    actions: computed(() => actionsQuery.data.value ?? null),
    actionDetailed: computed(() => actionDetailedQuery.data.value ?? null),
    selectedAction,
    actionsQuery,
    actionDetailedQuery,
    search,
    create,
    update,
    updateThumbnail,
    remove
  }
}
