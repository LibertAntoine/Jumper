<template>
  <button
    class="flex h-[60px] w-full flex-col rounded-md border bg-white p-[6px] shadow-xs
      transition-all dark:bg-slate-800 dark:hover:bg-slate-700"
    :class="{
      'border-slate-300 hover:bg-slate-50 hover:shadow-sm dark:border-slate-600':
        !isSelected,
      'border-primary bg-slate-50 dark:bg-slate-700': isSelected
    }"
  >
    <div class="flex items-center gap-1">
      <div class="rounded-md bg-slate-100 p-1 shadow-sm dark:bg-slate-900">
        <Link v-if="action.data.type == 'Link'" :size="12" />
        <User v-else :size="12" />
      </div>
      <h3
        class="truncate text-sm font-[500] text-slate-800 dark:text-slate-300"
      >
        {{ action.name }}
      </h3>
    </div>
    <p
      v-if="action.description"
      class="line-clamp-2 truncate text-start text-xs italic text-slate-500
        dark:text-slate-600"
    >
      {{ action.description }}
    </p>
  </button>
</template>

<script setup lang="ts">
import type { Action } from '@@types'
import { Link, User } from 'lucide-vue-next'

defineProps<{
  action: Action
  isSelected: boolean
}>()
</script>
