import type { ShortUser, User, DetailedRole, DetailedGroup } from './user'

export const ACTION_TYPES = ['Python', 'Link', 'Windows CMD'] as const

export type Action = {
  id: number
  name: string
  description: string
  isActive: boolean
  isPublic: boolean
  creationDate: string
  lastUpdate: string
  thumbnailUrl: string
  data: {
    type: ActionData['type']
  }
}

export type PlayableAction = Action & {
  data: ActionData
}

export type DetailedAction = Action & {
  data: ActionData
  createBy: User
  users: User[]
  user_ids?: User['id'][]
  groups: DetailedGroup[]
  group_ids?: DetailedGroup['id'][]
  roles: DetailedRole[]
  role_ids?: DetailedRole['id'][]
}

export type ActionPermissions = {
  users: User[]
  groups: DetailedGroup[]
  roles: DetailedRole[]
}

export type ActionData =
  | PythonActionData
  | LinkActionData
  | WindowsCMDActionData

export type ActionDataVersion = ActionData & {
  history: {
    id: number
    date: string
    number: number
    user: ShortUser
  }
}

export type LinkActionData = {
  type: 'Link'
  url: string
}

export type PythonActionData = {
  type: 'Python'
  code: string
  useCombobox: boolean
  comboboxCode: string
}

export type WindowsCMDActionData = {
  type: 'Windows CMD'
  code: string
  useCombobox: boolean
  comboboxCode: string
}
