// @ts-check
import { defineConfig, fontProviders, svgoOptimizer } from 'astro/config'
import { satteri } from '@astrojs/markdown-satteri'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  server: {
    port: 5321
  },
  site: 'https://avalonstar.com',
  integrations: [mdx(), react(), sitemap()],
  markdown: {
    processor: satteri({
      features: { directive: true }
    })
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname
      }
    }
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Andada Pro',
      cssVariable: '--font-andada-pro',
      weights: [400, 500, 600, 700, 800, 900],
      styles: ['normal', 'italic']
    }
  ],
  experimental: {
    svgOptimizer: svgoOptimizer()
  }
})
