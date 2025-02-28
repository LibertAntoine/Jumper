<template>
  <ConfirmModal
    :onConfirm="deleteAccount"
    :title="`Delete '${props.user?.username}' account`"
    confirmButtonName="Delete"
    confirmButtonVariant="destructive"
  >
    <h2 class="font-semibold">
      Are you sure you want to delete '{{ user.username }}' account?
    </h2>
    <p class="text-slate-800 dark:text-slate-400">
      You will permanently delete this account. This action cannot be undone.
    </p>
    <template #confirm-button>
      <Trash2 class="h-6 w-6" />
      Delete
    </template>
  </ConfirmModal>
</template>

<script setup lang="ts">
import type { User } from '@@types'
import jumper from '@/services/jumper'
import { useConfirmToast } from '@/composables'
import { ConfirmModal } from '@@materials/modal'
import { Trash2 } from 'lucide-vue-next'

const emit = defineEmits<{
  accountDeleted: []
}>()
const props = defineProps<{
  user: User
}>()

const deleteAccount = async () => {
  return await useConfirmToast(
    async () => {
      await jumper.users.remove(props.user?.id)
      emit('accountDeleted')
      return true
    },
    {
      successTitle: `'${props.user?.username}' account deleted.`,
      errorTitle: 'Failed to delete account'
    }
  )
}
</script>
