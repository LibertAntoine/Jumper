<template>
  <BackOfficePageLayout>
    <form @submit="onSubmit" class="h-full">
      <div class="flex h-full flex-col" v-if="actionDetailed">
        <ActionMainForm
          :actionsComposable="actionsComposable"
          v-model:isVersionBarOpen="isVersionBarOpen"
          :cardOptions="cardOptions"
        />
        <div class="relative flex h-full overflow-hidden">
          <div
            class="flex flex-grow flex-col transition-all transi ease-in-out"
            :class="[isVersionBarOpen ? 'md:mr-[244px]' : 'md:mr-0']"
          >
            <div
              class="mt-4 flex w-full flex-grow flex-col gap-2 overflow-auto"
            >
              <component
                :is="ACTION_DATA_COMPONENTS[actionDetailed.data.type]"
                :actionComposable="actionsComposable"
                :differentDataFields="differentDataFields"
                v-model:options="cardOptions"
              />
            </div>
            <div class="flex w-full items-end justify-end gap-2 pt-2">
              <div class="mr-auto">
                <DeleteActionButton
                  class="mr-auto"
                  :actionsComposable="actionsComposable"
                />
              </div>
              <Button size="sm" class="mt-2" :disabled="!meta.dirty || !meta.valid">
                <Save />
                Save
              </Button>
            </div>
          </div>
          <transition name="slide-right"
          >
            <ActionDetailsVersionsBar
              v-if="isVersionBarOpen"
              class="absolute right-0 transform"
              :versionsComposable="versionsComposable"
            />
          </transition>
        </div>
      </div>
    </form>
  </BackOfficePageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ActionsComposable } from '../useActions'
import { useToast } from '@@materials/ui/toast'
import Button from '@@materials/ui/button/Button.vue'
import { Save } from 'lucide-vue-next'
import { useActionDetailedForm } from './useActionDetailedForm'
import ActionMainForm from './ActionMainForm/ActionMainForm.vue'
import { ACTION_DATA_COMPONENTS } from './ActionDataForm'
import DeleteActionButton from './DeleteActionButton.vue'
import BackOfficePageLayout from '../../@common/BackOfficePageLayout.vue'
import ActionDetailsVersionsBar from './ActionDetailsVersionsBar.vue'
import { useVersions } from './useVersions'


const { toast } = useToast()

const props = defineProps<{
  actionsComposable: ActionsComposable
}>()
const { actionDetailed } = props.actionsComposable
const form = useActionDetailedForm(actionDetailed)
const { handleSubmit, meta } = form

const isVersionBarOpen = ref(false)

const versionsComposable = useVersions(isVersionBarOpen, actionDetailed, form)
const { differentDataFields, versionsQuery } = versionsComposable
const cardOptions = ref<string[] | null>([])

const onSubmit = handleSubmit(async (values) => {
  try {
    if (!actionDetailed.value) return
    await props.actionsComposable.update(actionDetailed.value.id, {
      ...values,
      data: values.data && (values.data.type === "Python" || values.data.type === "Windows CMD")
        ? {
            ...values.data,
            comboboxCode: values.data.comboboxCode ?? ""
          }
        : values.data,
      user_ids: values.permissions
        .filter((p) => 'username' in p)
        .map((p) => p.id),
      group_ids: values.permissions
        .filter((p) => 'isAdminGroup' in p)
        .map((p) => p.id),
      role_ids: values.permissions
        .filter((p) => 'description' in p)
        .map((p) => p.id)
    })
    versionsQuery.refetch()
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Failed to update action.',
        description: error.message,
        variant: 'destructive'
      })
    }
    return false
  }
  toast({
    title: `'${values.name}' action updated.`
  })
  return true
})
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}

.transi {
  transition-duration: 400ms;
}
</style>
