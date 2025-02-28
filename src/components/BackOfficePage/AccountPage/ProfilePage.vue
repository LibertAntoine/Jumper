<template>
  <BackOfficePageLayout :isLoading="isFetching">
    <BackOfficeHeader
      :title="user ? getUserDisplayName(user) : 'Profile'"
      description="Edit your profile."
    />
    <div class="w-full flex-grow overflow-auto pr-3">
      <form class="flex max-w-[400px] flex-col pl-1 pt-2">
        <InputField fieldName="username" label="Username" />
        <InputField fieldName="email" label="Email" type="email" />
        <InputField fieldName="firstName" label="First Name" />
        <InputField fieldName="lastName" label="Last Name" />
      </form>
    </div>
    <div class="flex w-full justify-end gap-2 pt-4">
      <div class="mr-auto">
        <DeleteAccountButton class="mr-auto" />
      </div>
      <Button variant="outline" type="submit" size="sm" @click="onSubmit">
        <Lock class="h-6 w-6" />
        <p>
          <Loader2 v-if="isSubmitting" class="ml-1 h-4 w-4 animate-spin" />
          <span v-else>Edit Password</span>
        </p>
      </Button>
      <Button
        variant="outline"
        type="submit"
        size="sm"
        :disabled="isSubmitting || !meta.dirty || !meta.valid"
        @click="onSubmit"
      >
        <Save class="h-6 w-6" />
        <p class="w-[25px]">
          <Loader2 v-if="isSubmitting" class="ml-1 h-4 w-4 animate-spin" />
          <span v-else>Save</span>
        </p>
      </Button>
    </div>
    <div v-if="false" class="flex w-full justify-end gap-2 pt-2">
      <Button
        variant="outline"
        class="text-destructive"
        size="sm"
        @click="authUserStore.signOut"
      >
        <LogOut class="h-6 w-6" />
        <p>LogOut</p>
      </Button>
    </div>
  </BackOfficePageLayout>
</template>

<script setup lang="ts">
import Badge from '@@materials/ui/badge/Badge.vue'
import Button from '@@materials/ui/button/Button.vue'
import { useAuthUserForm } from './useUserForm'
import { storeToRefs } from 'pinia'
import { useAuthUserStore } from '@/stores'
import { useConfirmToast } from '@/composables/useConfirmToast'
import { getUserDisplayName } from '@/services/helpers/userName'
import { BackOfficeHeader, BackOfficePageLayout } from '../@common'
import DeleteAccountButton from './modals/DeleteAccountButton.vue'

import { Save, Loader2, LogOut, Lock } from 'lucide-vue-next'
import { InputField } from '@@materials/input'

const authUserStore = useAuthUserStore()
const { user, isFetching } = storeToRefs(authUserStore)

const { handleSubmit, isSubmitting, meta } = useAuthUserForm(
  user.value ?? undefined
)

const onSubmit = handleSubmit(async (values) => {
  await useConfirmToast(
    async () => {
      if (!user.value) return
      await authUserStore.update(values)
    },
    {
      successTitle: `Profile edited.`,
      errorTitle: `Failed to update profile.`
    }
  )
})

// const updateProfilePicture = async (file: File) => {
//   await useConfirmToast(
//     async () => {
//       if (!user.value) return
//       await authUserStore.updateProfilePicture(file)
//     },
//     {
//       successTitle: `Profile picture edited.`,
//       errorTitle: `Failed to update profile picture.`
//     }
//   )
// }
</script>
