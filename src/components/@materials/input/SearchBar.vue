<template>
  <div class="relative">
    <Search
      class="absolute left-2.5 top-[9px] h-[16px] w-[16px] text-muted-foreground"
    />
    <Input
      type="search"
      v-model="search"
      :placeholder="placeholder || 'Search...'"
      class="h-[32px] w-full rounded-lg bg-background pl-8 text-slate-800 dark:text-slate-200"
    />
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { Input } from '@@materials/ui/input'

defineProps<{
  placeholder?: string
}>()

const search = defineModel<string>()
</script>
