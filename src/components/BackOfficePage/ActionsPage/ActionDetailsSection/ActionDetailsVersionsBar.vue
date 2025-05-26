<template>
  <div
    class="ml-4 h-full w-[230px] border-l border-r bg-white dark:bg-slate-900 transition-transform"
  >
    <div
      class="h-[30px] flex items-center bg-slate-50 dark:bg-slate-800 dark:text-slate-300 p-1 px-2 font-semibold italic text-slate-500
        shadow-sm"
    >
      Versions
    </div>
    <div
      v-if="versionsQuery.isFetched"
      class="flex h-[calc(100%-30px)] w-full flex-col items-center overflow-auto"
    >
      <button
        v-for="(version, i) in versions"
        class="h-[50px] w-full flex-shrink-0 border-b p-1 px-2 text-left transition-colors"
        :class="{
          'bg-primary text-white':
            selectedVersion?.history.id === version.history.id,
          'text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800':
            selectedVersion?.history.id !== version.history.id
        }"
        @click.prevent="selectVersion(version)"
      >
        <p class="text-sm font-semibold italic">
          {{ i !== 0 ? `v${version.history.number}` : '@current' }} -
          {{
            new Date(version.history.date)
              .toISOString()
              .slice(0, 16)
              .replace('T', ' ')
          }}
        </p>
        <p class="text-xs">by {{ version.history.user.username }}</p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VersionsComposable } from './useVersions'

const props = defineProps<{
  versionsComposable: VersionsComposable
}>()

const { selectVersion, selectedVersion, versions, versionsQuery } =
  props.versionsComposable
</script>
