<template>
  <Dialog v-model:open="open" class="pt-[32px]" :modal="false">
    <DialogTrigger v-if="$slots.trigger">
      <slot name="trigger" />
    </DialogTrigger>
    <DialogContent
      to="#main"
      :disable-outside-pointer-events="false"
      :trap-focus="false"
      @interact-outside.prevent
    >
      <DialogHeader>
        <slot name="header">
          <DialogTitle
            ><h2 class="text-2xl font-semibold">{{ title }}</h2></DialogTitle
          >
          <DialogDescription v-if="description">
            <p class="text-slate">{{ description }}</p>
          </DialogDescription>
        </slot>
      </DialogHeader>
      <form id="dialogForm" class="overflow-y-auto" @submit="onSubmit">
        <slot />
      </form>
      <DialogFooter class="">
        <DialogClose as-child>
          <Button
            variant="secondary"
            size="lg"
            class="flex items-center gap-3 self-end"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          size="lg"
          class="flex min-w-[70px] items-center gap-3 self-end"
          type="submit"
          form="dialogForm"
          :disabled="form.isSubmitting"
        >
          <Loader2 v-if="form.isSubmitting" :size="20" class="animate-spin" />
          <p v-else>{{ submitButtonName || 'Save' }}</p>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { Loader2 } from 'lucide-vue-next'
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

const open = ref(false)

const props = defineProps<{
  title: string
  form: ReturnType<typeof useForm>
  onSubmit: () => Promise<boolean>
  description?: string
  submitButtonName?: string
}>()

const onSubmit = async () => {
  open.value = await props.onSubmit()
}
</script>
