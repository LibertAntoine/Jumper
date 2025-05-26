import type { Action } from '@@types'

export type ShortUser = {
  readonly id: number
  username: string
  firstName?: string
  lastName?: string
  email: string
  readonly profilePictureUrl?: string
}

export type User = ShortUser &{
  externalId: string | null
  groups: string[]
  isSuperuserGroupMember: boolean
  readonly creationDate: string
  readonly lastUpdate: string
  isActive: boolean
  password?: string
  isSuperuser: boolean
}

export type DetailedUser = Omit<User, 'groups'> & {
  groups: Group[]
}

export type Group = {
  readonly id: number
  name: string
  userSet: User['id'][]
  isAdminGroup: boolean
}

export type DetailedGroup = Omit<Group, 'userSet'> & {
  userSet: User[]
}

export type Role = {
  readonly id: number
  name: string
  description: string
  users: User['id'][]
  groups: Group['id'][]
  actions: Action['id'][]
  creationDate: string
  lastUpdate: string
  createdBy: User['id']
}

export type DetailedRole = Omit<Role, 'users' | 'groups'> & {
  users: User[]
  groups: Group[]
  actions: Action[]
}


