// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  server: {
    port: 5322
  },
  site: 'https://bryanvelo.so',
  vite: {
    plugins: [tailwindcss()]
  },
  experimental: {
    svg: true
  },
  integrations: [mdx(), react(), sitemap()]
})
