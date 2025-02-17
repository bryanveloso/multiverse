import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/blog' }),

  // loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/blog' }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    // Transform string to Date object
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

const eras = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/eras' }),

  schema: z.object({
    title: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(), // Optional for ongoing eras
    description: z.string(),
    color: z.string().optional(), // Allow custom colors for different eras
  }),
});

const gaps = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/gaps' }),

  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
  }),
});

export const collections = { blog, eras, gaps };
