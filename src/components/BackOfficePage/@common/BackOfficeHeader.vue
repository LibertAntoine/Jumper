<template>
  <div class="mb-3 flex w-full flex-col gap-1 border-b px-1 pb-3">
    <div class="flex items-center space-x-2">
      <h2 class="text-xl font-semibold text-slate-700 dark:text-slate-200">
        {{ title }}
      </h2>
    </div>
    <p v-if="description" class="text-sm text-slate-400 dark:text-slate-500">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string,
    description?: string
}>()
</script>
