<template>
  <div
    data-tauri-drag-region
    class="fixed top-0 z-[10000] flex h-[32px] w-full items-center gap-1 bg-slate-100 pl-1
      dark:bg-slate-900"
  >
    <img
      class="pointer-events-none ml-[2px] mt-[1px] w-[23px]"
      src="@/assets/jumper-logo.png"
      alt="Jumper Logo"
    />
    <h1
      class="pointer-events-none text-xs font-medium text-slate-700 dark:text-slate-200"
    >
      Jumper - Debug
    </h1>
    <div class="flex-grow" />
    <WindowsMenu debug-window />
  </div>
</template>

<script setup lang="ts">
import WindowsMenu from './WindowsMenu.vue'
</script>
