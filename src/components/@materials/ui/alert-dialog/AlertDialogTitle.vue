<script setup lang="ts">
import type { AlertDialogTitleProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/services/utils'
import { AlertDialogTitle } from 'radix-vue'
import { computed } from 'vue'

const props = defineProps<AlertDialogTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AlertDialogTitle
    v-bind="delegatedProps"
    :class="cn('text-lg font-semibold', props.class)"
  >
    <slot />
  </AlertDialogTitle>
</template>
