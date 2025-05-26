<template>
  <div class="flex w-full items-end justify-end gap-2">
    <Combobox
      v-if="options && options.length > 0"
      v-model="selectedOption"
      :items="options"
      :disabled="isRunning"
      class="h-[32px] w-[120px]"
    />
    <div
      v-else-if="options != null"
      class="mr-2 flex h-full items-center text-sm italic text-slate-500"
    >
      Run combobox code to get options
    </div>
    <Button
      @click.prevent="$emit('kill')"
      v-if="isRunning"
      size="sm"
      class="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
      variant="outline"
    >
      <OctagonX />
      Stop
    </Button>
    <Button
      @click.prevent="$emit('exec')"
      size="sm"
      variant="outline"
      class="w-[70px] hover:bg-green-500 hover:text-white"
      :disabled="isRunning"
    >
      <template v-if="!isRunning">
        <Play />
        Run
      </template>
      <template v-else>
        <Loader2 class="animate-spin" />
      </template>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@@materials/ui/button'
import { Play, Loader2, OctagonX } from 'lucide-vue-next'
import { Combobox } from '@@materials/input'
import { watch } from 'vue'

const props = defineProps<{
  isRunning: boolean
  options?: string[] | null
}>()

defineEmits<{
  exec: []
  kill: []
}>()

const selectedOption = defineModel<string | null>('selected-option')

watch(
  () => props.options,
  (newOptions) => {
    if (newOptions && newOptions.length > 0) {
      if (selectedOption.value && newOptions.includes(selectedOption.value)) {
        selectedOption.value = newOptions[0]
      } else {
        selectedOption.value = newOptions[0]
      }
    } else {
      selectedOption.value = null
    }
  }
)
</script>
