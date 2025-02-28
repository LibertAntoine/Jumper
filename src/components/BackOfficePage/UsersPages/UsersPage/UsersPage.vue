<template>
  <BackOfficePageLayout>
    <BackOfficeHeader title="Users" description="Manage Jumper's users" />
    <div class="flex items-center gap-4">
      <SearchBar
        v-model="search"
        :debounce="400"
        class="mr-auto w-[280px] flex-shrink"
      />
      <div class="flex flex-shrink-0 items-center gap-2">
        <Label class="text-[13px] text-slate-700 dark:text-slate-500"
          >Active only</Label
        >
        <Switch v-model:checked="activeOnly" class="" />
      </div>
      <AddUserButton @userAdded="refetch" />
    </div>
    <TableLayout
      class="my-3 h-full"
      :error-message="errorMessage"
      :is-loading="isFetching || isSearchDebouncing"
      :data="usersPage?.results"
      item-name="user"
    >
      <template #header>
        <TableHead class="w-[250px]"
          ><OrderByButton field="username" v-model:order="orderBy">
            Name
          </OrderByButton>
        </TableHead>
        <TableHead class="w-[180px]">
          <OrderByButton field="is_superuser,username" v-model:order="orderBy">
            System role
          </OrderByButton>
        </TableHead>
        <TableHead v-if="isSSOEnabled" class="w-[50px]">SSO User</TableHead>
        <TableHead v-if="!activeOnly" class="w-[50px]">
          <OrderByButton field="is_active,username" v-model:order="orderBy">
            Active
          </OrderByButton>
        </TableHead>
        <TableHead></TableHead>
      </template>
      <template #default="{ item: user }">
        <UserRow
          :user="user"
          :active-only="activeOnly"
          @user-updated="refetch()"
        />
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
import { useAuthConfigStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useUsersQuery } from '@/composables'
import { TableHead } from '@@materials/ui/table'
import { Switch } from '@@materials/ui/switch'
import { Label } from '@@materials/ui/label'
import { SearchBar } from '@@materials/input'
import { OrderByButton } from '@@materials/input'
import { PaginationFooter, TableLayout } from '@@materials/table'
import {
  BackOfficePageLayout,
  BackOfficeHeader
} from '@/components/BackOfficePage/@common'
import UserRow from './UserRow.vue'
import AddUserButton from './modals/AddUserButton.vue'

const { isSSOEnabled } = storeToRefs(useAuthConfigStore())

const {
  data: usersPage,
  isFetching,
  errorMessage,
  refetch,
  currentPage,
  limit,
  itemsCount,
  orderBy,
  search,
  activeOnly,
  isSearchDebouncing
} = useUsersQuery({
  searchDebounceTime: 400,
})
</script>
