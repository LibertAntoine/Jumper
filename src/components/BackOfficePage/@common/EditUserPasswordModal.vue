<template>
  <FormModal
    :title="`Edit ${user.username} password`"
    :form="passwordUserForm"
    description="Define new user password."
    :onSubmit="onSubmit"
  >
    <div class="flex flex-col">
      <InputField field-name="password" type="password" label="Password" />
      <InputField
        field-name="passwordConfirmation"
        type="password"
        label="Confirm password"
      />
    </div>
  </FormModal>
</template>

<script setup lang="ts">
import type { User } from '@@types'
import { usePasswordUserForm } from '@/composables'
import jumper from '@/services/jumper'
import { useToast } from '@@materials/ui/toast'
import { FormModal } from '@@materials/modal'
import { InputField } from '@@materials/input'

const { toast } = useToast()

const props = defineProps<{
  user: User
}>()

const passwordUserForm = usePasswordUserForm()

const onSubmit = passwordUserForm.handleSubmit(async (values) => {
  try {
    await jumper.users.update(props.user.id, {
      password: values.password
    })
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Failed to update user password.',
        description: error.message,
        variant: 'destructive'
      })
    }
    return false
  }
  toast({
    title: `"${props.user.username}" password updated.`
  })
  return true
})
</script>
