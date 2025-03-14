import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: 'src/content/projects' }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    shipDate: z.coerce.date(),
    summary: z.string(),
    involvement: z.string(),
    images: z
      .object({
        thumbnail: z.string(),
        gallery: z.array(z.string()).optional()
      })
      .optional(),
    links: z
      .array(
        z
          .object({
            href: z.string(),
            label: z.string().optional()
          })
          .optional()
      )
      .optional(),
    significance: z.number().min(1).max(5).optional().default(3)
  })
})

const quotes = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/quotes' }),
  schema: z.object({
    text: z.string(),
    author: z.object({
      name: z.string(),
      handle: z.string().optional(),
      url: z.string().optional()
    })
  })
})

export const collections = {
  projects,
  quotes
}
