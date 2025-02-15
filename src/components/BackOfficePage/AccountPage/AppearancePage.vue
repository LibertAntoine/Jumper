<template>
  <backOfficePageLayout>
    <div class="mb-4 flex w-full flex-col gap-1 border-b px-1 pb-4">
      <div class="flex items-center space-x-2">
        <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200">
          Appearance preferences
        </h2>
        <!-- <Badge variant="outline" class="h-6">SSO</Badge> -->
      </div>
      <p class="text-sm text-slate-400 dark:text-slate-500">
        Edit the appearance of the app
      </p>
    </div>
    <div class="h-full w-full overflow-auto pl-1">
      <Label class="pl-1">Color mode</Label>
      <div class="w-[110px]">
        <Select v-model:model-value="colorMode">
          <SelectTrigger class="h-[35px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              :value="item.value"
              v-for="item of items"
              :key="item.value"
            >
              <p class="flex items-center gap-2">
                <component :is="item.icon" class="h-4 w-4" /> {{ item.text }}
              </p>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </backOfficePageLayout>
</template>

<script setup lang="ts">
import backOfficePageLayout from '../@common/BackOfficePageLayout.vue'
import { useColorMode } from '@vueuse/core'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@@materials/ui/select'
import { Label } from '@@materials/ui/label'
import Moon from '@/components/TitleBar/Moon.vue'
import { Sun, SunMoon } from 'lucide-vue-next'

const { store: colorMode } = useColorMode({ disableTransition: false })

const items = [
  { text: 'Light', value: 'light', icon: Sun },
  { text: 'Dark', value: 'dark', icon: Moon },
  { text: 'Auto', value: 'auto', icon: SunMoon }
]
</script>
