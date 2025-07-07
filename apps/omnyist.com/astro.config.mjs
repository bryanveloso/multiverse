// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  server: {
    port: 5323
  },
  site: 'https://omnyist.com',
  vite: {
    plugins: [tailwindcss()]
  },
  output: 'static'
})
