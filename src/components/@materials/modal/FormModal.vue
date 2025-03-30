<template>
  <Dialog v-model:open="open" :modal="false">
    <DialogTrigger v-if="$slots.trigger" :class="props.class">
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
      <form
        id="dialogForm"
        class="overflow-y-auto px-1 pr-2"
        @submit.prevent="onSubmit"
      >
        <slot />
      </form>
      <DialogFooter>
        <DialogClose as-child>
          <Button variant="secondary"> Cancel </Button>
        </DialogClose>
        <Button
          class="flex min-w-[70px] items-center gap-1"
          type="submit"
          form="dialogForm"
          :disabled="
            form.isSubmitting.value ||
            !form.meta.value.valid ||
            !form.meta.value.dirty
          "
        >
          <Save class="h-6 w-6" />
          <Loader2
            v-if="form.isSubmitting.value"
            :size="20"
            class="animate-spin"
          />
          <p v-else>{{ submitButtonName || 'Save' }}</p>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { HTMLAttributes } from 'vue'
import { useForm } from 'vee-validate'
import { Loader2, Save } from 'lucide-vue-next'
import { Button } from '@@materials/ui/button'
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
  form: ReturnType<typeof useForm>
  onSubmit: () => Promise<Promise<boolean> | undefined>
  description?: string
  submitButtonName?: string
  class?: HTMLAttributes['class']
}>()

const onSubmit = async () => {
  if (!props.onSubmit) return
  const result = await props.onSubmit()
  if (result) open.value = false
}
</script>
