import { ACTION_TYPES } from '@@types'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const useActionForm = () => {
  const actionSchema = toTypedSchema(
    z.object({
      // TODO: add a check to see if the name is unique
      name: z.string().min(2).max(25),
      description: z.string().max(500).optional(),
      data: z.object({
        type: z.enum(ACTION_TYPES).default(ACTION_TYPES[0])
      })
    })
  )
  return useForm({
    validationSchema: actionSchema
  })
}
