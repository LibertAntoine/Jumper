<template>
  <Dialog v-model:open="open" :modal="false">
    <DialogTrigger v-if="$slots.trigger">
      <slot name="trigger" />
    </DialogTrigger>
    <DialogContent
      to="#main"
      class="mt-[15px] flex max-h-[80%] w-11/12 max-w-[600px] flex-col gap-3
        dark:bg-slate-900"
      :disable-outside-pointer-events="false"
      :trap-focus="false"
      @interact-outside.prevent
    >
      <DialogHeader>
        <slot name="header">
          <DialogTitle class="text-2xl font-semibold dark:text-slate-200">{{
            title
          }}</DialogTitle>
          <DialogDescription v-if="description" class="text-slate-500">
            {{ description }}
          </DialogDescription>
        </slot>
      </DialogHeader>
      <slot />
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="secondary"> Cancel </Button>
        </DialogClose>
        <Button
          class="flex items-center gap-1"
          :variant="confirmButtonVariant ?? 'default'"
          @click="onConfirm"
        >
          <slot name="confirm-button">
            <Check class="h-6 w-6" />
            <p>{{ confirmButtonName || 'Confirm' }}</p>
          </slot>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { Button, ButtonVariants } from '@@materials/ui/button'
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogContent
} from '@@materials/ui/dialog'

const open = defineModel<boolean>('open')

const props = defineProps<{
  title: string
  description?: string
  onConfirm: () => Promise<boolean | undefined>
  confirmButtonName?: string
  confirmButtonVariant?: ButtonVariants['variant']
}>()

const onConfirm = async () => {
  const result = await props.onConfirm()
  if (result) open.value = false
}
</script>
