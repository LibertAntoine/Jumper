import type { User, Group } from './user'

export const ACTION_TYPES = ['Python', 'Link'] as const

export type Action = {
    id: number
    name: string
    description: string
    creationDate: string
    lastUpdate: string
    data: {
        type: ActionData["type"]
    }
}

export type PlayableAction = Action & {
    data: ActionData
}

export type DetailedAction = Action & {
    data: ActionData
    createBy: User
    users: User[]
    groups: Group[]
}

export type ActionData = PythonActionData | LinkActionData

export type PythonActionData = {
    type: 'Python'
    code: string
}

export type LinkActionData = {
    type: 'Link'
    url: string
}