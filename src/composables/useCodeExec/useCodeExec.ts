import type { User } from '@@types'
import { invoke } from '@tauri-apps/api/core'
import { writeTempCodeFile, removeTempCodeFile } from './tempCodeFile'
import { Command, type Child } from '@tauri-apps/plugin-shell'
import {
  type MaybeRefOrGetter,
  ref,
  toRef,
  onUnmounted,
  watch
} from 'vue'
import { useAuthUserStore } from '@/stores'
import { useLogsStore } from '@/stores/logsStore'
import { storeToRefs } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export type ExecMode = 'python' | 'cmd' | 'get-options'
type UserInfo = {
  id: User['id']
  username: User['username']
  firstName: User['firstName']
  lastName: User['lastName']
  email: User['email']
}

export type CodeExec = {
  id: string
  exec: (option: string | null) => Promise<string[] | null> 
  kill: () => Promise<void>
  mode: ExecMode
  namespace: string
  isRunning: boolean
  options: string[] | null
  process: Child | null
  runTimestamp: string | null
}


export const useCodeExec = (
  mode: MaybeRefOrGetter<ExecMode>,
  code: MaybeRefOrGetter<string>,
  namespace: MaybeRefOrGetter<string> = 'code-exec'
) => {
  const { pushLog } = useLogsStore()
  const { user } = storeToRefs(useAuthUserStore())

  const modeRef = toRef(mode)
  const codeRef = toRef(code)
  const namespaceRef = toRef(namespace)
  const isRunning = ref(false)
  const options = ref<string[] | null>(null)
  const process = ref<Child | null>(null)
  const commandId = uuidv4()
  const runTimestamp = ref<string | null>(null)

  const exec = async (option: string | null = null) => {
    if (isRunning.value) await kill()
    const userInfo = getUserInfo()
    const preInstructions = getCodePreInstructions(
      modeRef.value,
      commandId,
      userInfo,
      option
    )
    const filepath = await writeTempCodeFile(
      modeRef.value,
      `${preInstructions}${codeRef.value}`
    )

    const command = getCommand(
      modeRef.value,
      filepath,
      userInfo,
      option,
      commandId
    )
    setupLogging(command, commandId)
    command.on('close', () => {
      isRunning.value = false
      process.value = null
      removeTempCodeFile(filepath)
    })
    if (modeRef.value === 'get-options') {
      command.stdout.on('data', (data) => {
        const message = data.toString()
        if (message.startsWith(`${commandId} - options `)) {
          const optionsString = message.split('- options ')[1]
          options.value = JSON.parse(optionsString)
          pushLog({
            level: 'info',
            execId: commandId,
            namespace: namespaceRef.value,
            message: `--- options received => ${optionsString} ---`
          })
        }
      })
    }

    isRunning.value = true
    process.value = await command.spawn()
    runTimestamp.value = new Date().toISOString()
    pushLog({
      level: 'info',
      execId: commandId,
      namespace: namespaceRef.value,
      message: '--- starting execution ---'
    })
    return options
  }

  const setupLogging = (command: Command<string>, commandId: string) => {
    const execNamespace = namespaceRef.value
    command.stdout.on('data', (data) => {
      const message = data.toString()
      if (message.startsWith(`${commandId} -`)) return
      pushLog({
        level: 'info',
        execId: commandId,
        namespace: execNamespace,
        message: data.toString()
      })
    })
    command.stderr.on('data', (data) => {
      pushLog({
        level: 'error',
        execId: commandId,
        namespace: execNamespace,
        message: data.toString()
      })
    })
    command.on('error', (error) =>
      pushLog({
        level: 'error',
        execId: commandId,
        namespace: execNamespace,
        message: error.toString()
      })
    )
    command.on('close', () => {
      pushLog({
        level: 'info',
        execId: commandId,
        namespace: execNamespace,
        message: '--- execution finished ---'
      })
    })
  }

  const kill = async () => {
    if (!process.value) return
    await invoke('kill_process', {
      pid: process.value.pid
    })
  }

  const getUserInfo = (): UserInfo => {
    if (!user.value) throw new Error('User not found')
    return {
      id: user.value.id,
      username: user.value.username,
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      email: user.value.email
    }
  }

  onUnmounted(() => {
    if (process.value) kill()
  })

  watch(codeRef, () => {
    // TODO: see to use something else to detect that we switch to another action.
    if (isRunning.value) kill()
  })

  return {
    id: commandId,
    exec,
    kill,
    namespace: namespaceRef,
    mode: modeRef,
    isRunning,
    options,
    process,
    runTimestamp,
  }
}

const getCommand = (
  mode: ExecMode,
  filepath: string,
  userInfo: UserInfo,
  option: string | null,
  commandId: string
) => {
  switch (mode) {
    case 'get-options':
      return Command.sidecar('bin/python/python', [
        '-o',
        filepath,
        JSON.stringify({
          id: commandId,
          user: userInfo
        })
      ])
    case 'python':
      return Command.sidecar('bin/python/python', [
        '-r',
        filepath,
        JSON.stringify({
          id: commandId,
          user: userInfo,
          option
        })
      ])
    case 'cmd':
      return Command.create('cmd', ['/C', filepath])
    default:
      throw new Error(`Unknown mode: ${mode}`)
  }
}

const getCodePreInstructions = (
  mode: ExecMode,
  commandId: string,
  userInfo: UserInfo,
  option: string | null
) => {
  switch (mode) {
    case 'get-options':
      return ''
    case 'python':
      return ''
    case 'cmd':
      return `
      @echo off
      set CONTEXT_OPTION=${option}
      set CONTEXT_USER_ID=${userInfo.id}
      set CONTEXT_USER_USERNAME=${userInfo.username}
      set CONTEXT_USER_FIRSTNAME=${userInfo.firstName}
      set CONTEXT_USER_LASTNAME=${userInfo.lastName}
      set CONTEXT_USER_EMAIL=${userInfo.email}
      set CONTEXT_COMMAND_ID=${commandId}
      @echo on
      `
    default:
      throw new Error(`Unknown mode: ${mode}`)
  }
}
