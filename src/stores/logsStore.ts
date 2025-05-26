import { ref } from 'vue'
import { defineStore } from 'pinia'

import * as tauriLog from '@tauri-apps/plugin-log'

type Log = {
  level: 'info' | 'error' | 'warn' | 'debug' | 'trace'
  execId: string
  timestamp: string
  namespace: string
  message: string
}

export const useLogsStore = defineStore('logsConfig', () => {
  const logs = ref<Log[]>([])

  const pushLog = (log: Omit<Log, 'timestamp'>) => {
    tauriLog[log.level](log.message)
    logs.value.push({
      ...log,
      timestamp: new Date().toISOString()
    })
  }

  const clearExecLog = (execId: string) => {
    logs.value = logs.value.filter((log) => log.execId !== execId)
  }

  const clearAll = () => {
    logs.value = []
  }

  return {
    logs,
    pushLog,
    clearExecLog,
    clearAll
  }
})
