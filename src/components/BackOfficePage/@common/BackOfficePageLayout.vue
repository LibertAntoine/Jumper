<template>
  <div class="h-full w-full bg-slate-50 p-4 dark:bg-slate-800">
    <div
      class="flex h-full w-full flex-col rounded-md border border-slate-200 bg-white p-5
        dark:border-slate-700 dark:bg-slate-900"
    >
      <LoaderContainer :is-loading="isLoading">
        <slot />
      </LoaderContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoaderContainer from '@@materials/loader/LoaderContainer.vue'

defineProps({
  isLoading: Boolean
})
</script>
