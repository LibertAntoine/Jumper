<template>
  <div class="h-full overflow-auto">
    <div class="flex flex-wrap justify-center gap-4 p-4" v-if="isFetched">
      <ActionCard
        class="h-[150px] w-[130px]"
        v-for="action in actions"
        :key="action.id"
        :action="action"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayableAction } from '@@types'
import jumper from '@/services/jumper'
import { useQuery } from '@/composables'
import ActionCard from './ActionCard.vue'

const { data: actions, isFetched } = useQuery<PlayableAction[]>(
  ['playable-actions'], jumper.actions.getMyActions
)
</script>
