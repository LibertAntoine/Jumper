<template>
  <div
    class="flex h-full w-[210px] scroll-py-36 flex-col items-center border-r bg-slate-100
      p-2 pb-3 pt-2 dark:border-slate-700 dark:bg-slate-900"
  >
    <Input v-model="search" class="h-[25px]" placeholder="Search" />
    <div
      class="flex w-full flex-grow flex-col gap-2 overflow-auto py-2"
      v-if="isFetched"
    >
      <ActionCard v-for="action in actions" :key="action.id" :action="action" />
    </div>

    <div class="flex-grow" v-else>
      <div class="flex h-full flex-col items-center pt-[25px]">
        <Loader2 class="size-7 animate-spin text-primary" />
      </div>
    </div>
    <Button class="w-full" size="sm">
      <Carrot />
      New Action</Button
    >
  </div>
</template>

<script setup lang="ts">
import type { Action } from '@@types'
import { ref } from 'vue'
import Input from '@@materials/ui/Input/Input.vue'
import jumper from '@/services/jumper'
import { Carrot, Loader2 } from 'lucide-vue-next'
import ActionCard from './ActionCard.vue'
import { useQuery } from '@/composables'
import Button from '@@materials/ui/button/Button.vue'

const search = ref('')


import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  let count2 = 0;

  const increment = () => {
    setCount((oldCount) => {
      const newCount = oldCount + 1;
      console.log(newCount);
      return newCount;
    });
    count2 += 1;
    console.log(count2);
  };

  return (
    <div>
      <p>{count}</p>
      <p>{count2}</p>
      <button onClick={increment}>Add</button>
    </div>
  );
}


const selectedAction = defineModel<Action | null>('selection-action', {
  default: null
})

// TODO: see how to manage infinite scroll
const { data: actions, isFetched } = useQuery<Action[]>(
  ['actions', search],
  async () => {
    const data = await jumper.actions.getActions({
      limit: 50,
      search: search.value
    })
    if (!selectedAction.value && data.results.length)
      selectedAction.value = data.results[0]
    return data.results
  }
)
</script>
