<template>
  <BackOfficePageLayout>
    <BackOfficeHeader title="Groups" description="Manage SSO groups." />
    <div class="flex items-center gap-4">
      <SearchBar
        v-model="search"
        class="mr-auto w-[280px] flex-shrink"
      />
    </div>
    <TableLayout
      class="my-3 h-full"
      :error-message="errorMessage"
      :is-loading="isFetching || isSearchDebouncing"
      :data="groupsPage?.results"
      item-name="group"
    >
      <template #header>
        <TableHead class="w-[250px]"
          ><OrderByButton field="name" v-model:order="orderBy">
            Name
          </OrderByButton>
        </TableHead>
        <TableHead class="w-[180px]">
          <OrderByButton field="user_set,name" v-model:order="orderBy">
            Users
          </OrderByButton>
        </TableHead>
        <TableHead></TableHead>
      </template>
      <template #default="{ item: group }">
        <GroupRow :group="group" @group-updated="refetch" />
      </template>
    </TableLayout>
    <PaginationFooter
      v-model:current-page="currentPage"
      v-model:items-per-page="limit"
      :item-count="itemsCount"
    />
  </BackOfficePageLayout>
</template>

<script setup lang="ts">
import { useGroupsQuery } from '@/composables/query'

import { SearchBar } from '@/components/@materials/input'
import {
  BackOfficePageLayout,
  BackOfficeHeader
} from '@/components/BackOfficePage/@common'
import { TableLayout } from '@/components/@materials/table'
import { PaginationFooter } from '@/components/@materials/table'
import { TableHead } from '@/components/@materials/ui/table'
import { OrderByButton } from '@/components/@materials/input'
import GroupRow from './GroupRow.vue'

const {
  data: groupsPage,
  isFetching,
  errorMessage,
  refetch,
  limit,
  search,
  orderBy,
  currentPage,
  itemsCount,
  isSearchDebouncing
} = useGroupsQuery({
  searchDebounceTime: 400
})
</script>
