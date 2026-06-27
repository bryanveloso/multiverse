// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import { satteri } from '@astrojs/markdown-satteri'
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
  image: {
    remotePatterns: [{ hostname: 'cdn.velo.so' }],
  },
  integrations: [mdx(), react(), sitemap()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'DM Sans',
      cssVariable: '--font-dm-sans',
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic']
    },
    {
      provider: fontProviders.google(),
      name: 'DM Mono',
      cssVariable: '--font-dm-mono',
      weights: [400, 500],
      styles: ['normal']
    },
    {
      provider: fontProviders.google(),
      name: 'DM Serif Display',
      cssVariable: '--font-dm-serif-display',
      weights: [400],
      styles: ['normal', 'italic']
    }
  ]
})
