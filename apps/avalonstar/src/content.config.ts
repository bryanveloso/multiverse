import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    significance: z.number().min(1).max(5).optional().default(3),
  }),
});

const eras = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/eras' }),
  schema: z.object({
    title: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(), // Optional for ongoing eras
    description: z.string(),
    color: z.string().optional(), // Allow custom colors for different eras
  }),
});

const gaps = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/gaps' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    color: z.string().optional(),
    significance: z.number().min(1).max(5).optional().default(3),
  }),
});

// Simple location collection 
const locations = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/locations' }),
  schema: z.object({
    name: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
  }),
});

// Simple job collection
const jobs = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/jobs' }),
  schema: z.object({
    company: z.string(),
    title: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { 
  blog, 
  eras, 
  gaps,
  locations,
  jobs
};
