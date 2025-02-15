/// <reference types="vite/client" />

declare module "monaco-editor-vue3";
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
