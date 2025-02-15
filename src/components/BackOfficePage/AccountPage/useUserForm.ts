import type { User, DetailedUser } from '@@types'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { checkUniqueEmail, checkUniqueUsername } from '@/services/form-checks/userFormChecks'

export const useAuthUserForm = (
  user?: User | DetailedUser
): ReturnType<typeof useForm> => {
  const userSchema = toTypedSchema(
    z.object({
      username: z
        .string()
        .min(2)
        .max(40)
        .refine(async (username) => await checkUniqueUsername(user, username), {
          message: 'This username is already taken'
        }),
      email: z
        .string()
        .email()
        .refine(async (email) => await checkUniqueEmail(user, email), {
          message: 'This email is already taken'
        }),
      firstName: z.string().min(2).max(20).optional().or(z.literal('')),
      lastName: z.string().min(2).max(20).optional().or(z.literal(''))
    })
  )
  return useForm({
    validationSchema: userSchema,
    initialValues: user
  })
}
