<template>
  <div class="flex h-full w-full">
    <ActionList :actionsComposable="actionsComposable" />
    <BackOfficePageLayout>
      <ActionDetailsSection :actionsComposable="actionsComposable" />
    </BackOfficePageLayout>
  </div>
</template>

<script setup lang="ts">
import BackOfficePageLayout from '../@common/BackOfficePageLayout.vue'
import ActionList from './ActionList.vue'
import ActionDetailsSection from './ActionDetailsSection.vue'
import { useActions } from './useActions'

const actionsComposable = useActions()
</script>
