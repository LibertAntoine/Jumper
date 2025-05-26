<template>
  <FormField v-slot="{ componentField }" :name="fieldName">
    <FormItem class="space-y-0">
      <FormLabel v-if="label" class="ml-1 dark:text-slate-200">{{
        label
      }}</FormLabel>
      <FormControl>
        <Input
          class="placeholder:text-sm"
          v-bind="{
            ...componentField,
            ...$attrs
          }"
          :class="cn('w-full', props.class)"
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
import Input from '@@materials/ui/input/Input.vue'

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
    class?: string
    showErrorMessage?: boolean
    description?: string
  }>(),
  {
    showErrorMessage: true
  }
)
</script>
