<template>
  <div class="flex h-full w-full">
    <ActionList :actionsComposable="actionsComposable" />
    <ActionDetailsSection :actionsComposable="actionsComposable" />
  </div>
</template>

<script setup lang="ts">
import ActionList from './ActionList/ActionList.vue'
import ActionDetailsSection from './ActionDetailsSection/ActionDetailsSection.vue'
import { useActions } from './useActions'

const actionsComposable = useActions()
</script>
