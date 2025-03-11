// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  server: {
    port: 5323
  },
  site: 'https://omnyist.com',
  vite: {
    plugins: [tailwindcss()]
  },
  output: 'server',
  adapter: node({
    mode: 'standalone'
  })
})
