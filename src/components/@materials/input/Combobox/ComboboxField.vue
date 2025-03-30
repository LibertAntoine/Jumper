<template>
  <FormField v-slot="{ value, setValue }" :name="fieldName">
    <FormItem class="space-y-0">
      <FormLabel v-if="selectLabel" class="ml-1 dark:text-slate-200">
        {{ selectLabel }}
      </FormLabel>
      <FormControl>
        <Combobox
          :modelValue="value"
          @update:modelValue="(val) => setValue(val)"
          v-bind="{
            ...$slots,
            ...{
              items,
              itemKey,
              label,
              placeholder,
              search,
              clear
            }
          }"
        >
          <!-- TODO: See if they are a better way to relay the slots -->
          <template #list-item="props">
            <slot name="list-item" v-bind="props" />
          </template>
          <template #selection="props">
            <slot name="selection" v-bind="props" />
          </template>
        </Combobox>
      </FormControl>
      <FormDescription v-if="description" class="ml-1 dark:text-slate-500">{{
        description
      }}</FormDescription>
      <div v-if="!hideErrorMessage" class="h-6 pl-1">
        <FormMessage />
      </div>
    </FormItem>
  </FormField>
</template>

<script setup lang="ts" generic="T, U">
import { type HTMLAttributes } from 'vue'
import { AcceptableValue } from 'reka-ui'

import Combobox from './Combobox.vue'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@@materials/ui/form'

defineProps<
  {
    fieldName: string
    selectLabel?: string
    hideErrorMessage?: boolean
    description?: string
  } & {
    items?: T[]
    itemKey?: keyof T | ((item: T) => U)
    label?: keyof T | ((item: T) => AcceptableValue)
    placeholder?: string
    class?: HTMLAttributes['class']
    search?: boolean
    clear?: boolean
  }
>()
</script>
