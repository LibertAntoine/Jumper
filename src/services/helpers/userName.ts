import { User, DetailedUser } from '@@types'

export const getUserDisplayName = (user: User | DetailedUser ): string => {
  let displayName = ''
  if (user.firstName) {
    displayName = `${user.firstName}`
    if (user.lastName) {
      displayName += ` ${user.lastName}`
    }
  } else {
    displayName = user.username
  }
  return displayName
}
