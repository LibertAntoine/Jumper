<template>
  <Dialog v-model:open="open">
    <DialogScrollContent
      class="flex max-h-[90%] w-11/12 max-w-[500px] flex-col gap-8"
    >
      <DialogHeader>
        <DialogTitle
          ><h2 class="text-2xl font-semibold">New user</h2></DialogTitle
        >
        <DialogDescription>
          <p class="text-slate">Create a new user</p>
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit">
        <InputField name="email" type="email" label="Email" />
        <InputField name="password" type="password" label="Password" />
        <InputField name="username" label="Username" />
        <InputField name="firstName" label="First Name" />
        <InputField name="lastName" label="Last Name" />
        <CheckboxField
          name="isSuperAdmin"
          label="Is admin"
          description="Admin users can manage all users' rights."
        />

        <DialogFooter class="">
          <DialogClose as-child>
            <Button
              variant="secondary"
              size="lg"
              class="flex items-center gap-3 self-end"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            size="lg"
            class="flex min-w-[70px] items-center gap-3 self-end"
            type="submit"
            :disabled="isSubmitting"
          >
            <Loader2 v-if="isSubmitting" :size="20" class="animate-spin" />
            <p v-else>Create</p>
          </Button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { useUserForm } from './useUserForm'
import { useUsersStore } from '@/stores'
import { useToast } from '@@materials/ui/toast'
import { Button } from '@@materials/ui/button'
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogScrollContent
} from '@@materials/ui/dialog'

import { InputField, CheckboxField } from '@@materials/ui/form'

const usersStore = useUsersStore()
const { toast } = useToast()

const open = defineModel<boolean>('open')

const { handleSubmit, isSubmitting } = useUserForm()

const onSubmit = handleSubmit(async (values) => {
  try {
    await usersStore.create(values)
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Failed to create user.',
        description: error.message,
        variant: 'alert'
      })
      return
    }
  }

  toast({
    title: `"${values.username}" profile created.`,
    variant: 'success'
  })
  open.value = false
})
</script>
