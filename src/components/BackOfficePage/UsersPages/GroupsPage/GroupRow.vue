<template>
  <TableCell class="w-[250px]">
    <h3
      class="overflow-hidden truncate whitespace-nowrap font-medium text-slate-700
        dark:text-slate-400"
      :title="group.name"
    >
      {{ group.name }}
    </h3>
  </TableCell>
  <TableCell class="w-[180px]">
    <Button
      variant="ghost"
      class="flex gap-1 p-2 text-slate-700 dark:text-slate-400"
    >
      {{ group.userSet.length }}
      <UserIcon class="h-6 w-6" />
    </Button>
  </TableCell>
  <TableCell></TableCell>
</template>

<script setup lang="ts">
import type { Group } from '@@types'
import { TableCell } from '@@materials/ui/table'
import { Button } from '@@materials/ui/button'
import { UserIcon } from 'lucide-vue-next'

defineProps<{
  group: Group
}>()
</script>
