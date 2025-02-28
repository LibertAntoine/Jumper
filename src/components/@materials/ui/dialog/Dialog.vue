<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'radix-vue'
import { DialogRoot, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

</script>

<template>
  <DialogRoot v-bind="forwarded" :modal="false">
    <div
      v-if="forwarded.open == true"
      :data-state="forwarded.open ? 'open' : 'closed'"
      class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in
        data-[state=closed]:animate-out data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0"
    />
    <slot />
  </DialogRoot>
</template>
