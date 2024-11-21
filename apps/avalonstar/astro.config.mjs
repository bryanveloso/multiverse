// // @ts-check
// import { defineConfig } from 'astro/config';
// import mdx from '@astrojs/mdx';

// import sitemap from '@astrojs/sitemap';

// // https://astro.build/config
// export default defineConfig({
// 	site: 'https://example.com',
// 	integrations: [mdx(), sitemap()],
// });

// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4321,
  },

  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),
});
