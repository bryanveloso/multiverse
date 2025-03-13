import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

import { SITE_TITLE, SITE_DESCRIPTION } from '@/consts'

export async function GET(context) {
  const posts = await getCollection('blog')
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => {
      // Extract year and slug from the post ID following the same pattern as [...id].astro
      const [date, ...idParts] = post.id.split('-')
      const year = date.substring(0, 4)
      const cleanId = idParts.slice(2).join('-')
      const formattedId = `${year}/${cleanId}`

      return {
        ...post.data,
        link: `/${formattedId}/`
      }
    })
  })
}
