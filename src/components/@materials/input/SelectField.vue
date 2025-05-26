<template>
  <FormField v-slot="{ componentField }" :name="fieldName">
    <FormItem class="space-y-0">
      <FormLabel v-if="label" class="ml-1 dark:text-slate-200">{{
        label
      }}</FormLabel>
      <FormControl>
        <Select v-bind="componentField">
          <SelectTrigger class="h-7 w-[120px] pl-2 pr-1">
            <SelectValue
              class="font-semibold text-slate-700 dark:text-slate-400"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="item in items"
              :key="JSON.stringify(item)"
              :value="getValue(item) as string"
              >Admin
            </SelectItem>
          </SelectContent>
        </Select>
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

<script setup lang="ts" generic="T">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@@materials/ui/form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@@materials/ui/select'

withDefaults(
  defineProps<{
    label: string
    fieldName: string
    items: T[]
    getValue?: (item: T) => unknown
    getLabel?: (item: T) => string
    placeholder?: string
    type?: string
    class?: string
    showErrorMessage?: boolean
    description?: string
    disabled?: boolean
  }>(),
  {
    showErrorMessage: true,
    getValue: (item: T) => item
  }
)
</script>
