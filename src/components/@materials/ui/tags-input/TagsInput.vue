<script setup lang="ts">
import type { TagsInputRootEmits, TagsInputRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/services/utils'
import { TagsInputRoot, useForwardPropsEmits } from 'radix-vue'
import { computed } from 'vue'

const props = defineProps<TagsInputRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<TagsInputRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <TagsInputRoot v-bind="forwarded" :class="cn('flex flex-wrap gap-2 items-center rounded-md border border-input bg-background px-3 py-2 text-sm', props.class)">
    <slot />
  </TagsInputRoot>
</template>
