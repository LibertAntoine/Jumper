<template>
  <div class="flex items-center h-[39px]">
    <template v-if="itemCount">
      <p class="flex-grow text-sm font-semibold text-slate-500">
        {{ (currentPage - 1) * itemsPerPage + 1 }} -
        {{ Math.min(currentPage * itemsPerPage, itemCount || 0) }} of
        {{ itemCount }}
      </p>
      <Pagination
        v-slot="{ page }"
        :total="itemCount"
        :sibling-count="1"
        :items-per-page="itemsPerPage"
        :default-page="currentPage"
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst class="h-7 w-7 p-0" />
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
              >
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>
          <PaginationLast class="h-7 w-7 p-0" />
        </PaginationList>
      </Pagination>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@@materials/ui/button';
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem
} from '@@materials/ui/pagination'

const currentPage = defineModel<number>('current-page', {
  default: 1
})

const itemsPerPage = defineModel<number>('items-per-page', {
  default: 10
})

defineProps<{
  itemCount?: number
}>()
</script>
