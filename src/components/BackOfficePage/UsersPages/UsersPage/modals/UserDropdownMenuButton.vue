<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button
        variant="ghost"
        class="rounded-sm px-3 text-slate-700 hover:bg-slate-100 dark:text-slate-300
          dark:hover:bg-slate-600"
      >
        <MoreHorizontal />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="flex flex-col">
      <DropdownMenuItem @click="editUserModalOpen = true" class="cursor-pointer"
        ><p>Edit user</p></DropdownMenuItem
      >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger class="flex cursor-not-allowed">
            <DropdownMenuItem
              class="cursor-pointer"
              @click="editPasswordUserModalOpen = true"
              :disabled="isSsoUser"
            >
              <p>Edit password</p>

              <TooltipContent v-if="isSsoUser">
                <p>Can't edit password of SSO user.</p>
              </TooltipContent>
            </DropdownMenuItem>
          </TooltipTrigger>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger class="flex cursor-not-allowed">
            <DropdownMenuItem
              class="cursor-pointer"
              v-if="user.isActive"
              @click="setActive(false)"
              :disabled="isSsoUser"
              >Disable user</DropdownMenuItem
            >
            <DropdownMenuItem
              v-else
              class="cursor-pointer"
              @click="setActive(true)"
              :disabled="isSsoUser"
              >Enable user</DropdownMenuItem
            ></TooltipTrigger
          >
          <TooltipContent v-if="isSsoUser">
            Can't edit if SSO user is active.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuItem class="cursor-pointer"
        ><p class="text-destructive" @click="deleteUserModalOpen = true">
          Delete user
        </p></DropdownMenuItem
      >
    </DropdownMenuContent>
  </DropdownMenu>
  <EditUserModal
    v-if="editUserModalOpen"
    v-model:open="editUserModalOpen"
    @user-updated="(e) => $emit('userUpdated', e)"
    :user="user"
  />
  <EditUserPasswordModal
    v-if="editPasswordUserModalOpen"
    v-model:open="editPasswordUserModalOpen"
    :user="user"
  />
  <DeleteUserModal
    v-if="deleteUserModalOpen"
    v-model:open="deleteUserModalOpen"
    @account-deleted="$emit('userUpdated')"
    :user="user"
  />
</template>

<script lang="ts" setup>
import type { User } from '@@types'
import jumper from '@/services/jumper'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthConfigStore } from '@/stores'
import { useToast } from '@@materials/ui/toast'
import { MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@@materials/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@@materials/ui/dropdown-menu'
import EditUserModal from './EditUserModal.vue'
import { EditUserPasswordModal } from '@/components/BackOfficePage/@common'
import DeleteUserModal from './DeleteUserModal.vue'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@@materials/ui/tooltip'

const { isSSOEnabled } = storeToRefs(useAuthConfigStore())
const { toast } = useToast()
const editUserModalOpen = ref(false)
const deleteUserModalOpen = ref(false)
const editPasswordUserModalOpen = ref(false)

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{ userUpdated: [user?: User] }>()

const isSsoUser = computed(() => isSSOEnabled && props.user.externalId !== null)

const setActive = async (isActive: boolean) => {
  try {
    const updatedUser = await jumper.users.update(props.user.id, { isActive })
    emit('userUpdated', updatedUser)
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: `Failed to ${isActive ? 'enabled' : 'disabled'} profile.`,
        description: error.message,
        variant: 'destructive'
      })
      return
    }
  }
  toast({
    title: `"${props.user.username}" profile ${isActive ? 'enabled' : 'disabled'}`
  })
}
</script>
