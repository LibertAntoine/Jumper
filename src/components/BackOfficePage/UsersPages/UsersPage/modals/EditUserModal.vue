<template>
  <FormModal
    :title="`Edit ${user.username}`"
    :form="userForm"
    description="Edit user info."
    :onSubmit="onSubmit"
  >
    <div class="flex flex-col">
      <InputField field-name="email" type="email" label="Email" />
      <InputField field-name="username" label="Username" />
      <InputField field-name="firstName" label="First Name" />
      <InputField field-name="lastName" label="Last Name" />
      <CheckboxField
        field-name="isSuperAdmin"
        label="Is admin"
        description="Admin users can manage all users' permissions."
      />
    </div>
  </FormModal>
</template>

<script setup lang="ts">
import type { User } from '@@types'
import { useUserForm } from './useUserForm'
import jumper from '@/services/jumper'
import { useToast } from '@@materials/ui/toast'
import { FormModal } from '@@materials/modal'
import { InputField, CheckboxField } from '@@materials/input'

const { toast } = useToast()

const props = defineProps<{
  user: User
}>()

const userForm = useUserForm(props.user)

const emit = defineEmits<{ userUpdated: [user: User] }>()

const onSubmit = userForm.handleSubmit(async (values) => {
  try {
    const userUpdated = await jumper.users.update(props.user.id, values)
    emit('userUpdated', userUpdated)
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Failed to update user.',
        description: error.message,
        variant: 'destructive'
      })
    }
    return false
  }
  toast({
    title: `'${values.username}' profile updated.`
  })
  return true
})
</script>
