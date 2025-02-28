<template>
  <TableCell class="w-[250px]">
    <div class="flex w-full gap-4">
      <div class="w-full">
        <div class="flex gap-1 lg:w-full">
          <h3
            class="overflow-hidden truncate whitespace-nowrap font-medium text-slate-700
              dark:text-slate-400"
            :title="`${user.firstName} ${user.lastName}`"
          >
            {{ user.username }}
          </h3>
          <p class="text-slate-500" v-if="user.firstName && user.lastName">
            {{ `${user.firstName} ${user.lastName}` }}
          </p>
        </div>
        <p class="truncate whitespace-nowrap text-slate-500">
          {{ user.email }}
        </p>
      </div>
    </div>
  </TableCell>

  <TableCell class="w-[180px]">
    <Select v-model="role">
      <SelectTrigger class="h-7 w-[120px] pl-2 pr-1">
        <SelectValue class="font-semibold text-slate-700 dark:text-slate-400" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="user">User</SelectItem>
      </SelectContent>
    </Select></TableCell
  >
  <TableCell class="w-[50px]" v-if="isSSOEnabled"
    ><Check v-if="isSsoUser" :size="20"
  /></TableCell>
  <TableCell class="w-[50px]" v-if="!activeOnly"
    ><Check
      class="text-slate-700 dark:text-slate-400"
      v-if="user.isActive"
      :size="20"
  /></TableCell>
  <TableCell>
    <div class="flex justify-end">
      <UserDropdownMenuButton
        :user="user"
        @user-updated="(e) => $emit('userUpdated', e)"
      />
    </div>
  </TableCell>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import jumper from '@/services/jumper'
import { useToast } from '@@materials/ui/toast'
import type { User } from '@@types'
import { useAuthConfigStore } from '@/stores'
import { Check } from 'lucide-vue-next'
import UserDropdownMenuButton from './modals/UserDropdownMenuButton.vue'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@@materials/ui/select'

import { TableCell } from '@@materials/ui/table'

const emit = defineEmits<{ userUpdated: [user?: User] }>()

const { isSSOEnabled } = storeToRefs(useAuthConfigStore())

const props = defineProps<{
  user: User
  activeOnly: boolean
}>()

const isSsoUser = computed(
  () => isSSOEnabled.value && props.user.externalId !== null
)

const { toast } = useToast()

const role = computed({
  get: () => {
    if (props.user.isSuperuser) return 'admin'
    return 'user'
  },
  set: async (value: string) => {
    try {
      const updatedUser = await jumper.users.update(props.user.id, {
        isSuperuser: value === 'admin'
      })
      emit('userUpdated', updatedUser)
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
