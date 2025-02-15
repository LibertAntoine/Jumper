<template>
  <div class="relative ml-auto">
    <Search
      class="absolute left-2.5 top-[9px] h-[16px] w-[16px] text-muted-foreground"
    />
    <Input
      type="search"
      v-model="value"
      :placeholder="placeholder || 'Search...'"
      class="h-[33px] rounded-lg bg-background pl-8 text-slate-800 dark:text-slate-200"
    />
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { Input } from '@@materials/ui/input'

const value = defineModel<string>()

defineProps<{
  placeholder?: string
}>()
</script>
