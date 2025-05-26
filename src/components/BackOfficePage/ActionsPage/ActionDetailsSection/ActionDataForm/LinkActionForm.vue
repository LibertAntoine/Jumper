<template>
  <div class="flex flex-col gap-2 px-2">
    <InputField
      field-name="data.url"
      label="URL"
      placeholder="https://example.com"
      :class="{
        'bg-yellow-100': differentDataFields.includes('url')
      }"
      :show-error-message="false"
      class="mb-4 max-w-[600px]"
    />
  </div>
</template>

<script setup lang="ts">
import InputField from '@@materials/input/InputField.vue'

defineProps<{
  differentDataFields: string[]
}>()
</script>
