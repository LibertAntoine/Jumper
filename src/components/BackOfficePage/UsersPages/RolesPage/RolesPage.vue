<template>
  <BackOfficePageLayout>
    <BackOfficeHeader
      title="Roles"
      description="Use role to assign actions to user easily."
    />
    <div class="flex items-center gap-4">
      <SearchBar
        v-model="search"
        class="mr-auto w-[280px] flex-shrink"
      />
      <AddRoleButton @role-added="refetch" />
    </div>
    <TableLayout
      class="my-3 h-full"
      :error-message="errorMessage"
      :is-loading="isFetching || isSearchDebouncing"
      :data="rolesPage?.results"
      item-name="role"
    >
      <template #header>
        <TableHead class="w-[250px]"
          ><OrderByButton field="name" v-model:order="orderBy">
            Name
          </OrderByButton>
        </TableHead>
        <TableHead class="w-[180px]">
          <OrderByButton field="user_count,name" v-model:order="orderBy">
            Users
          </OrderByButton>
        </TableHead>
        <TableHead v-if="isScimEnabled" class="w-[180px]">
          <OrderByButton field="group_count,name" v-model:order="orderBy">
            Groups
          </OrderByButton>
        </TableHead>
        <TableHead></TableHead>
      </template>
      <template #default="{ item: role }">
        <RoleRow :role="role" @role-updated="refetch()" />
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
import { useRolesQuery } from '@/composables/query'
import {
  BackOfficePageLayout,
  BackOfficeHeader
} from '@/components/BackOfficePage/@common'
import { SearchBar } from '@@materials/input'
import { TableLayout } from '@@materials/table'
import { PaginationFooter } from '@@materials/table'
import { TableHead } from '@@materials/ui/table'
import { OrderByButton } from '@@materials/input'
import RoleRow from './RoleRow.vue'
import { useAuthConfigStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { AddRoleButton } from './modals'

const { isScimEnabled } = storeToRefs(useAuthConfigStore())

const {
  data: rolesPage,
  isFetching,
  errorMessage,
  refetch,
  itemsCount,
  search,
  limit,
  currentPage,
  orderBy,
  isSearchDebouncing
} = useRolesQuery({
  searchDebounceTime: 400
})
</script>
