<template>
  <div
    class="flex h-[145px] w-[130px] flex-shrink-0 flex-col items-center gap-2 rounded-md
      bg-slate-100 p-2 pb-1 shadow-sm dark:bg-slate-800"
  >
    <button
      @click.prevent="() => open()"
      class="h-[78px] w-[78px] flex-shrink-0 p-[2px]"
    >
      <img
        v-if="actionDetailed?.thumbnailUrl"
        :src="actionDetailed?.thumbnailUrl"
        class="h-full w-full rounded-md object-contain"
      />
      <div v-else class="flex h-full w-full items-center justify-center">
        <Carrot :size="60" class="ml-2 text-slate-300" />
      </div>
    </button>
    <div class="flex flex-grow flex-col items-center gap-0.5">
      <h2
        class="text-md w-full text-center overflow-hidden
          break-all font-semibold text-slate-700 dark:text-slate-200"
        :class="{
          'line-clamp-2': !cardOptions,
          'line-clamp-1': cardOptions
        }"
      >
        {{ name }}
      </h2>
      <Combobox
        v-if="cardOptions"
        class="text-md ml-0!important h-[18px] w-[115px] gap-0 truncate border-none
          bg-slate-100 px-0.5 text-xs italic text-slate-400 hover:bg-slate-50
          hover:text-slate-700 dark:bg-slate-700 dark:text-slate-400"
        :items="cardOptions"
        disable-check
        list-item-class="cursor-pointer p-1 data-[highlighted]:bg-slate-200 dark:data-[highlighted]:bg-slate-800"
        pop-ever-class="bg-slate-100 dark:bg-slate-700"
      >
        <template #selection
          ><p class="ml-[16px] flex w-[100px] justify-center truncate">
            {{ cardOptions[0] }}
          </p>
        </template>
        <template #list-item="{ label }"
          ><p
            class="flex w-full justify-center truncate text-xs font-semibold italic text-slate-500
              dark:text-slate-400"
          >
            {{ label }}
          </p>
        </template>
      </Combobox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ActionsComposable } from '../../useActions'
import { useFileDialog } from '@vueuse/core'
import { useField } from 'vee-validate'
import { useToast } from '@@materials/ui/toast'
import { Carrot } from 'lucide-vue-next'
import { Combobox } from '@@materials/input'

const { toast } = useToast()

const props = defineProps<{
  actionsComposable: ActionsComposable
  cardOptions?: string[] | null
}>()
const selectedOption = ref<string | null>(null)

const { open, onChange } = useFileDialog({
  multiple: false,
  accept: 'image/*'
})

const { actionDetailed } = props.actionsComposable
const { value: name } = useField<string>('name')

onChange(async (files) => {
  if (files && files.length > 0 && actionDetailed.value) {
    const file = files[0]
    try {
      await props.actionsComposable.updateThumbnail(
        actionDetailed.value.id,
        file
      )
      toast({
        title: 'Thumbnail updated.',
        description: `Action thumbnail updated to ${file.name}.`,
        variant: 'default'
      })
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Failed to update thumbnail.',
          description: error.message,
          variant: 'destructive'
        })
      }
    }
  }
})

watch(
  () => props.cardOptions,
  (newOptions) => {
    if (newOptions && newOptions.length > 0) {
      selectedOption.value = newOptions[0]
    } else {
      selectedOption.value = null
    }
  }
)
</script>
