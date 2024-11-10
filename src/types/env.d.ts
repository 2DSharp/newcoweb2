/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly BASE_API_BASEURL: string
    readonly VITE_API_TIMEOUT: string
    readonly VITE_ENABLE_ANALYTICS: string
    readonly VITE_AUTH_DOMAIN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}