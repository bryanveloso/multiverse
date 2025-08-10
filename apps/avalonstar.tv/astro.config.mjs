// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  server: {
    port: 5324
  },
  integrations: [mdx()],
  vite: {
    plugins: [tailwind()]
  },
  output: 'static'
});
