<template>
  <button
    class="flex h-[60px] w-full flex-col rounded-md border bg-white p-[6px] shadow-sm
      hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
  >
    <div class="flex items-center gap-1">
      <div class="rounded-md bg-slate-100 p-1 shadow-sm dark:bg-slate-900">
        <Link class="" :size="12" />
      </div>
      <h3
        class="truncate text-sm font-[500] text-slate-800 dark:text-slate-300"
      >
        My Action Name
      </h3>
    </div>
    <p
      class="line-clamp-2 truncate text-xs italic text-slate-500 dark:text-slate-600"
    >
      Description of my action
    </p>
  </button>
</template>

<script setup lang="ts">
import { Link } from 'lucide-vue-next'
</script>
