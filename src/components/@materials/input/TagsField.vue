<template>
  <FormField :name="fieldName">
    <FormItem class="space-y-0">
      <FormLabel v-if="label" class="ml-1 dark:text-slate-200">{{
        label
      }}</FormLabel>
      <FormControl>
        <TagsInput :class="props.class">
          <div v-if="icon" class="relative w-6 max-w-sm items-center">
            <span
              class="absolute inset-y-0 start-0 flex items-center justify-center"
            >
              <slot name="icon">
                <Tags class="size-6 text-muted-foreground" />
              </slot>
            </span>
          </div>
          <TagsInputItem
            v-for="(item, i) in fields"
            class="shadow-sm text-slate-800 dark:text-slate-300"
            :key="item.key"
            :value="item"
          >
            <slot :item="item">
              <TagsInputItemText />
            </slot>
            <TagsInputItemDelete @click="remove(i)" class="hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" />
          </TagsInputItem>
          <ComboboxRoot
            v-model:open="open"
            v-model:search-term="searchTerm"
            class="w-[100px]"
          >
            <ComboboxAnchor as-child>
              <ComboboxInput as-child>
                <TagsInputInput
                  class="text-md w-full max-w-sm px-0 placeholder:text-muted-foreground"
                  :placeholder="placeholder"
                  @keyup.enter="!disableKeyEnter && addTag(searchTerm)"
                />
              </ComboboxInput>
            </ComboboxAnchor>
            <ComboboxPortal v-if="$slots['search-list']">
              <ComboboxContent>
                <CommandList
                  position="popper"
                  class="z-50 mt-2 w-[150px] max-h-[150px] rounded-md bg-popover text-popover-foreground shadow-md
                    outline-none data-[state=open]:animate-in data-[state=closed]:animate-out
                    data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                    data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
                    data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
                    data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                >
                  <slot
                    name="search-list"
                    :searchTerm="searchTerm"
                    :items="fields"
                    :addTag="addTag"
                  />
                </CommandList>
              </ComboboxContent>
            </ComboboxPortal>
          </ComboboxRoot>
        </TagsInput>
      </FormControl>
      <FormDescription v-if="description" class="ml-1 dark:text-slate-500">{{
        description
      }}</FormDescription>
      <div v-if="showErrorMessage" class="h-6 pl-1">
        <FormMessage />
      </div>
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { Tags } from 'lucide-vue-next'
import { useFieldArray } from 'vee-validate'
import { CommandList } from '@@materials/ui/command'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText
} from '@@materials/ui/tags-input'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot
} from 'radix-vue'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@@materials/ui/form'

const props = withDefaults(
  defineProps<{
    fieldName: string
    label?: string
    icon?: boolean
    create?: boolean
    placeholder?: string
    showErrorMessage?: boolean
    description?: string
    disableKeyEnter?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    icon: true,
    create: false,
    showErrorMessage: true
  }
)
const open = ref(false)

const { remove, push, fields } = useFieldArray<any>(props.fieldName)
const searchTerm = defineModel<string>('search-term')

const addTag = (tag: any) => {
  if (!tag) return
  push(tag)
  searchTerm.value = ''
}
</script>
