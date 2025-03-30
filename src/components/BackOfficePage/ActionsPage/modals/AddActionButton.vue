<template>
  <FormModal
    title="New action"
    :form="actionForm"
    description="Create a new action."
    :onSubmit="onSubmit"
  >
    <template #trigger>
      <Button class="w-full" size="sm"><Carrot />New Action</Button>
    </template>
    <template #default>
      <div class="flex flex-col">
        <ComboboxField
          selectLabel="Type"
          field-name="data.type"
          :items="[...ACTION_TYPES]"
        />
        <InputField field-name="name" label="Name" />
        <TextareaField field-name="description" label="Description" />
      </div>
    </template>
  </FormModal>
</template>

<script setup lang="ts">
import { ACTION_TYPES } from '@@types'
import { useActionForm } from './useActionForm'
import jumper from '@/services/jumper'
import { useToast } from '@@materials/ui/toast'
import { Carrot } from 'lucide-vue-next'
import { Button } from '@@materials/ui/button'
import { FormModal } from '@@materials/modal'
import { InputField, TextareaField } from '@@materials/input'
import { ComboboxField } from '@@materials/input'

const { toast } = useToast()
const actionForm = useActionForm()

const emit = defineEmits<{ actionAdded: [] }>()

const onSubmit = actionForm.handleSubmit(async (values) => {
  try {
    await jumper.actions.create(values)
    emit('actionAdded')
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Failed to create action.',
        description: error.message,
        variant: 'destructive'
      })
    }
  }
  toast({
    title: `"${values.name}" action created.`
  })
  return true
})
</script>
