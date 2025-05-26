import * as monaco from 'monaco-editor'
import { TabFocus } from 'monaco-editor/esm/vs/editor/browser/config/tabFocus.js'
import { useDark } from '@vueuse/core'

import {
  type MaybeRefOrGetter,
  type MaybeRef,
  type Ref,
  toRef,
  watch,
  onMounted
} from 'vue'

const DEFAULT_EDITOR_LANGUAGE = 'python'

export const useMonacoEditor = (
  editorRef: Ref<HTMLElement | null | undefined>,
  mode: MaybeRefOrGetter<'code' | 'diff'>,
  code: MaybeRef<string>,
  originalCode: MaybeRefOrGetter<string | undefined>,
  language: MaybeRefOrGetter<string | undefined>
) => {
  TabFocus.setTabFocusMode(true)

  const isDark = useDark()
  const codeRef = toRef(code)
  const originalCodeRef = toRef(originalCode)
  const languageRef = toRef(language)
  const modeRef = toRef(mode)

  let editor:
    | monaco.editor.IStandaloneCodeEditor
    | monaco.editor.IStandaloneDiffEditor
    | null = null
  let model: monaco.editor.ITextModel | null = null
  let originalModel: monaco.editor.ITextModel | null = null
  let modifiedModel: monaco.editor.ITextModel | null = null

  onMounted(async () => {
    const slushAndPoppiesTheme = await import('monaco-themes/themes/Slush and Poppies.json')
    const nightOwlTheme = await import('monaco-themes/themes/Night Owl.json')
    monaco.editor.defineTheme('SlushAndPoppies', slushAndPoppiesTheme.default as any);
    monaco.editor.defineTheme('NightOwl', nightOwlTheme.default as any);
    monaco.editor.setTheme(isDark.value ? 'NightOwl' : 'SlushAndPoppies')
    setupEditor()
  })
  watch(modeRef, () => setupEditor())
  watch(isDark, () => {
    monaco.editor.setTheme(isDark.value ? 'NightOwl' : 'SlushAndPoppies')
  })

  const setupEditor = async () => {
    const oldModel = model
    const oldOriginal = originalModel
    const oldModified = modifiedModel
    const oldEditor = editor


    if (modeRef.value === 'code') {
      editor = setupStandaloneEditor()
    } else if (modeRef.value === 'diff') {
      editor = setupDiffEditor()
    }

    oldEditor?.dispose()
    oldModel?.dispose()
    oldOriginal?.dispose()
    oldModified?.dispose()
  }

  const setupStandaloneEditor = () => {
    if (!editorRef.value) return null
    model = monaco.editor.createModel(
      codeRef.value,
      languageRef.value ?? DEFAULT_EDITOR_LANGUAGE
    )
    const standaloneEditor = monaco.editor.create(editorRef.value, {
      model,
      automaticLayout: true
    })
    standaloneEditor.onDidChangeModelContent(() => {
      const editorValue = standaloneEditor.getValue()
      if (codeRef.value === editorValue) return
      codeRef.value = editorValue
    })
    watch(codeRef, (newValue) => {
      if (standaloneEditor && newValue === standaloneEditor.getValue()) return
      standaloneEditor.setValue(newValue)
    })
    // To manage unfocus bug after editor switching
    standaloneEditor?.onKeyDown((e) => {
      if (e.keyCode === monaco.KeyCode.Tab) {
        e.preventDefault()
        standaloneEditor.trigger('keyboard', 'tab', {})
      }
    })
    return standaloneEditor
  }

  const setupDiffEditor = () => {
    if (!editorRef.value) return null
    originalModel = monaco.editor.createModel(
      originalCodeRef.value ?? codeRef.value,
      languageRef.value ?? DEFAULT_EDITOR_LANGUAGE
    )
    modifiedModel = monaco.editor.createModel(
      codeRef.value,
      languageRef.value ?? DEFAULT_EDITOR_LANGUAGE
    )
    const diffEditor = monaco.editor.createDiffEditor(editorRef.value, {
      automaticLayout: true
    })
    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel
    })
    diffEditor.onDidUpdateDiff(() => {
      const editorValue = diffEditor.getModifiedEditor().getValue()
      if (codeRef.value === editorValue) return
      codeRef.value = editorValue
    })
    watch(codeRef, (newValue) => {
      if (
        diffEditor &&
        newValue !== diffEditor.getModifiedEditor().getValue()
      ) {
        diffEditor.getModifiedEditor().setValue(newValue)
      }
    })
    const originalEditor = diffEditor.getOriginalEditor()
    const modifiedEditor = diffEditor.getModifiedEditor()
    originalEditor?.onKeyDown((e) => {
      if (e.keyCode === monaco.KeyCode.Tab) {
        e.preventDefault()
        diffEditor.trigger('keyboard', 'tab', {})
      }
    })
    modifiedEditor?.onKeyDown((e) => {
      if (e.keyCode === monaco.KeyCode.Tab) {
        e.preventDefault()
        diffEditor.trigger('keyboard', 'tab', {})
      }
    })
    return diffEditor
  }
}
