<script setup lang="ts">
import type { AlertDialogActionProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { buttonVariants } from '@/components/@materials/ui/button'
import { cn } from '@/services/utils'
import { AlertDialogAction } from 'radix-vue'
import { computed } from 'vue'

const props = defineProps<AlertDialogActionProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AlertDialogAction v-bind="delegatedProps" :class="cn(buttonVariants(), props.class)">
    <slot />
  </AlertDialogAction>
</template>
