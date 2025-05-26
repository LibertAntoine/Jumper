<template>
  <div class="flex h-full">
    <div
      class="flex h-full w-[210px] flex-shrink-0 scroll-py-36 flex-col items-center border-r
        bg-slate-100 pb-3 pt-2 dark:border-slate-700 dark:bg-slate-800
        dark:bg-opacity-60"
      @click="() => (selection = [])"
    >
      <div class="w-full px-2" @click.stop>
        <Input v-model="search" class="h-[25px]" placeholder="Search" />
      </div>
      <div
        class="my-2 flex w-full flex-grow flex-col gap-2 overflow-auto px-2 py-2"
      >
        <p
          class="text-xs font-[600] italic text-slate-400"
          v-if="executionsRunning.length"
        >
          Running
        </p>
        <Button
          variant="ghost"
          class="p-0"
          v-for="execution in executionsRunning"
          :key="execution.id"
          @click.exact.stop="select(execution)"
          @click.ctrl.stop="select(execution, { multiple: true })"
        >
          <div
            class="shadow-xs group flex h-[40px] w-full flex-col items-start rounded-lg border
              py-0.5 pl-2 pr-1 transition-all dark:bg-slate-800 dark:hover:bg-slate-700
              dark:hover:bg-opacity-60"
            :class="{
              [`border-slate-300 bg-white hover:bg-slate-50 hover:shadow-sm
              dark:border-slate-600`]: !selection.includes(execution.id),
              'bg-slate-50 ring-2 ring-primary dark:bg-slate-700':
                selection.includes(execution.id)
            }"
          >
            <div class="flex w-full items-center">
              <p
                class="truncate text-sm font-[600] leading-[17px] text-slate-800"
              >
                {{ execution.namespace }}
              </p>
              <p
                v-if="execution.mode == 'get-options'"
                class="ml-0.5 rounded-md bg-blue-300 px-1 text-[12px] leading-[17px] text-slate-800
                  shadow-sm"
              >
                O
              </p>
              <Button
                variant="ghost"
                class="ml-auto h-[16px] p-0 text-slate-500 opacity-0 hover:bg-slate-200
                  hover:text-slate-800 group-hover:opacity-100"
                size="sm"
                title="Stop execution"
                @click.stop.prevent="
                  executionsStore.removeExecution(execution.id)
                "
              >
                <X />
              </Button>
            </div>
            <p class="truncate text-xs italic text-slate-400">
              {{ getExecTime(execution.runTimestamp) }} -
              {{ execution.id.slice(0, 6) }}
            </p>
          </div>
        </Button>
        <p
          class="text-xs font-[600] italic text-slate-400"
          v-if="endedExecutions.length"
        >
          Ended
        </p>
        <Button
          variant="ghost"
          class="p-0"
          v-for="execution in endedExecutions"
          :key="execution.id"
          @click.exact.stop="select(execution)"
          @click.ctrl.stop="select(execution, { multiple: true })"
        >
          <div
            class="shadow-xs group flex h-[40px] w-full flex-col items-start rounded-lg border
              py-0.5 pl-2 pr-1 transition-all dark:bg-slate-800 dark:hover:bg-slate-700
              dark:hover:bg-opacity-60"
            :class="{
              [`border-slate-300 bg-slate-100 hover:bg-slate-50 hover:shadow-sm
              dark:border-slate-600`]: !selection.includes(execution.id),
              'bg-slate-50 ring-2 ring-primary dark:bg-slate-700':
                selection.includes(execution.id)
            }"
          >
            <div class="flex w-full items-center gap-0.5">
              <p
                class="truncate text-sm font-[600] leading-[17px] text-slate-800"
              >
                {{ execution.namespace }}
              </p>
              <p
                v-if="execution.mode == 'get-options'"
                class="ml-0.5 rounded-md bg-blue-300 px-1 text-[12px] leading-[17px] text-slate-800
                  shadow-sm"
              >
                O
              </p>
              <Button
                variant="ghost"
                class="ml-auto h-[16px] p-0 text-slate-500 opacity-0 hover:bg-slate-200
                  hover:text-slate-800 group-hover:opacity-100"
                size="sm"
                title="Stop execution"
                @click.stop.prevent="
                  executionsStore.removeExecution(execution.id)
                "
              >
                <X />
              </Button>
            </div>
            <p class="truncate text-xs italic text-slate-400">
              {{ getExecTime(execution.runTimestamp) }} -
              {{ execution.id.slice(0, 6) }}
            </p>
          </div>
        </Button>
      </div>
    </div>
    <div class="flex w-full flex-col">
      <div
        class="flex-grow overflow-auto bg-slate-200 shadow-inner dark:bg-slate-800"
      >
        <div
          v-for="(log, i) in showedLogs"
          :key="log.timestamp"
          class="whitespace-pre-wrap px-2 font-mono"
          :class="{
            'text-slate-800': log.level !== 'error' && log.level !== 'warn',
            'bg-slate-300/50 bg-opacity-60 dark:bg-slate-700 dark:bg-opacity-30':
              i % 2 === 0 && log.level !== 'error' && log.level !== 'warn',
            'bg-red-100 font-semibold text-red-500 dark:bg-slate-800':
              log.level === 'error',
            'bg-orange-100 font-semibold text-orange-500 dark:bg-slate-800':
              log.level === 'warn'
          }"
        >
          {{ log.level.toLocaleUpperCase() }} - {{ log.timestamp }} [{{
            log.namespace
          }}
          - {{ log.execId.slice(0, 6) }}]: {{ log.message }}
        </div>
      </div>
      <div
        class="flex h-[22px] w-full items-center bg-slate-300 px-2 dark:bg-slate-800"
      >
        <div class="flex items-center gap-1">
          <MiniSwitch
            class="data-[state=checked]:bg-blue-300"
            v-model="showOptionsExec"
          />
          <p class="text-xs italic text-slate-400">Get Options</p>
        </div>
        <Button
          class="ml-auto flex h-[18px] w-[18px] items-center justify-center p-2.5 text-slate-500
            hover:text-slate-800"
          variant="ghost"
          title="Clear logs"
          :disabled="showedLogs.length === 0"
          @click="executionsStore.clear()"
        >
          <Ban />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Input from '@@materials/ui/input/Input.vue'
