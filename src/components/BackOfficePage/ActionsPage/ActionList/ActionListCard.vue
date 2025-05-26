<template>
  <button
    class="shadow-xs flex h-[60px] w-full flex-col rounded-md border p-[6px] transition-all
      dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:bg-opacity-60"
    :class="{
      [`border-slate-300 bg-white hover:bg-slate-50 hover:shadow-sm
      dark:border-slate-600`]: !isSelected,
      'ring-2 ring-primary bg-slate-50 dark:bg-slate-700': isSelected
    }"
  >
    <div class="flex items-center gap-1">
      <div
        class="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 p-[2px]
          shadow-sm dark:bg-slate-900"
      >
        <Link v-if="action.data.type == 'Link'" :size="12" />
        <img v-else-if="action.data.type == 'Python'" src="/actions/python.png" />
        <img v-else src="/actions/windows-cmd.png" />
      </div>
      <h3
        class="truncate text-sm font-[500] text-slate-800 dark:text-slate-300"
      >
        {{ action.name }}
      </h3>
      <div
        class="ml-auto flex h-2 w-2 items-center justify-center rounded-md mb-2"
        :title="action.isActive ? 'Active' : 'Inactive'"
        :class="{
          'bg-green-400 ':
            action.isActive,
          'bg-slate-300 ':
            !action.isActive
        }"
      />
    </div>
    <p
      v-if="action.description"
      class="line-clamp-2 truncate text-start text-xs italic text-slate-500
        dark:text-slate-500"
    >
      {{ action.description }}
    </p>
  </button>
</template>

<script setup lang="ts">
import type { Action } from '@@types'
import { Link } from 'lucide-vue-next'

defineProps<{
  action: Action
  isSelected: boolean
}>()
</script>
