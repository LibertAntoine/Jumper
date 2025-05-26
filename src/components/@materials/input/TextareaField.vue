<template>
  <FormField v-slot="{ componentField }" :name="fieldName">
    <FormItem class="space-y-0">
      <FormLabel v-if="label" class="ml-1 dark:text-slate-200">{{
        label
      }}</FormLabel>
      <FormControl>
        <Textarea
          class="placeholder:text-sm"
          v-bind="{
            ...componentField,
            ...$attrs,
          }"
          :placeholder="placeholder"
          :class="cn('w-full', props.class)"
          :disabled="disabled"
        />
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
import { cn } from '@/services/utils'
import Textarea from '@@materials/ui/textarea/Textarea.vue'

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
    placeholder?: string
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
