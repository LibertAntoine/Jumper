import type { User, DetailedUser } from '@@types'
import { useMemoize } from '@vueuse/core'

import {
  isUserWithUsernameExist,
  isUserWithEmailExist,
  isLastAdmin
} from '@/services/jumper/users'

export const checkUniqueUsername = useMemoize(
  async (
    user: User | DetailedUser | undefined,
    username: string
  ): Promise<boolean> => {
    if (username === user?.username) return true
    return !(await isUserWithUsernameExist(username))
  }
)

export const checkUniqueEmail = useMemoize(
  async (
    user: User | DetailedUser | undefined,
    email: string
  ): Promise<boolean> => {
    if (email === user?.email) return true
    return !(await isUserWithEmailExist(email))
  }
)

export const checkIsNotLastAdmin = async (
  user: User | DetailedUser | undefined,
  isSuperAdmin: boolean | undefined
): Promise<boolean> => {
  if (!user || isSuperAdmin) {
    return true
  }
  return !(await isLastAdmin(user?.id))
}
