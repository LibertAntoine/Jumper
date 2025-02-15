import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

export const passwordSchema = z.string().min(5).max(50)

export const usePasswordUserForm: () => ReturnType<typeof useForm> = () => {
  const schema = toTypedSchema(
    z
      .object({
        password: passwordSchema,
        passwordConfirmation: passwordSchema
      })
      .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords don't match",
        path: ['passwordConfirmation']
      })
  )
  return useForm({
    validationSchema: schema
  })
}
