<template>
  <div class="flex w-full flex-col gap-3 border-b pb-4" v-if="actionDetailed">
    <div class="flex w-full gap-3">
      <ActionCardPreview :actionsComposable="actionsComposable" :cardOptions="cardOptions" />
      <div class="flex w-full flex-col gap-3">
        <div class="flex items-center gap-3">
          <div
            class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-slate-100
              p-1 shadow-sm dark:bg-slate-800"
            :title="actionDetailed.data.type"
          >
            <Link v-if="actionDetailed.data.type == 'Link'" :size="15" />
            <img v-else src="/actions/python.png" />
          </div>
          <InputField
            class="h-[28px] px-2 font-semibold"
            field-name="name"
            maxlength="25"
            placeholder="Action name"
            :show-error-message="false"
          />
          <div class="flex items-center gap-[2px]">
            <CheckboxField
              class="h-[13px] w-[13px]"
              field-name="isPublic"
              :show-error-message="false"
            />
            <span
              class="text-xs font-semibold text-slate-800 dark:text-slate-400"
            >
              Public
            </span>
          </div>
          <Switch
            class="ml-auto h-[20px] w-[35px] rounded-full data-[state=checked]:bg-green-600
              data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-500"
            :model-value="actionDetailed.isActive"
            @update:model-value="toggleActive"
          >
            <template #thumb>
              <div
                class="flex h-full w-full items-center justify-center rounded-full"
              >
                <Check
                  v-if="actionDetailed.isActive"
                  class="size-3 text-green-600"
                />
                <div
                  v-else
                  class="size-2 rounded-[2px] bg-slate-400 dark:bg-slate-500"
                />
              </div>
            </template>
          </Switch>
          <Button
            class="ml-1 flex items-center justify-center bg-slate-50 p-2 text-sm text-slate-500
              hover:bg-slate-100 hover:text-slate-950 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            variant="outline"
            @click.prevent="isVersionBarOpen = !isVersionBarOpen"
          >
            <GitCompareArrows :size="22" />
          </Button>
        </div>
        <ActionPermissionTagsField v-if="!isPublic" />
        <TextareaField
          class="max-h-[40px] min-h-[40px] max-w-[600px] resize-none px-2 py-1"
          field-name="description"
          maxlength="500"
          placeholder="Action description"
          :show-error-message="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Switch } from '@@materials/ui/switch'
import type { ActionsComposable } from '../../useActions'
import ActionPermissionTagsField from './ActionPermissionTagsField.vue'
import ActionCardPreview from './ActionCardPreview.vue'
import { InputField, TextareaField, CheckboxField } from '@@materials/input'
import { Button } from '@@materials/ui/button'
import { Link, Check, GitCompareArrows } from 'lucide-vue-next'
import { useToast } from '@@materials/ui/toast'
import { useField } from 'vee-validate'

const props = defineProps<{
  actionsComposable: ActionsComposable,
  cardOptions?: string[] | null
}>()

const { toast } = useToast()
const { actionDetailed } = props.actionsComposable
const { value: isPublic } = useField<boolean>('isPublic')
const isVersionBarOpen = defineModel<boolean>('isVersionBarOpen', {
  default: false
})

const toggleActive = async (isActive: boolean) => {
  if (!actionDetailed.value) return
  try {
    await props.actionsComposable.update(actionDetailed.value.id, { isActive })
    toast({
      title: isActive ? 'Action activated.' : 'Action deactivated.',
      variant: 'default'
    })
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Failed to update action.',
        description: error.message,
        variant: 'destructive'
      })
    }
  }
}
</script>
