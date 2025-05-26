<template>
  <div class="h-[400px]">
    <div
      class="flex h-[40px] w-full items-center border-slate-300 bg-slate-200 px-2 shadow-sm
        dark:bg-slate-800"
    >
      <p class="italic text-slate-500 dark:text-slate-300">Logs</p>
      <Button
        class="ml-auto flex h-[23px] w-[23px] items-center justify-center border-b-2
          bg-slate-50 p-3 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-950
          dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        variant="outline"
        :disabled="execLogs.length === 0"
        @click.prevent="clear"
      >
        <Ban :size="12" />
      </Button>
    </div>
    <div
      class="h-[360px] overflow-auto bg-slate-200 shadow-inner dark:bg-slate-800"
    >
      <div
        v-for="(log, i) in execLogs"
        :key="log.timestamp"
        class="whitespace-pre-wrap px-2"
        :class="{
          'bg-slate-300 bg-opacity-60 dark:bg-slate-700 dark:bg-opacity-30':
            i % 2 === 0 && log.level !== 'error',
          'bg-red-100 font-semibold text-red-500 dark:bg-slate-800':
            log.level === 'error'
        }"
        v-html="log.message"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLogsStore } from '@/stores/logsStore'
import { storeToRefs } from 'pinia'
import { Button } from '@@materials/ui/button'
import { Ban } from 'lucide-vue-next'

const { logs } = storeToRefs(useLogsStore())

const props = defineProps<{
  namespace: string
}>()

const logsDepth = defineModel<string | null>('logsDepth', {
  default: null
})

const execLogs = computed(() => {
  let filters = (log: any) => log.namespace === props.namespace
  if (logsDepth.value) {
    const timestamp = logsDepth.value
    filters = (log: any) =>
      log.namespace === props.namespace && log.timestamp > timestamp
  }
  // TODO: manage if they are a lot of logs
  return logs.value.filter(filters)
})

const clear = () => {
  logsDepth.value = new Date().toISOString()
}
</script>
