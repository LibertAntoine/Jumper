<template>
  <div class="h-full overflow-auto">
    <div class="flex flex-wrap justify-center gap-4 p-4" v-if="isFetched">
      <ActionCard
        class="h-[145px] w-[130px]"
        v-for="action in actions"
        :key="action.id"
        :action="action"
      />
    </div>
    <div v-else class="flex h-full items-center justify-center">
      <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayableAction } from '@@types'
import jumper from '@/services/jumper'
import { useQuery } from '@/composables'
import { Loader2 } from 'lucide-vue-next'
import ActionCard from './ActionCard.vue'

const { data: actions, isFetched } = useQuery<PlayableAction[]>(
  ['playable-actions'],
  jumper.actions.getMyActions
)
</script>
