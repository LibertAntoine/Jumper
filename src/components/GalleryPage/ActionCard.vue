<template>
  <button
    class="custom-shadow flex flex-col items-center justify-center gap-2 rounded-md
      bg-slate-100 p-2 pb-1 transition-all hover:shadow-md dark:bg-slate-800"
    @click="execAction(null)"
  >
    <div
      class="flex h-[78px] w-[78px] flex-shrink-0 items-center justify-center rounded-md
        p-[2px]"
    >
      <img
        v-if="action.thumbnailUrl"
        class="h-full w-full rounded-md object-contain"
        :src="action.thumbnailUrl"
        :alt="action.name"
      />
      <div v-else class="flex h-full w-full items-center justify-center">
        <Carrot :size="60" class="ml-2 text-slate-300" />
      </div>
    </div>
    <div class="flex flex-grow flex-col gap-0.5">
      <h2
        class="text-md w-full overflow-hidden break-all text-center font-semibold
          text-slate-700 dark:text-slate-200"
        :class="{
          'line-clamp-2': !hasOptions,
          'line-clamp-1': hasOptions
        }"
      >
        {{ action.name }}
      </h2>
      <div class="flex w-full items-center justify-center" @click.stop>
        <Combobox
          v-if="hasOptions"
          class="text-md ml-0!important h-[18px] w-[115px] gap-0 truncate border-none
            bg-slate-100 px-0.5 text-xs italic text-slate-400 hover:bg-slate-50
            hover:text-slate-700 dark:bg-slate-700 dark:text-slate-400"
          :items="optionsExec?.options.value ?? []"
          list-item-class="cursor-pointer p-1 data-[highlighted]:bg-slate-200 dark:data-[highlighted]:bg-slate-800"
          pop-ever-class="bg-slate-100 dark:bg-slate-700"
          disableCheck
          @click.stop
        >
          <template #selection>
            <p
              class="ml-[16px] flex w-[100px] justify-center truncate"
              v-if="optionsExec?.options.value?.length"
            >
              {{ optionsExec?.options.value[0] }}
            </p>
            <p
              class="ml-[16px] flex w-[100px] justify-center truncate"
              v-else-if="optionsExec?.isRunning"
            >
              <Loader2 class="animate-spin text-slate-500" />
            </p>
            <p class="ml-[16px] flex w-[100px] justify-center truncate" v-else>
              <X class="text-slate-500" />
            </p>
          </template>
          <template #list-item="{ label }"
            ><p
              class="flex w-full justify-center truncate text-xs font-semibold italic text-slate-500
                dark:text-slate-400"
              @click="() => execAction(label as string)"
            >
              {{ label }}
            </p>
          </template>
        </Combobox>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { PlayableAction } from '@@types'
import { Carrot, Loader2, X } from 'lucide-vue-next'
import { Combobox } from '@@materials/input'
import { useActionExec } from './useActionExec'
import { useToast } from '@@materials/ui/toast'

const props = defineProps<{
  action: PlayableAction
}>()

const { toast } = useToast()

const { hasOptions, getOptions, exec } = useActionExec(() => props.action)
const optionsExec = getOptions()

if (optionsExec) {
  optionsExec.exec()
}

const execAction = async (option: string | null) => {
  if (optionsExec?.isRunning.value) return
  const opt = option || optionsExec?.options.value?.[0] || null
  await exec(opt)
  let title = `Run ${props.action.name}`
  if (opt) {
    title += ` - ${opt}`
  }
  toast({
    title,
    duration: 2000
  })
}
</script>
