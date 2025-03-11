import { defineCollection, z } from 'astro:content'

export const collections = {
  portfolio: defineCollection({
    schema: z.object({
      // Basic info
      title: z.string(),
      organization: z.string(), // Company or client name

      // Timeline
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),

      // Project details
      summary: z.string(), // Short description for listings

      // Content categorization
      type: z
        .enum(['project', 'employment', 'speaking', 'open-source'])
        .default('project'),
      role: z.string().optional(), // Your role or position

      // Visual elements
      featuredImage: z.string().optional(),
      images: z.array(z.string()).optional(),

      // Classification
      tags: z.array(z.string()).optional(), // Skills, tools, languages, frameworks, etc.

      // Metadata
      featured: z.boolean().optional().default(false),
      published: z.boolean().optional().default(true),
      significance: z.number().min(1).max(5).optional().default(3)
    })
  })
}
