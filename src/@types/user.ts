export type User = {
  readonly id: number
  username: string
  firstName?: string
  lastName?: string
  externalId: string | null
  groups: string[]
  isSuperuserGroupMember: boolean
  email: string
  readonly creationDate: string
  readonly lastUpdate: string
  isActive: boolean
  password?: string
  readonly profilePictureUrl?: string
  isSuperuser: boolean
}

export type DetailedUser = Omit<User, 'groups'> & {
  groups: Group[]
}

export type Group = {
  readonly id: number
  name: string
  userSet: User['id'][]
}
