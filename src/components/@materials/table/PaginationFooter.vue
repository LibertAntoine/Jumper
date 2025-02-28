<template>
  <div class="flex h-[39px] items-center gap-6">
    <template v-if="itemCount">
      <p class="flex-grow text-sm font-semibold text-slate-500">
        {{ (currentPage - 1) * itemsPerPage + 1 }} -
        {{ Math.min(currentPage * itemsPerPage, itemCount || 0) }} of
        {{ itemCount }}
      </p>
      <div class="flex items-center gap-2">
        <Select
          :model-value="String(itemsPerPage)"
          @update:model-value="itemsPerPage = Number($event)"
        >
          <SelectTrigger class="h-7 w-[50px] pl-2 pr-1">
            <SelectValue class="text-xs font-semibold text-slate-700 dark:text-slate-500" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              :value="String(n)"
              v-for="n in ['10', '25', '50', '100']"
              :key="n"
            >
              {{ n }}</SelectItem
            >
          </SelectContent>
        </Select>
        <Label class="text-sm text-slate-500 pb-[2px]">per page</Label>
      </div>
      <Pagination
        v-slot="{ page }"
        :total="itemCount"
        v-model:page="currentPage"
        :sibling-count="1"
        :items-per-page="itemsPerPage"
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst class="h-7 w-7 p-0 text-slate-700 dark:text-slate-500" />
          <template v-for="(item, index) in items">
            <PaginationListItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button
                class="h-7 w-7 p-0"
                :variant="item.value === page ? 'default' : 'outline'"
                :class="item.value !== page ? 'text-slate-700 dark:text-slate-500' : ''"
                @click="currentPage = item.value"
              >
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis class="text-slate-700" v-else :key="item.type" :index="index" />
          </template>
          <PaginationLast class="h-7 w-7 p-0 text-slate-700 dark:text-slate-500" />
        </PaginationList>
      </Pagination>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@@materials/ui/button'
import { Label } from '@@materials/ui/label'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem
} from '@@materials/ui/pagination'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@@materials/ui/select'

const currentPage = defineModel<number>('current-page', {
  default: 1
})

const itemsPerPage = defineModel<number>('items-per-page', {
  default: 25
})

defineProps<{
  itemCount?: number
}>()
</script>
