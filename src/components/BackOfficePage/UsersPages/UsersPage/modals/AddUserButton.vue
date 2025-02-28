<template>
  <FormModal
    title="New user"
    :form="userForm"
    description="Create a new user"
    :onSubmit="onSubmit"
  >
    <template #trigger>
      <Button variant="outline" size="sm" class="text-slate-700 dark:text-slate-300"><UserIcon />Add User</Button>
    </template>
    <template #default>
      <div class="flex flex-col">
        <InputField field-name="email" type="email" label="Email" />
        <InputField field-name="password" type="password" label="Password" />
        <InputField field-name="username" label="Username" />
        <InputField field-name="firstName" label="First Name" />
        <InputField field-name="lastName" label="Last Name" />
        <CheckboxField
          field-name="isSuperAdmin"
          label="Is admin"
          description="Admin users can manage all users' permissions."
        />
      </div>
    </template>
  </FormModal>
</template>

<script setup lang="ts">
import { useUserForm } from './useUserForm'
import jumper from '@/services/jumper'
import { useToast } from '@@materials/ui/toast'
import { UserIcon } from 'lucide-vue-next'
import { Button } from '@@materials/ui/button'
import { FormModal } from '@@materials/modal'
import { InputField, CheckboxField } from '@@materials/input'

const { toast } = useToast()

const userForm = useUserForm()

const emit = defineEmits<{ userAdded: [] }>()

const onSubmit = userForm.handleSubmit(async (values) => {
  try {
    await jumper.users.create(values)
    emit('userAdded')
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Failed to create user.',
        description: error.message,
        variant: 'destructive'
      })
    }
  }
  toast({
    title: `"${values.username}" profile created.`
  })
  return true
})
</script>
