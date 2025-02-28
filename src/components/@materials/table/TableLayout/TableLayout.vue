<template>
  <div class="overflow-hidden rounded-md border">
    <Table class="flex h-full flex-col">
      <TableHeader v-if="$slots.header" class="table w-full table-fixed">
        <TableRow class="bg-slate-50 dark:bg-slate-950">
          <slot name="header" />
          <TableHead v-if="isScrollY" class="w-[7px] p-0" />
        </TableRow>
      </TableHeader>
      <TableCaptions
        class="h-full"
        :is-loading="isLoading"
        :error-message="errorMessage"
        :data="data"
        :item-name="itemName"
      />
      <TableBody
        ref="tableBody"
        v-if="data && data.length"
        class="block h-full overflow-x-hidden shadow-inner [&>tr]:table [&>tr]:w-full
          [&>tr]:table-fixed"
        :class="{
          'overflow-y-auto': !isLoading,
          'overflow-y-hidden': isLoading
        }"
      >
        <template v-if="!isLoading">
          <TableRow v-for="(item, index) in data">
            <slot :item="item" :index="index" />
          </TableRow>
        </template>
        <template v-else>
          <TableRow
            class="pointer-events-none h-[60px] w-full"
            v-for="_ in Array(10).fill(0)"
          >
            <TableCell class="w-full">
              <div class="flex items-center gap-2">
                <div
                  class="h-[15px] w-[100px] animate-pulse rounded-sm bg-slate-200"
                ></div>
              </div>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
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
  TableHead,
  TableCell
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
