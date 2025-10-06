/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FRONTIFY_DOMAIN: string;
    readonly VITE_FRONTIFY_BEARER_TOKEN: string;
    readonly VITE_LIBRARY_ID: string;
    readonly VITE_LATITUDE_KEY: string;
    readonly VITE_LONGITUDE_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}