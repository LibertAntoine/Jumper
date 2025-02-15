<template>
  <div
    class="flex h-full w-[300px] scroll-py-36 flex-col items-center border-r bg-slate-100
      p-2 pb-3 pt-2 dark:border-slate-700 dark:bg-slate-900"
  >
    <Input v-model="search" class="h-[25px]" placeholder="Search" />
    <div class="flex w-full flex-grow flex-col gap-2 overflow-auto py-2">
      <ActionCard />
      <ActionCard />
      <ActionCard />
      <ActionCard />
    </div>
    <Button class="w-full" size="sm">
      <Carrot />
      New Action</Button
    >
  </div>
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
        <div class="flex h-[400px] w-full overflow-hidden rounded-md relative">
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as monaco from 'monaco-editor'
import { Command } from '@tauri-apps/plugin-shell'
import Input from '@@materials/ui/Input/Input.vue'
import Button from '@@materials/ui/button/Button.vue'
import { Carrot, Play } from 'lucide-vue-next'
import ActionCard from './ActionCard.vue'
import BackOfficePageLayout from '../@common/BackOfficePageLayout.vue'

const code = ref(`def run():
  print('Hello, World!')`)

const editorInput = ref<HTMLElement>()
const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null)
const logs = ref<string>('')

const search = ref('')

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
