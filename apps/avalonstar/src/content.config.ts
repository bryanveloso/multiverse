import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string().optional(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      significance: z.number().min(1).max(5).optional().default(3),
      crosspost: z.boolean().optional().default(false)
    })
})

const gaps = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/gaps' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    color: z.string().optional(),
    significance: z.number().min(1).max(5).optional().default(3)
  })
})

export const collections = {
  blog,
  gaps
}
