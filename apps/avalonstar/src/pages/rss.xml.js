import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE_TITLE, SITE_DESCRIPTION } from '@/consts'

export async function GET(context) {
  const posts = await getCollection('blog')
  
  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => 
    new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
  
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    xmlns: {
      // Standard Atom namespace for feed ID and author info
      atom: 'http://www.w3.org/2005/Atom',
      // Content namespace for extended content
      content: 'http://purl.org/rss/1.0/modules/content/'
    },
    customData: `<language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${context.site}rss.xml" rel="self" type="application/rss+xml" />`,
    items: sortedPosts.map((post) => {
      // Extract year and slug from the post ID following the same pattern as [...id].astro
      const [date, ...idParts] = post.id.split('-')
      const year = date.substring(0, 4)
      const cleanId = idParts.slice(2).join('-')
      const formattedId = `${year}/${cleanId}`
      
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/${formattedId}/`
      }
    })
  })
}
