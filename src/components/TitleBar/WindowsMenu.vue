<template>
  <div class="flex h-full text-gray-200">
    <button
      class="flex h-full w-[40px] items-center justify-center hover:bg-slate-200
        dark:hover:bg-slate-800"
      @click="appWindow.minimize()"
      title="Minimize"
    >
      <Minus class="text-slate-600 dark:text-slate-200" :size="13" />
    </button>
    <button
      class="flex h-full w-[40px] items-center justify-center hover:bg-slate-200
        dark:hover:bg-slate-800"
      @click="appWindow.toggleMaximize()"
      title="Maximize"
    >
      <Square class="text-slate-600 dark:text-slate-200" :size="12" />
    </button>
    <button
      class="flex h-full w-[40px] items-center justify-center hover:bg-slate-200
        dark:hover:bg-slate-800"
      @click="close"
      title="Close"
    >
      <X class="text-slate-600 dark:text-slate-200" :size="15" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window'
import { X, Minus, Square } from 'lucide-vue-next'
import { useDebugWindowStore } from '@/stores'
const appWindow = getCurrentWindow()

const props = defineProps<{
  debugWindow?: boolean
}>()

const close = () => {
  if (props.debugWindow) {
    const debugWindowStore = useDebugWindowStore()
    debugWindowStore.close()
    return
  }
  appWindow.close()
}
</script>
