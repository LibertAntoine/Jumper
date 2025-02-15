<template>
  <TableCell>
    <div class="flex gap-4">
      <div>
        <div class="flex gap-1 lg:w-full">
          <h3
            class="overflow-hidden truncate whitespace-nowrap font-medium"
            :title="`${user.firstName} ${user.lastName}`"
            v-if="user.firstName && user.lastName"
          >
            {{ `${user.firstName} ${user.lastName}` }}
          </h3>
          <p class="text-slate-500 ">@{{ user.username }}</p>
        </div>
        <p class="whitespace-nowrap text-slate-500">{{ user.email }}</p>
      </div>
    </div>
  </TableCell>
  <TableCell  v-if="isOidcEnabled || isScimEnabled"
    ><Check v-if="isSsoUser" :size="20"
  /></TableCell>
  <TableCell 
    ><Check v-if="user.isActive" :size="20"
  /></TableCell>
  <TableCell >
    <Select v-model="role">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="user">User</SelectItem>
      </SelectContent>
    </Select></TableCell
  >
  <TableCell>
    <!-- <UserOptionsDropdownMenu :user="user" /> -->
  </TableCell>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useToast } from '@@materials/ui/toast'
import type { User } from '@@types'
import { useAuthConfigStore } from '@/stores'
import { Check } from 'lucide-vue-next'
// import UserOptionsDropdownMenu from './UserOptionsDropdownMenu.vue'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@@materials/ui/select'

import { TableCell, TableRow } from '@@materials/ui/table'

const { isOidcEnabled, isScimEnabled } = storeToRefs(useAuthConfigStore())

const props = defineProps<{
  user: User
}>()

const isSsoUser = computed(
  () =>
    (isOidcEnabled.value || isScimEnabled.value) &&
    props.user.externalId !== null
)

const { toast } = useToast()

const role = computed({
  get: () => {
    if (props.user.isSuperuser) return 'admin'
    return 'user'
  },
  set: async (value: string) => {
    try {
      // await usersStore.update(props.user.id, { isSuperuser: value === 'admin' })
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Failed to change user role.',
          description: error.message,
          variant: 'destructive'
        })
        return
      }
    }
  }
})
</script>
