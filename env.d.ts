/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_PUBLIC_BASE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}