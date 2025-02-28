<template>
  <FormField v-slot="{ value, handleChange }" :name="fieldName">
    <FormItem class="flex flex-row items-start gap-x-2 space-y-0">
      <FormControl>
        <Checkbox
          :checked="value"
          @update:checked="handleChange"
          :class="cn(' placeholder:text-sm mt-[1px]', props.class)"
          :disabled="disabled"
        />
      </FormControl>
      <div class="space-y-1 leading-none">
        <FormLabel v-if="label" class="ml-1 dark:text-slate-200">{{ label }}</FormLabel>
        <FormDescription v-if="description" class="ml-1 dark:text-slate-500">{{
          description
        }}</FormDescription>
        <div v-if="showErrorMessage" class="h-6 pl-1">
          <FormMessage />
        </div>
      </div>
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import { cn } from '@/services/utils'
import { Checkbox } from '@@materials/ui/checkbox'

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
    label: string
    fieldName: string
    class?: string
    showErrorMessage?: boolean
    description?: string
    disabled?: boolean
  }>(),
  {
    showErrorMessage: true
  }
)
</script>
