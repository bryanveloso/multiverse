import { getImage } from 'astro:assets'
import type { ImageMetadata } from 'astro'

interface PostImageOptions {
  date: string | Date
  filename: string
}

export async function getPostImage({ date, filename }: PostImageOptions) {
  const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date
  const path = `/src/assets/blog/${formattedDate}/${filename}`

  try {
    const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/posts/**/*.{jpeg,jpg,png,gif,webp}')
    const imageModule = await images[path]()
    return await getImage({ src: imageModule.default })
  } catch (e) {
    console.error(`Failed to load image: ${path}`)
    throw e
  }
}
