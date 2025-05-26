<template>
  <div class="flex flex-col gap-2 px-2">
    <Label>Code</Label>
    <CodeEditor
      v-model="code"
      mode="cmd"
      language="cmd"
      :isDiff="differentDataFields.includes('code')"
      :compareCode="(actionDetailed?.data as WindowsCMDActionData).code"
      :namespace="actionDetailed?.name + ' - Test'"
      :options="useCombobox ? options : null"
    />
<div class="mt-2 w-full border-t border-slate-200" />
    <h2 class="mb-2 font-semibold">Advanced</h2>
    <CheckboxField
      fieldName="data.useCombobox"
      label="Use combobox"
      :showErrorMessage="false"
    />
    <div v-if="useCombobox">
      <Label>Combobox Code</Label>
      <CodeEditor
        class="h-[350px]"
        v-model="comboboxCode"
        mode="get-options"
        language="python"
        :namespace="actionDetailed?.name + ' - Combobox'"
        @update:resultOptions="
          (newOptions) => {
            options = useCombobox ? newOptions : null
          }
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import type { WindowsCMDActionData } from '@@types'
import type { ActionsComposable } from '../../useActions'
import { useField } from 'vee-validate'
import CodeEditor from './CodeEditor/CodeEditor.vue'
import { CheckboxField } from '@@materials/input'
import { Label } from '@@materials/ui/label'


const props = defineProps<{
  actionComposable: ActionsComposable
  differentDataFields: string[]
}>()

const options = defineModel<string[] | null>('options', {
  default: null
})

const { value: code } = useField<string>('data.code')
const { value: comboboxCode } = useField<string>('data.comboboxCode')
const { value: useCombobox } = useField<string>('data.useCombobox')

watch(useCombobox, () => {
  if (!useCombobox.value) {
    options.value = null
  }
})

const { actionDetailed } = props.actionComposable
</script>
