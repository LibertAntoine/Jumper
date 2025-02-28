<template>
  <TableCaption v-if="errorMessage" class="space-y-2">
    <WifiOff class="h-12 w-12 text-slate-500" />
    <p>Can't fetch {{ itemName ? `${itemName}(s)` : 'data' }}</p>
    <p>{{ errorMessage }}</p>
  </TableCaption>
  <TableCaption v-else-if="!isLoading && !data?.length"
    class="text-lg font-semibold italic text-slate-400 pt-4"
    >No {{ itemName || 'item' }} found</TableCaption
  >
</template>

<script setup lang="ts">
import { WifiOff } from 'lucide-vue-next'
import { TableCaption } from '@@materials/ui/table'

defineProps<{
  isLoading: Boolean
  data?: unknown[]
  errorMessage?: String
  itemName?: String
}>()
</script>
