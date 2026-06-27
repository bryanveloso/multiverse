import type { Loader } from 'astro/loaders'
import {
  getAllPostDetails,
  getAllTimelineEvents,
  type ZenithPostDetail,
} from '@multiverse/data/zenith'

function toEntryId(post: ZenithPostDetail): string {
  const dateStr = post.date.slice(0, 10)
  return `${dateStr}-${post.slug}`
}

const CONTAINER_DIRECTIVES: Record<string, [string, string]> = {
  lead: ['<div class="lead">', '</div>'],
  crosspost: ['<aside class="crosspost">', '</aside>'],
}

function preprocessDirectives(body: string): string {
  let result = body
  for (const [name, [open, close]] of Object.entries(CONTAINER_DIRECTIVES)) {
    result = result.replace(
      new RegExp(`^:::${name}\\n(.*?)\\n^:::$`, 'gms'),
      `${open}\n\n$1\n\n${close}`,
    )
  }
  return result
}

export function zenithBlogLoader(): Loader {
  return {
    name: 'zenith-blog',
    async load({ store, parseData, renderMarkdown, logger }) {
      logger.info('Fetching posts from Zenith...')
      const details = await getAllPostDetails()
      logger.info(`Rendering ${details.length} posts...`)

      store.clear()

      for (const post of details) {
        const id = toEntryId(post)
        const data = await parseData({
          id,
          data: {
            title: post.title,
            date: post.date,
            description: post.description || undefined,
            updatedDate: post.updated_at || undefined,
            heroImage: post.hero_image?.url || undefined,
            significance: post.significance,
            crosspost: post.crosspost,
          },
        })

        const rendered = post.body
          ? await renderMarkdown(preprocessDirectives(post.body))
          : undefined

        store.set({ id, data, rendered })
      }

      logger.info(`Loaded ${details.length} posts.`)
    },
  }
}

export function zenithTimelineLoader(): Loader {
  return {
    name: 'zenith-timeline',
    async load({ store, parseData, logger }) {
      logger.info('Fetching timeline from Zenith...')
      const events = await getAllTimelineEvents()

      store.clear()

      for (const event of events) {
        const id = `${event.event_type}-${event.slug}`
        const data = await parseData({
          id,
          data: {
            eventType: event.event_type,
            title: event.title,
            slug: event.slug,
            date: event.date,
            endDate: event.end_date || undefined,
            description: event.description || '',
            color: event.color || '',
            significance: event.significance,
            metadata: event.metadata,
          },
        })

        store.set({ id, data })
      }

      logger.info(`Loaded ${events.length} timeline events.`)
    },
  }
}
