<template>
  <template v-if="isLoading">
    <div class="flex h-full w-full items-center justify-center">
      <Loader2 class="h-10 w-10 text-slate-500 dark:text-slate-400 animate-spin" />
    </div>
  </template>
  <template v-else>
    <slot />
  </template>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

defineProps({
  isLoading: Boolean
})
</script>