import { useExecutionsStore } from '@/stores'
import { useLogsStore } from '@/stores/logsStore'
import type { CodeExec } from '@/composables/useCodeExec/useCodeExec'
import { Button } from '@@materials/ui/button'
import { Ban, X } from 'lucide-vue-next'
import { MiniSwitch } from '@@materials/ui/switch'

const executionsStore = useExecutionsStore()
const logsStore = useLogsStore()

const search = ref('')
const showOptionsExec = ref(false)
const selection = ref<CodeExec['id'][]>([])

const select = (
  execution: CodeExec,
  options: {
    multiple?: boolean
  } = {}
) => {
  if (options.multiple) {
    selection.value.push(execution.id)
  } else {
    selection.value = [execution.id]
  }
}
const executionsRunning = computed(() =>
  filterExecutions.value.filter((execution) => execution.isRunning)
)

const endedExecutions = computed(() =>
  filterExecutions.value.filter((execution) => !execution.isRunning)
)

const filterExecutions = computed(() => {
  return executionsStore.executions
    .filter((execution) => {
      if (!search.value) return true
      return (
        execution.namespace
          .toLowerCase()
          .includes(search.value.toLowerCase()) ||
        execution.id.toLowerCase().includes(search.value.toLowerCase())
      )
    })
    .filter((execution) => {
      if (showOptionsExec.value) return true
      return execution.mode !== 'get-options'
    })
    .sort((a, b) => {
      return (
        new Date(b.runTimestamp ?? 0).getTime() -
        new Date(a.runTimestamp ?? 0).getTime()
      )
    })
})

const getExecTime = (timestamp: string | null) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

const showedLogs = computed(() => {
  const logs = logsStore.logs.filter((log) => {
    if (showOptionsExec.value) return true
    const exec = executionsStore.executions.find(
      (execution) => execution.id === log.execId
    )
    if (exec && exec.mode !== 'get-options') return true
  })
  if (!selection.value.length) return logs
  return logs.filter((log) => selection.value.includes(log.execId))
})

watch(
  () => executionsStore.executions,
  (executions: CodeExec[]) => {
    selection.value = selection.value.filter((id) =>
      executions.some((execution) => execution.id === id)
    )
  }
)
</script>
