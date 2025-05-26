<template>
  <TagsField
    class=" max-w-[600px] max-h-[100px] overflow-auto p-[6px] gap-[6px]"
    field-name="permissions"
    :show-error-message="false"
    placeholder="Access..."
    v-model:search-term="search"
  >
  <template #icon>
    <ScanEyeIcon  class="text-slate-400 size-6"/>
  </template>
    <template #default="{ item }">
      <span class="flex items-center gap-1 px-1" v-if="item.value.username">
        <UserIcon :size="16" />
        {{ item.value.username }}
      </span>
      <span
        class="flex items-center gap-1 px-1"
        v-else-if="item.value.isAdminGroup !== undefined"
      >
        <UsersIcon :size="16" />
        {{ item.value.description }}
      </span>
      <span
        class="flex items-center gap-1 px-1"
        v-else-if="item.value.description !== undefined"
      >
        <UserCogIcon :size="16" />
        {{ item.value.name }}
      </span>
    </template>
    <template #search-list="{ items, addTag }">
      <Loader2
        class="m-auto my-1 h-10 animate-spin text-primary"
        v-if="!searchedPermissions.isFetched"
      />
      <template v-else>
        <CommandGroup
          class="px-2"
          heading="Users"
          v-if="searchedPermissions.data.value?.users.length"
        >
          <template
            v-for="user in searchedPermissions.data.value.users"
            :key="user.id"
          >
            <CommandItem
              v-if="
                !items.some(
                  (item) => item.value.username && item.value.id === user.id
                )
              "
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
        </CommandGroup>
        <CommandGroup
          class="px-2"
          heading="Groups"
          v-if="searchedPermissions.data.value?.groups.length"
        >
          <template
            v-for="group in searchedPermissions.data.value.groups"
            :key="group.id"
          >
            <CommandItem
              v-if="
                !items.some(
                  (item) =>
                    item.value.isAdminGroup !== undefined &&
                    item.value.id === group.id
                )
              "
              class="flex gap-1"
              :value="group.name"
              @select.prevent="addTag(group)"
            >
              <UsersIcon :size="16" />
              <p>{{ group.name }}</p>
            </CommandItem>
          </template>
        </CommandGroup>
        <CommandGroup
          class="px-2"
          heading="Roles"
          v-if="searchedPermissions.data.value?.roles.length"
        >
          <template
            v-for="role in searchedPermissions.data.value.roles"
            :key="role.id"
          >
            <CommandItem
              v-if="
                !items.some(
                  (item) =>
                    item.value.description !== undefined &&
                    item.value.id === role.id
                )
              "
              class="flex gap-1"
              :value="role.name + role.description"
              @select.prevent="addTag(role)"
            >
              <UserCogIcon :size="16" />
              <p>{{ role.name }}</p>
            </CommandItem>
          </template>
        </CommandGroup>
      </template>
    </template>
  </TagsField>
</template>

<script setup lang="ts">
import type { ActionPermissions } from '@@types'
import { ref } from 'vue'
import { useQuery } from '@/composables'
import jumper from '@/services/jumper'
import TagsField from '@@materials/input/TagsField.vue'
import { Loader2, UserIcon, UsersIcon, UserCogIcon, ScanEyeIcon } from 'lucide-vue-next'
import { CommandItem, CommandGroup } from '@@materials/ui/command'

const search = ref('')

const searchedPermissions = useQuery<ActionPermissions>(
  ['action-permissions-search', search],
  async () => {
    if (!search.value)
      return {
        users: [],
        groups: [],
        roles: []
      }
    return jumper.actions.searchPermissions(search.value)
  }
)
</script>
