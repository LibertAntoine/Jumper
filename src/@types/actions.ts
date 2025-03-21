import type { User, Group } from './user'

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

export type DetailedAction = {
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