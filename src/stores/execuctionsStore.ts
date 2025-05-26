import { ref } from 'vue'
import type { CodeExec } from '@/composables/useCodeExec/useCodeExec'
import { defineStore } from 'pinia'
import { useLogsStore } from './logsStore'
import { invoke } from '@tauri-apps/api/core'

export const useExecutionsStore = defineStore('executions', () => {
  const executions = ref<CodeExec[]>([])
  const logsStore = useLogsStore()

  const addExecution = (execution: CodeExec) => {
    executions.value.push(execution)
  }

  const removeExecution = async (id: CodeExec['id']) => {
    const index = executions.value.findIndex((exec) => exec.id === id)
    if (index !== -1) {
      const exec = executions.value.splice(index, 1)[0]
      if (exec.isRunning) {
        if (!exec.process) return
        await invoke('kill_process', {
          pid: exec.process.pid
        })
      }
      setTimeout(() => {
        logsStore.clearExecLog(exec.id)
      }, 100)
    }
  }

  const clear = () => {
    executions.value = executions.value.filter((exec) => exec.isRunning)
    logsStore.clearAll()
  }

  return {
    addExecution,
    removeExecution,
    executions,
    clear
  }
})
