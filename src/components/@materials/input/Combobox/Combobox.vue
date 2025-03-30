<template>
  <Combobox
    :value="JSON.stringify(modelValue)"
    @update:model-value="select"
    by="label"
  >
    <ComboboxAnchor as-child>
      <ComboboxTrigger as-child>
        <Button
          variant="outline"
          role="combobox"
          :class="cn('justify-between gap-0 pl-3 pr-2', props.class)"
        >
          <div class="flex flex-grow items-center gap-2 truncate text-start">
            <slot name="selection" :item="selectedItem" :label="itemLabel">
              {{ itemLabel ?? placeholder }}
            </slot>
          </div>

          <Button
            class="z-1000 h-4 w-4 shrink-0 rounded-full p-0 opacity-50 hover:bg-slate-300
              hover:opacity-70"
            v-if="modelValue && clear"
            variant="ghost"
            @click.stop="
              () => {
                modelValue = null
              }
            "
          >
            <X />
          </Button>
          <ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxList>
      <div class="relative w-full max-w-sm items-center" v-if="search">
        <ComboboxInput
          class="h-10 rounded-none border-0 border-b pl-9 focus-visible:ring-0"
          placeholder="Search..."
        />
        <span
          class="absolute inset-y-0 start-0 flex items-center justify-center px-3"
        >
          <Search class="size-4 text-muted-foreground" />
        </span>
      </div>
      <ComboboxEmpty> Not found. </ComboboxEmpty>
      <ComboboxGroup>
        <ComboboxItem
          v-for="[key, item] in comboItems.entries()"
          :key="key"
          :value="key"
        >
          <div class="flex flex-grow items-center gap-2 truncate text-start">
            <slot name="list-item" :item="item" :label="getLabel(item)">
              {{ getLabel(item) }}
            </slot>
          </div>
          <ComboboxItemIndicator>
            <Check :class="cn('ml-auto h-4 w-4')" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>

<script setup lang="ts" generic="T, U">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/services/utils'
import { Button } from '@@materials/ui/button'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger
} from '@@materials/ui/combobox'
import { Check, ChevronDown, Search, X } from 'lucide-vue-next'
import { AcceptableValue } from 'reka-ui'

const modelValue = defineModel<U | null>('modelValue')

const props = withDefaults(
  defineProps<{
    items?: T[]
    itemKey?: keyof T | ((item: T) => U)
    label?: keyof T | ((item: T) => AcceptableValue)
    placeholder?: string
    class?: HTMLAttributes['class']
    search?: boolean
    clear?: boolean
  }>(),
  {
    itemKey: (item: T) => item as unknown as U,
    label: (item: T) => (typeof item === 'string' ? item : JSON.stringify(item))
  }
)

const getLabel = (item: T) => {
  if (typeof props.label === 'function') return props.label(item)
  return item[props.label as keyof T] as unknown as AcceptableValue
}

const getKey = (item: T) => {
  if (typeof props.itemKey === 'function') return props.itemKey(item)
  return item[props.itemKey as keyof T] as unknown as U
}

const comboItems = computed(() => {
  if (!props.items) return new Map<string, T>()
  return props.items.reduce((acc, i) => {
    const value = JSON.stringify(getKey(i))
    if (value) acc.set(value, i)
    return acc
  }, new Map<string, T>())
})

const select = (value: AcceptableValue) => {
  if (typeof value !== 'string') {
    modelValue.value = undefined
    return
  }
  const newItem = comboItems.value.get(value)
  modelValue.value = newItem ? getKey(newItem) : undefined
}

const selectedItem = computed(() => {
  if (!modelValue.value) return undefined
  return comboItems.value.get(JSON.stringify(modelValue.value))
})

const itemLabel = computed(() => {
  if (!selectedItem.value) return undefined
  return getLabel(selectedItem.value)
})
</script>
