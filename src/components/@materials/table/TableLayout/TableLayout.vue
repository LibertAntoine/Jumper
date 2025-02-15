<template>
  <div class="overflow-hidden rounded-md border">
    <Table class="flex h-full flex-col">
      <TableHeader v-if="$slots.header" class="table w-full table-fixed">
        <TableRow class="bg-slate-50 dark:bg-black dark:hover:bg-black">
          <slot name="header" />
          <TableHead v-if="isScrollY" class="w-[7px] p-0" />
        </TableRow>
      </TableHeader>
      <TableBody
        ref="tableBody"
        class="block h-full overflow-y-auto shadow-inner [&>tr]:table [&>tr]:w-full
          [&>tr]:table-fixed"
      >
        <template v-if="data">
          <TableRow v-for="(item, index) in data">
            <slot :item="item" :index="index" />
          </TableRow>
        </template>
      </TableBody>
      <TableCaptions
        :is-loading="isLoading"
        :error-message="errorMessage"
        :data="data"
        :item-name="itemName"
      />
    </Table>
  </div>
</template>

<script lang="ts">
interface Item {
  id: number
}
</script>

<script setup lang="ts" generic="T extends Item">
import { useScrollVisibility } from './useScrollVisibility'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead
} from '@@materials/ui/table'
import TableCaptions from './TableCaptions.vue'

const { isScrollY } = useScrollVisibility('tableBody')

defineProps<{
  data?: T[]
  isLoading: boolean
  errorMessage?: string
  itemName?: string
}>()
</script>
