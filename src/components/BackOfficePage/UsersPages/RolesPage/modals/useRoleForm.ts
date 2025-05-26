import type { DetailedRole, User, Group, Action } from '@@types'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

// import { checkUniqueName } from '@/services/form-checks/roleFormChecks'

export const useRoleForm = (role?: DetailedRole): ReturnType<typeof useForm> => {
  const roleSchema = toTypedSchema(
    z.object({
      name: z.string().min(2).max(40),
      // .refine(async (username) => await checkUniqueUsername(role, username), {
      //   message: 'This username is already taken'
      // }),
      description: z.string().optional(),
      users: z.array(z.custom<User>()).default([]),
      groups: z.array(z.custom<Group>()).default([]),
      actions: z.array(z.custom<Action>()).default([]),
    })
  )
  return useForm({
    validationSchema: roleSchema,
    initialValues: role
  })
}
