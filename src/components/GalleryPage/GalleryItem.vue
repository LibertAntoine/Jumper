<template>
  <button
    class="custom-shadow flex flex-col items-center justify-center gap-5 rounded-md
      bg-slate-100 dark:bg-slate-900 p-2 hover:shadow-md transition-all"
  >
    <img class="w-[80%]" :src="item.image" :alt="item.name" />
    <h2 class="text-lg font-semibold text-slate-700 dark:text-slate-200">{{ item.name }}</h2>
  </button>
</template>

<script setup lang="ts">
import type { Item } from '@@types'

defineProps<{
  item: Item
}>()
</script>
