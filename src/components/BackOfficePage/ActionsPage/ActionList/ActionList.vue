<template>
  <div
    class="flex h-full w-[210px] flex-shrink-0 scroll-py-36 flex-col items-center border-r
      bg-slate-100 pb-3 pt-2 dark:border-slate-700 dark:bg-slate-800 dark:bg-opacity-60"
  >
    <div class="w-full px-2">
      <Input v-model="search" class="h-[25px]" placeholder="Search" />
    </div>
    <div
      class="my-2 flex w-full flex-grow flex-col gap-2 overflow-auto px-2 py-2"
      v-if="actionsQuery.isFetched"
    >
      <ActionListCard
        class="flex-shrink-0"
        v-for="action in actions"
        :key="action.id"
        :action="action"
        :isSelected="action.id === selectedAction?.id"
        @click="selectedAction = action"
      />
    </div>
    <div class="flex-grow" v-else>
      <div class="flex h-full flex-col items-center pt-[25px]">
        <Loader2 class="size-7 animate-spin text-primary" />
      </div>
    </div>
    <div class="w-full px-2">
      <AddActionButton class="w-full" :actionsComposable="actionsComposable" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActionsComposable } from '../useActions'
import Input from '@@materials/ui/input/Input.vue'
import { Loader2 } from 'lucide-vue-next'
import ActionListCard from './ActionListCard.vue'
import AddActionButton from './modals/AddActionButton.vue'

const props = defineProps<{
  actionsComposable: ActionsComposable
}>()

const { actionsQuery, actions, search, selectedAction } =
  props.actionsComposable
</script>
