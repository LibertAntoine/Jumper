import { type MaybeRefOrGetter, toRef, computed } from 'vue'
import type { PlayableAction } from '@@types'
import { useCodeExec } from '@/composables/useCodeExec'
import { useExecutionsStore } from '@/stores/execuctionsStore'

export const useActionExec = (action: MaybeRefOrGetter<PlayableAction>) => {
  const actionRef = toRef(action)
  const executionsStore = useExecutionsStore()

  const hasOptions = computed(() => {
    if (!actionRef.value) return false
    return (
      ['Python', 'Windows'].includes(actionRef.value.data.type) &&
      'useCombobox' in actionRef.value.data &&
      actionRef.value.data['useCombobox']
    )
  })

  const getOptions = () => {
    if (!hasOptions.value || !('comboboxCode' in actionRef.value.data))
      return null
    const optionsExec = useCodeExec(
      'get-options',
      actionRef.value.data.comboboxCode,
      actionRef.value.name
    )
    executionsStore.addExecution(optionsExec as any) // TODO fix type
    return optionsExec
  }

  const exec = async (option: string | null = null) => {
    if (!actionRef.value) return null
    const codeExec = getCodeExec(actionRef.value)
    executionsStore.addExecution(codeExec as any)
    return codeExec?.exec(option)
  }

  return {
    hasOptions,
    getOptions,
    exec
  }
}

const getCodeExec = (action: PlayableAction) => {
  switch (action.data.type) {
    case 'Link':
      return useCodeExec(
        'cmd',
        `@echo off
        explorer ${action.data.url}
        `,
        action.name
      )
    case 'Python':
      return useCodeExec('python', action.data.code, action.name)
    case 'Windows CMD':
      return useCodeExec('cmd', action.data.code, action.name)
    default:
      throw new Error(`Unknown action type: ${action.data}`)
  }
}
