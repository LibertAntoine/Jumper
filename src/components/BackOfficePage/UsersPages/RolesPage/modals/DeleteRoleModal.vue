<template>
  <ConfirmModal
    :onConfirm="deleteAccount"
    :title="`Delete '${props.role.name}' role`"
    confirmButtonName="Delete"
    confirmButtonVariant="destructive"
  >
    <h2 class="font-semibold">
      Are you sure you want to delete '{{ role.name }}' role?
    </h2>
    <p class="text-slate-800 dark:text-slate-400">
      You will permanently delete this role. This action cannot be undone.
    </p>
    <template #confirm-button>
      <Trash2 class="h-6 w-6" />
      Delete
    </template>
  </ConfirmModal>
</template>

<script setup lang="ts">
import type { DetailedRole } from '@@types'
import jumper from '@/services/jumper'
import { useConfirmToast } from '@/composables'
import { ConfirmModal } from '@@materials/modal'
import { Trash2 } from 'lucide-vue-next'

const emit = defineEmits<{
  roleDeleted: []
}>()

const props = defineProps<{
  role: DetailedRole
}>()

const deleteAccount = async () => {
  return await useConfirmToast(
    async () => {
      await jumper.roles.remove(props.role.id)
      emit('roleDeleted')
      return true
    },
    {
      successTitle: `'${props.role.name}' role deleted.`,
      errorTitle: 'Failed to delete account'
    }
  )
}
</script>
