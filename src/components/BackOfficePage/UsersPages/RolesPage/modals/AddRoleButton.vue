<template>
  <FormModal
    title="New role"
    :form="roleForm"
    description="Create a new role."
    :onSubmit="onSubmit"
  >
    <template #trigger>
      <Button
        variant="outline"
        size="sm"
        class="text-slate-700 dark:text-slate-300"
        ><UserCog />Add Role</Button
      >
    </template>
    <template #default>
      <div class="flex flex-col">
        <InputField field-name="name" label="Name" />
        <TextareaField field-name="description" label="Description" />
        <TagsField
          field-name="users"
          label="Users"
          :disable-key-enter="true"
          v-model:search-term="usersSearch"
        >
          <template #default="{ item }">
            <span class="flex items-center gap-1 px-1">
              <UserIcon :size="16" />
              {{ item.value.username }}
            </span>
          </template>
          <template #search-list="{ items, addTag }">
            <Loader2
              class="m-auto my-1 h-10 animate-spin text-primary"
              v-if="usersSearch && (isUsersFetching || isUsersSearchDebouncing)"
            />
            <template v-else v-for="user in usersPage?.results" :key="user.id">
              <CommandItem
                v-if="!items.some((item) => item.value.id === user.id)"
                class="flex gap-1"
                :value="
                  user.username + user.firstName + user.lastName + user.email
                "
                @select.prevent="addTag(user)"
              >
                <UserIcon :size="16" />
                <p>{{ user.username }}</p>
              </CommandItem>
            </template>
          </template>
        </TagsField>
        <TagsField
          v-if="isScimEnabled"
          field-name="groups"
          label="Groups"
          :disable-key-enter="true"
          v-model:search-term="groupsSearch"
        >
          <template #default="{ item }">
            <span class="flex items-center gap-1 px-1">
              <GroupIcon :size="16" />
              {{ item.value.name }}
            </span>
          </template>
          <template #search-list="{ items, addTag }">
            <Loader2
              class="m-auto my-1 h-10 animate-spin text-primary"
              v-if="
                groupsSearch && (isGroupsFetching || isGroupsSearchDebouncing)
              "
            />
            <template v-for="group in groupsPage?.results" :key="group.id">
              <CommandItem
                v-if="!items.some((item) => item.value.id === group.id)"
                class="flex gap-1"
                :value="group.name"
                @select.prevent="addTag(group)"
              >
                <GroupIcon :size="16" />
                <p>{{ group.name }}</p>
              </CommandItem>
            </template>
          </template>
        </TagsField>
      </div>
    </template>
  </FormModal>
</template>

<script setup lang="ts">
import { Group, User, Action } from '@@types'
import { useRoleForm } from './useRoleForm'
import jumper from '@/services/jumper'
import { useToast } from '@@materials/ui/toast'
import { useAuthConfigStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useUsersQuery, useGroupsQuery } from '@/composables/query'
import { Loader2, UserCog, UserIcon, GroupIcon } from 'lucide-vue-next'
import { Button } from '@@materials/ui/button'
import { FormModal } from '@@materials/modal'
import { InputField, TextareaField, TagsField } from '@@materials/input'
import { CommandItem } from '@@materials/ui/command'


const { toast } = useToast()

const roleForm = useRoleForm()
const { isScimEnabled } = storeToRefs(useAuthConfigStore())

const emit = defineEmits<{ roleAdded: [] }>()

const {
  data: usersPage,
  search: usersSearch,
  isFetching: isUsersFetching,
  isSearchDebouncing: isUsersSearchDebouncing
} = useUsersQuery({
  limit: 100,
  searchDebounceTime: 400,
  searchNeeded: true
})

const {
  data: groupsPage,
  search: groupsSearch,
  isFetching: isGroupsFetching,
  isSearchDebouncing: isGroupsSearchDebouncing
} = useGroupsQuery({
  limit: 100,
  searchDebounceTime: 400,
  searchNeeded: true
})

const onSubmit = roleForm.handleSubmit(async (values) => {
  try {
    console.log('values', {
      name: values.name,
      description: values.description,
      users: values.users?.map((user: User) => user.id),
      groups: values.groups?.map((group: Group) => group.id),
      actions: values.actions?.map((action: Action) => action.id)
    })
    await jumper.roles.create({
      name: values.name,
      description: values.description,
      users: values.users?.map((user: User) => user.id),
      groups: values.groups?.map((group: Group) => group.id),
      actions: values.actions?.map((action: Action) => action.id)
    })
    emit('roleAdded')
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Failed to create role.',
        description: error.message,
        variant: 'destructive'
      })
    }
  }
  toast({
    title: `"${values.name}" role created.`
  })
  return true
})
</script>
