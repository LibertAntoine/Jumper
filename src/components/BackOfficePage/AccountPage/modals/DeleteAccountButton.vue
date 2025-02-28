<template>
  <ConfirmModal
    :onConfirm="deleteAccount"
    title="Delete account"
    confirmButtonName="Delete"
    confirmButtonVariant="destructive"
  >
    <template #trigger>
      <Button size="sm" variant="destructive">
        <Trash2 class="h-6 w-6" />
        Delete account
      </Button>
    </template>
    <h2 class="font-semibold">Are you sure you want to delete this account?</h2>
    <p class="text-slate-800 dark:text-slate-400">You will permanently delete this account. This action cannot be undone.</p>
    <template #confirm-button>
      <Trash2 class="h-6 w-6" />
      Delete
    </template>
  </ConfirmModal>
</template>

<script setup lang="ts">
import jumper from '@/services/jumper'
import { useConfirmToast } from '@/composables'
import { Button } from '@@materials/ui/button'
import { ConfirmModal } from '@@materials/modal'
import { Trash2 } from 'lucide-vue-next'
import { useAuthUserStore } from '@/stores'

const authUserStore = useAuthUserStore()

const deleteAccount = async () => {
  return await useConfirmToast(
    async () => {
      if (!authUserStore.user) return
      jumper.users.remove(authUserStore.user?.id)
      authUserStore.signOut()
      return true
    },
    {
      errorTitle: 'Failed to delete account'
    }
  )
}
</script>
