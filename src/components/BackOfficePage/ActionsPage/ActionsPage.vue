<template>
  <div>
    <ActionList />
    <BackOfficePageLayout>
      <div class="mb-4 flex w-full flex-col gap-1 border-b px-1 pb-4">
        <div class="flex items-center space-x-2">
          <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200">
            My Action
          </h2>
          <!-- <Badge variant="outline" class="h-6">SSO</Badge> -->
        </div>
        <p class="text-sm text-slate-400 dark:text-slate-500">
          Edit your profile
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <div class="w-full">
          <div
            class="relative flex h-[400px] w-full overflow-hidden rounded-md"
          >
            <div ref="editorInput" class="h-full w-full" />
            <div
              class="h-full w-[400px] bg-gray-100 p-2 font-mono"
              v-html="logs.replace(/\n/g, '<br>')"
            ></div>
          </div>
        </div>
        <div class="flex w-full items-end justify-end">
          <Button @click="runCode" size="sm" variant="outline">
            <Play />
            Run
          </Button>
        </div>
      </div>
     
    </BackOfficePageLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as monaco from 'monaco-editor'
import { Command } from '@tauri-apps/plugin-shell'
import Button from '@@materials/ui/button/Button.vue'
import { Play } from 'lucide-vue-next'
import BackOfficePageLayout from '../@common/BackOfficePageLayout.vue'
import ActionList from './ActionList.vue'

const code = ref(`def run():
  print('Hello, World!')`)

const editorInput = ref<HTMLElement>()
const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null)
const logs = ref<string>('')

onMounted(() => {
  if (!editorInput.value) return
  const monacoEditor = monaco.editor.create(editorInput.value, {
    value: code.value,
    theme: 'vs-dark',
    automaticLayout: true,
    language: 'python'
  })
  monacoEditor.onDidChangeModelContent(() => {
    code.value = monacoEditor.getValue()
  })
  editor.value = monacoEditor
})

const runCode = async () => {
  const encoded = btoa(code.value)
  const command = Command.sidecar('bin/python/test', [encoded])
  logs.value = ''
  const output = await command.execute()
  const { stdout, stderr } = output
  console.log(stdout)
  console.log(stderr)
  logs.value = stdout
  console.log(stderr)
}
</script>

<style>
.monaco-editor {
  position: absolute !important;
  border-radius: 5px 0px 0px 5px !important;
  overflow: hidden !important;
}
</style>
