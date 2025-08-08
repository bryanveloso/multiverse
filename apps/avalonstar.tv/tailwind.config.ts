import type { Config } from 'tailwindcss'
import sharedConfig from '@multiverse/config/tailwind'

const config: Config = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  presets: [sharedConfig]
}

export default config