// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://astro.build/config
export default defineConfig({
  server: {
    port: 5321
  },
  site: 'https://avalonstar.com',
  integrations: [mdx(), react(), sitemap()],
  vite: {
    plugins: [tailwindcss(), tsconfigPaths()]
  }
})
