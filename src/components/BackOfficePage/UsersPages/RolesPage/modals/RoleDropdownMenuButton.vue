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
      <DropdownMenuItem class="cursor-pointer" @click="editRoleModalOpen = true"
        ><p>Edit role</p></DropdownMenuItem
      >
      <DropdownMenuItem class="cursor-pointer"
        ><p class="text-destructive" @click="deleteRoleModalOpen = true">
          Delete role
        </p></DropdownMenuItem
      >
    </DropdownMenuContent>
  </DropdownMenu>
  <EditRoleModal
    v-if="editRoleModalOpen"
    v-model:open="editRoleModalOpen"
    @role-updated="$emit('roleUpdated')"
    :role="role"
  />
  <DeleteRoleModal
    v-if="deleteRoleModalOpen"
    v-model:open="deleteRoleModalOpen"
    @role-deleted="$emit('roleUpdated')"
    :role="role"
  />
</template>

<script lang="ts" setup>
import type { DetailedRole } from '@@types'
import { ref } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@@materials/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@@materials/ui/dropdown-menu'
import EditRoleModal from './EditRoleModal.vue'
import DeleteRoleModal from './DeleteRoleModal.vue'

const editRoleModalOpen = ref(false)
const deleteRoleModalOpen = ref(false)

defineProps<{
  role: DetailedRole
}>()

defineEmits<{ roleUpdated: [] }>()
</script>
