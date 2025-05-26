<template>
  <Popover v-model:open="open" by="label">
    <PopoverTrigger as-child  >
      <Button
        ref="triggerRef"
        variant="outline"
        role="combobox"
        :class="cn('justify-between gap-0 pl-3 pr-2', props.class)"
      >
        <div class="flex flex-grow items-center gap-2 truncate text-start">
          <slot name="selection" :item="selectedItem" :label="itemLabel">
            <p class="mr-2">{{ itemLabel ?? placeholder }}</p>
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
        <ChevronDown class="h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0 min-w-[50px]":style="{ width: `${width + 22}px` }">
      <Command v-model:searchTerm="searchTerm" :class="cn(popEverClass)">
        <CommandInput v-if="search" placeholder="Search..." class="h-9" />
        <CommandEmpty class="flex flex-col items-center gap-2">
          <p>No item found.</p>
        </CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="[key, item] in comboItems.entries()"
              :key="key"
              :value="key"
              :class="cn(listItemClass)"
              @select="select(key)"
            >
              <div
                class="mr-auto flex flex-grow items-center gap-2 truncate text-start"
              >
                <slot name="list-item" :item="item" :label="getLabel(item)">
                  {{ getLabel(item) }}
                </slot>
              </div>
              <div class="w-[23px] flex-shrink-0" v-if="!props.disableCheck">
                <Check v-if="selectedKey == key" class="ml-auto h-4 w-4" />
              </div>
            </CommandItem>
            <slot name="end-list" :searchTerm="searchTerm" />
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts" generic="T, U">
import { ref, computed, type HTMLAttributes } from 'vue'
import { cn } from '@/services/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@@materials/ui/command'
import { Button } from '@@materials/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@@materials/ui/popover'
import { Check, ChevronDown, X } from 'lucide-vue-next'
import type { AcceptableValue } from 'reka-ui'
import { useElementSize } from '@vueuse/core'

const modelValue = defineModel<U | null>('modelValue')

const props = withDefaults(
  defineProps<{
    items?: T[]
    itemKey?: keyof T | ((item: T) => U)
    label?: keyof T | ((item: T) => AcceptableValue)
    placeholder?: string
    class?: HTMLAttributes['class']
    listItemClass?: HTMLAttributes['class']
    popEverClass?: HTMLAttributes['class']
    selectLabel?: string
    disableCheck?: boolean
    search?: boolean
    clear?: boolean
  }>(),
  {
    itemKey: (item: T) => item as unknown as U,
    label: (item: T) => (typeof item === 'string' ? item : JSON.stringify(item))
  }
)

const triggerRef = ref<HTMLElement | null>(null)
const searchTerm = ref('')
const open = ref(false)

const { width } = useElementSize(triggerRef)

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
  open.value = false
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

const selectedKey = computed(() => {
  if (!selectedItem.value) return undefined
  return JSON.stringify(getKey(selectedItem.value))
})

const itemLabel = computed(() => {
  if (!selectedItem.value) return undefined
  return getLabel(selectedItem.value)
})
</script>
