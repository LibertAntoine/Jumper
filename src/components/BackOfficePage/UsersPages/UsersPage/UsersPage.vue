<template>
  <BackOfficePageLayout>
    <BackOfficeHeader title="Users" description="Manage Jumper's users" />
    <div class="flex gap-2">
      <SearchBar v-model="search" />
      <div class="flex-grow"></div>
      <Button variant="outline" size="sm"><UserIcon />Add User</Button>
    </div>
    <FormModal
      title="New user"
      :form="useForm"
      description="Create a new user"
      submitButtonName="Add User"
      :onSubmit="onSubmit"
    >
      <template #trigger>
        <Button variant="outline" size="sm"><UserIcon />Add User</Button>
      </template>
    </FormModal>
    <TableLayout
      class="my-3 h-full"
      :error-message="errorMessage"
      :is-loading="isFetching"
      :data="
        usersPage
          ? [
              ...usersPage?.results,
              ...usersPage?.results,
              ...usersPage?.results
            ]
          : []
      "
      item-name="user"
    >
      <template #header>
        <TableHead>Name</TableHead>
        <TableHead>SSO User</TableHead>
        <TableHead>Active</TableHead>
        <TableHead>Role</TableHead>
      </template>
      <template #default="{ item: user }">
        <UserRow :user="user" />
      </template>
    </TableLayout>
    <PaginationFooter
      v-model:current-page="currentPage"
      v-model:items-per-page="limit"
      :item-count="usersPage?.count"
    />
  </BackOfficePageLayout>
</template>

<script setup lang="ts">
import type { Page, User } from '@@types'
import { ref } from 'vue'
import jumper from '@/services/jumper'
import { useQuery } from '@/composables'
import { UserIcon } from 'lucide-vue-next'
import { Button } from '@@materials/ui/button'
import { TableHead } from '@@materials/ui/table'
import { SearchBar } from '@@materials/input'
import { PaginationFooter, TableLayout } from '@@materials/table'
import {
  BackOfficePageLayout,
  BackOfficeHeader
} from '@/components/BackOfficePage/@common'
import UserRow from './UserRow.vue'
import { FormModal } from '@@materials/modal'
import { useUserForm } from './useUserForm'

const currentPage = ref(1)
const limit = ref(10)
const search = ref('')

const useForm = useUserForm()

const onSubmit = async () => {
  console.log('submit')
  return true
}

const {
  data: usersPage,
  isFetching,
  errorMessage
} = useQuery<Page<User>>(['users', currentPage, limit], () =>
  jumper.users.getUsers(currentPage.value, limit.value)
)
</script>
