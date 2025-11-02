/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEST: string
  readonly VITE_GH_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Audio file declarations for Vite
declare module '*.mp3' {
  const src: string
  export default src
}

declare module '*.wav' {
  const src: string
  export default src
}

declare module '*.ogg' {
  const src: string
  export default src
}
