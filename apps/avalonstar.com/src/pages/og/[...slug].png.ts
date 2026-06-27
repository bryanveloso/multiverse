import type { APIContext } from 'astro'
import { getCollection, getEntry } from 'astro:content'
import { generateOgImage } from '@/utils/og-image'

export async function getStaticPaths() {
  const blogPosts = await getCollection('blog')

  return blogPosts.map((post) => ({
    params: { slug: Buffer.from(post.id).toString('base64url') },
    props: {
      title: post.data.title,
      date: post.data.date,
      description: post.data.description,
      heroImage: post.data.heroImage,
    },
  }))
}

export async function GET(context: APIContext) {
  const { params, props } = context
  let title: string
  let date: Date
  let description: string | undefined
  let heroImage: string | undefined

  if (import.meta.env.DEV && !props) {
    if (!params.slug) {
      return new Response('Not found', { status: 404 })
    }

    const slug = Buffer.from(params.slug, 'base64url').toString('utf-8')

    try {
      const post = await getEntry('blog', slug)
      if (!post) {
        return new Response('Post not found', { status: 404 })
      }
      title = post.data.title
      date = post.data.date
      description = post.data.description
      heroImage = post.data.heroImage
    } catch (error) {
      return new Response('Error loading post', { status: 500 })
    }
  } else {
    const postProps = props as {
      title: string
      date: Date
      description?: string
      heroImage?: string
    }
    title = postProps.title
    date = postProps.date
    description = postProps.description
    heroImage = postProps.heroImage
  }

  const png = await generateOgImage({
    title,
    date,
    description,
    heroImage,
  })

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}