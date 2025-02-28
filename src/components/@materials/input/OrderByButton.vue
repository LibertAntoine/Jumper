<template>
  <Button @click="changeOrder" variant="ghost" class="p-1 px-2 -left-1 relative">
    <slot />
    <ChevronDown
      class="transition-transform"
      v-if="order.field === props.field"
      :class="{
        'rotate-180 ': order.direction === 'desc',
      }"
    />
  </Button>
</template>

<script setup lang="ts">
import type { Order } from '@@types'
import { Button } from '@@materials/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

const order = defineModel<Order>('order', {
  default: { field: '', direction: 'asc' }
})
const props = defineProps<{
  field: string
  disableDesc?: boolean
}>()

const changeOrder = () => {
  if (order.value.field === props.field) {
    order.value.direction = order.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    order.value.field = props.field
    order.value.direction = 'asc'
  }
}
</script>
