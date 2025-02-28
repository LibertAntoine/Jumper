<template>
  <TableCell class="w-[250px]">
    <h3
      class="overflow-hidden truncate whitespace-nowrap font-medium text-slate-700
        dark:text-slate-400"
      :title="role.name"
    >
      {{ role.name }}
    </h3>
  </TableCell>
  <TableCell class="w-[180px]">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            class="flex w-[45px] items-center justify-center gap-1 rounded-sm p-2 font-semibold
              text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-400
              dark:hover:bg-slate-800"
          >
            {{ role.users.length }}
            <UserIcon class="h-4 w-4" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          v-if="role.users.length"
          class="max-h-[300px] overflow-auto"
        >
          <ul class="flex flex-col gap-1">
            <li
              :key="user.id"
              class="flex items-center gap-1"
              v-for="user in role.users.toSorted((a, b) =>
                a.username.localeCompare(b.username)
              )"
            >
              <UserIcon class="h-4 w-4" />{{ user.username }}
            </li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </TableCell>
  <TableCell v-if="isScimEnabled" class="w-[180px]">
    <div
      class="flex w-[45px] items-center justify-center gap-1 rounded-sm p-2 font-semibold
        text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-400
        dark:hover:bg-slate-800"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {{ role.groups.length }}
            <Users class="h-6 w-6" />
          </TooltipTrigger>
          <TooltipContent
            side="left"
            v-if="role.groups.length"
            class="max-h-[300px] overflow-auto"
          >
            <ul class="flex flex-col gap-1">
              <li
                :key="group.id"
                class="flex items-center gap-1"
                v-for="group in role.groups.toSorted((a, b) =>
                  a.name.localeCompare(b.name)
                )"
              >
                <Users class="h-4 w-4" />{{ group.name }}
              </li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </TableCell>
  <TableCell class="float-end flex-grow">
    <RoleDropdownMenuButton :role="role" @roleUpdated="$emit('roleUpdated')" />
  </TableCell>
</template>

<script setup lang="ts">
import type { DetailedRole } from '@@types'
import { TableCell } from '@@materials/ui/table'
import { UserIcon, Users } from 'lucide-vue-next'
import RoleDropdownMenuButton from './modals/RoleDropdownMenuButton.vue'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@@materials/ui/tooltip'

import { useAuthConfigStore } from '@/stores'

import { storeToRefs } from 'pinia'

const { isScimEnabled } = storeToRefs(useAuthConfigStore())

defineEmits<{
  roleUpdated: []
}>()

defineProps<{
  role: DetailedRole
}>()
</script>
