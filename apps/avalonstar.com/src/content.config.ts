import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { zenithBlogLoader, zenithTimelineLoader } from '@/loaders/zenith'

const blog = defineCollection({
  loader: zenithBlogLoader(),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.url().optional(),
    significance: z.number().min(1).max(5).optional().default(3),
    crosspost: z.boolean().optional().default(false),
  }),
})

const timeline = defineCollection({
  loader: zenithTimelineLoader(),
  schema: z.object({
    eventType: z.string(),
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    description: z.string(),
    color: z.string(),
    significance: z.number(),
    metadata: z.record(z.string(), z.any()),
  }),
})

export const collections = {
  blog,
  timeline,
}
