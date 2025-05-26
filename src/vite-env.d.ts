/// <reference types="vite/client" />

declare module "monaco-editor-vue3";
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'monaco-editor/esm/vs/editor/browser/config/tabFocus.js' {
  export const TabFocus: {
    getTabFocusMode(): boolean;
    setTabFocusMode(focus: boolean): void;
    onDidChangeTabFocus: import('monaco-editor').IEvent<boolean>;
  };
}