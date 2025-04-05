<template>
  <div
    class="flex h-full w-[210px] scroll-py-36 flex-col items-center border-r bg-slate-100
      p-2 pb-3 pt-2 dark:border-slate-700 dark:bg-slate-900 flex-shrink-0"
  >
    <Input v-model="search" class="h-[25px]" placeholder="Search" />

    <div
      class="my-2 flex w-full flex-grow flex-col gap-2 overflow-auto py-2"
      v-if="actionsQuery.isFetched"
    >
      <ActionCard
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
    <AddActionButton class="w-full" @actionAdded="actionsQuery.refetch" />
  </div>
</template>

<script setup lang="ts">
import type { ActionsComposable } from './useActions'
import Input from '@@materials/ui/input/Input.vue'
import { Loader2 } from 'lucide-vue-next'
import ActionCard from './ActionCard.vue'
import AddActionButton from './modals/AddActionButton.vue'


const props = defineProps<{
  actionsComposable: ActionsComposable
}>()

const { actionsQuery, actions, search, selectedAction } = props.actionsComposable
</script>
