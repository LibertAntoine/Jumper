<template>
  <ConfirmModal
    :onConfirm="deleteAction"
    title="Delete action"
    confirmButtonName="Delete"
    confirmButtonVariant="destructive"
  >
    <template #trigger>
      <Button size="sm" variant="destructive" @click.prevent>
        <Trash2 class="h-6 w-6" />
        Delete action
      </Button>
    </template>
    <h2 class="font-semibold">Are you sure you want to delete this action?</h2>
    <p class="text-slate-800 dark:text-slate-400">
      You will permanently delete this action. This action cannot be undone.
    </p>
    <template #confirm-button>
      <Trash2 class="h-6 w-6" />
      Delete
    </template>
  </ConfirmModal>
</template>

<script setup lang="ts">
import type { ActionsComposable } from '../useActions'
import { useConfirmToast } from '@/composables'
import { Button } from '@@materials/ui/button'
import { ConfirmModal } from '@@materials/modal'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  actionsComposable: ActionsComposable
}>()

const deleteAction = async () => {
  return await useConfirmToast(
    async () => {
      if (!props.actionsComposable.actionDetailed.value) return
      await props.actionsComposable.remove(
        props.actionsComposable.actionDetailed.value.id
      )
      return true
    },
    {
      errorTitle: 'Failed to delete account'
    }
  )
}
</script>
