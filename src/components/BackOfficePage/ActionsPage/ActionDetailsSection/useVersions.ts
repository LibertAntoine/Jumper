import { ActionDataVersion, DetailedAction, ActionData } from '@@types/action'
import type { ActionDetailedForm } from './useActionDetailedForm'
import { useQuery } from '@/composables'
import jumper from '@/services/jumper'
import { computed, MaybeRefOrGetter, ref, toRef } from 'vue'

export type VersionsComposable = ReturnType<typeof useVersions>

export const useVersions = (
  showVersions: MaybeRefOrGetter<boolean>,
  action: MaybeRefOrGetter<DetailedAction | null>,
  form: ActionDetailedForm
) => {
  const showVersionsRef = toRef(showVersions)
  const actionRef = toRef(action)
  const selectedVersion = ref<ActionDataVersion | null>(null)
  const { values, setValues } = form

  const versionsQuery = useQuery<ActionDataVersion[]>(
    ['action-versions', () => actionRef.value?.id, showVersionsRef],
    async () => {
      selectedVersion.value = null
      if (!actionRef.value || !showVersionsRef.value) return []
      const result = await jumper.actions.getVersions(actionRef.value.id)
      if (!result.length) return []
      selectedVersion.value = result[0]
      return result
    }
  )

  const selectVersion = (version: ActionDataVersion) => {
    selectedVersion.value = version
    setValues({
      ...values,
      data: {
        ...version
      }
    })
  }

  const differentDataFields = computed(() => {
    if (!showVersionsRef.value || !actionRef.value || !selectedVersion.value || !form.values.data) return []
    const actionData = actionRef.value.data
    const formData = form.values.data
    return Object.entries(actionData).reduce((acc, [key, value]) => {
      if (key in formData) {
        const formValue = formData[key as keyof ActionData]
        if (formValue !== value) {
          acc.push(key)
        }
      }
      return acc
    }, [] as string[])
  })

  return {
    versionsQuery,
    versions: computed(() => versionsQuery.data.value ?? []),
    selectedVersion,
    selectVersion,
    differentDataFields
  }
}
