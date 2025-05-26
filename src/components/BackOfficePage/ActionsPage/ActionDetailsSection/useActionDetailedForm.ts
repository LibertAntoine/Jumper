import { type DetailedAction } from '@@types'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { computed, MaybeRefOrGetter, toRef, watch } from 'vue'
import type { User, DetailedGroup, DetailedRole } from '@@types/user'

export type ActionDetailedForm = ReturnType<typeof useActionDetailedForm>

export const useActionDetailedForm = (
  action: MaybeRefOrGetter<DetailedAction | null> = null
) => {
  const actionRef = toRef(action)

  const linkDataSchema = z.object({
    type: z.literal('Link'),
    url: z.string().url()
  })

  const pythonDataSchema = z.object({
    type: z.literal('Python'),
    code: z.string().min(0).max(20000),
    useCombobox: z.boolean(),
    comboboxCode: z.string().min(0).max(20000).optional()
  })

  const windowsCMDDataSchema = z.object({
    type: z.literal('Windows CMD'),
    code: z.string().min(0).max(20000),
    useCombobox: z.boolean(),
    comboboxCode: z.string().min(0).max(20000).optional()
  })

  const dataSchema = {
    Link: linkDataSchema,
    Python: pythonDataSchema,
    'Windows CMD': windowsCMDDataSchema
  }

  const actionSchema = computed(() =>
    toTypedSchema(
      z.object({
        name: z.string().min(2).max(25),
        description: z.string().max(500).optional(),
        isPublic: z.boolean().default(false),
        permissions: z
          .array(z.custom<User | DetailedGroup | DetailedRole>())
          .default([]),
        data: actionRef.value
          ? dataSchema[actionRef.value.data.type]
          : linkDataSchema
      })
    )
  )

  const getInitialValues = (newValue: DetailedAction | null) => {
    if (newValue) {
      return {
        name: newValue.name,
        description: newValue.description,
        isPublic: newValue.isPublic,
        data: newValue.data,
        permissions: [...newValue.users, ...newValue.groups, ...newValue.roles]
      }
    }
  }

  const form = useForm({
    validationSchema: actionSchema,
    initialValues: getInitialValues(actionRef.value)
  })

  watch(actionRef, (newValue) => {
    if (!newValue) return
    form.resetForm()
    form.setValues(getInitialValues(newValue) ?? {})
  })

  return form
}
