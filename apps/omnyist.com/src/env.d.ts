/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly QUESTLOG_API_URL: string
  readonly PUBLIC_QUESTLOG_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
