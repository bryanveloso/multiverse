import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { zenithProjectsLoader, zenithQuotesLoader } from '@/loaders/zenith'

const projects = defineCollection({
  loader: zenithProjectsLoader(),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    involvement: z.string(),
    heroImage: z.url().optional(),
    links: z
      .array(
        z.object({
          href: z.string(),
          label: z.string().optional(),
        })
      )
      .optional()
      .default([]),
    significance: z.number().min(1).max(5).optional().default(3),
  }),
})

const quotes = defineCollection({
  loader: zenithQuotesLoader(),
  schema: z.object({
    text: z.string(),
    author: z.object({
      name: z.string(),
      handle: z.string().optional(),
      url: z.string().optional(),
    }),
  }),
})

export const collections = {
  projects,
  quotes,
}
