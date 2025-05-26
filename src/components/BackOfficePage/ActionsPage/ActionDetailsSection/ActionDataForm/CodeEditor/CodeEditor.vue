<template>
  <div class="flex w-full flex-col gap-2">
    <ResizablePanelGroup
      direction="horizontal"
      class="relative flex w-full overflow-hidden rounded-md"
    >
      <ResizablePanel
        :default-size="75"
        class="group relative h-full min-w-[30%] dark:bg-slate-900"
      >
        <div
          ref="editorInput"
          class="h-full w-full"
          :class="{
            'pointer-events-none opacity-80 dark:opacity-30': isRunning
          }"
        />
        <Button
          v-if="isDiff"
          class="absolute bottom-[16px] right-[50px] z-50 h-[30px] w-[30px] rounded-sm opacity-0
            group-hover:opacity-100"
          variant="secondary"
          :class="{
            'right-[50px]': showCompare,
            'right-[24px]': !showCompare
          }"
          @click.prevent="showCompare = !showCompare"
        >
          <GitCommitVertical
            v-if="showCompare"
            :size="16"
            class="text-gray-700"
          />
          <GitCompare v-else :size="16" class="text-gray-700" />
        </Button>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        :default-size="25"
        class="h-full min-w-[10%] bg-gray-200 font-mono dark:bg-slate-800"
      >
        <CodeLogsSection
          v-model:logs-depth="logsDepth"
          :namespace="props.namespace"
        />
      </ResizablePanel>
    </ResizablePanelGroup>
    <CodeExecOptions
      :is-running="isRunning"
      :options="options"
      v-model:selected-option="selectedOption"
      @kill="kill"
      @exec="
        () => {
          logsDepth = new Date().toISOString()
          exec(selectedOption)
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMonacoEditor } from './useMonacoEditor'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@@materials/ui/resizable'
import CodeLogsSection from './CodeLogsSection.vue'
import CodeExecOptions from './CodeExecOptions.vue'
import { Button } from '@@materials/ui/button'
import { useCodeExec, ExecMode } from '@/composables/useCodeExec/useCodeExec'
import { GitCompare, GitCommitVertical } from 'lucide-vue-next'

const props = defineProps<{
  namespace: string
  mode: ExecMode
  language?: string
  isDiff?: boolean
  compareCode?: string
  options?: string[] | null
}>()

const code = defineModel<string>({ default: `` })
const resultOptions = defineModel<string[]>('resultOptions', {
  default: []
})
const selectedOption = ref<string | null>(null)

const showCompare = ref(false)
const editorInput = ref<HTMLElement | null>()
const logsDepth = ref<string | null>(new Date().toISOString())

watch(
  () => props.isDiff,
  () => (showCompare.value = props.isDiff)
)

useMonacoEditor(
  editorInput,
  () => (showCompare.value ? 'diff' : 'code'),
  code,
  () => props.compareCode,
  () => props.language
)

const {
  exec,
  kill,
  isRunning,
  options: execOptions
} = useCodeExec(
  () => props.mode,
  code,
  () => props.namespace
)

watch(execOptions, (newOptions) => (resultOptions.value = newOptions ?? []), {
  immediate: true
})

</script>

<style>
.monaco-editor {
  position: absolute !important;
  overflow: hidden !important;
}
</style>
