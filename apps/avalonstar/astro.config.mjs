// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://avalonstar.com',
  integrations: [
    mdx(),
    sitemap(),
    {
      name: 'custom-urls',
      hooks: {
        'astro:build:setup': ({ pages, updateConfig }) => {
          // Create a new Map to store transformed URLs
          const transformedPages = new Map();

          // Iterate over the pages Map
          for (const [key, pageData] of pages.entries()) {
            if (!key.startsWith('/blog/')) {
              transformedPages.set(key, pageData);
              continue;
            }

            // Extract date and slug from original filename
            const match = key.match(/\/blog\/(\d{4})-(\d{2})-(\d{2})-(.+)$/);
            if (!match) {
              transformedPages.set(key, pageData);
              continue;
            }

            const [_, year, month, day, slug] = match;

            // Create the new URL structure
            const newKey = `/blog/${year}/${slug}`;

            // Set the transformed page data with the new key
            transformedPages.set(newKey, {
              ...pageData,
              route: newKey,
            });
          }

          // Clear and update the original pages Map
          pages.clear();
          for (const [key, value] of transformedPages) {
            pages.set(key, value);
          }
        },
      },
    },
  ],
});
