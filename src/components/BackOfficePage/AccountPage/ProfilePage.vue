<template>
  <BackOfficePageLayout :isLoading="isFetching">
    <div class="mb-4 flex w-full flex-col gap-1 border-b px-1 pb-4">
      <div class="flex items-center space-x-2">
        <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200">
          {{ user && getUserDisplayName(user) }}
        </h2>
        <!-- <Badge variant="outline" class="h-6">SSO</Badge> -->
      </div>
      <p class="text-sm text-slate-400 dark:text-slate-500">
        Edit your profile
      </p>
    </div>
    <div class="w-full flex-grow overflow-auto pr-3">
      <form class="flex max-w-[400px] flex-col pl-1 pt-2">
        <InputField fieldName="username" label="Username" />
        <InputField fieldName="email" label="Email" type="email" />
        <InputField fieldName="firstName" label="First Name" />
        <InputField fieldName="lastName" label="Last Name" />
      </form>
    </div>
    <div class="flex w-full justify-end gap-2 pt-4">
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
      <Button variant="destructive" size="sm">
        <Trash2 class="h-6 w-6" />
        Delete profile
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
import BackOfficePageLayout from '../@common/BackOfficePageLayout.vue'

import { Trash2, Save, Loader2 } from 'lucide-vue-next'
import InputField from './InputField.vue'

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
