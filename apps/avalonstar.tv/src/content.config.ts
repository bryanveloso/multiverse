import { defineCollection, z } from 'astro:content'

const emotes = defineCollection({
  type: 'data',
  schema: z.object({
    artist: z.string(),
    artistUrl: z.string().url().optional(),
    emotes: z.array(z.object({
      name: z.string(),
      imageUrl: z.string(),
      estimatedDate: z.date().optional()
    }))
  })
})

export const collections = {
  emotes
}