import type { Loader } from 'astro/loaders'
import {
  getProjects,
  getProject,
  getQuotes,
  type ZenithProject,
  type ZenithProjectDetail,
} from '@multiverse/data/zenith'

export function zenithProjectsLoader(): Loader {
  return {
    name: 'zenith-projects',
    async load({ store, parseData, logger }) {
      logger.info('Fetching projects from Zenith...')
      const projects = await getProjects()

      const details: ZenithProjectDetail[] = []
      for (const project of projects) {
        details.push(await getProject(project.slug))
      }

      store.clear()

      for (const project of details) {
        const data = await parseData({
          id: project.slug,
          data: {
            title: project.title,
            company: project.company,
            date: project.date,
            summary: project.summary,
            involvement: project.involvement,
            heroImage: project.hero_image || undefined,
            links: project.links.map((l) => ({ href: l.href, label: l.label })),
            significance: project.significance,
          },
        })

        store.set({ id: project.slug, data })
      }

      logger.info(`Loaded ${details.length} projects.`)
    },
  }
}

export function zenithQuotesLoader(): Loader {
  return {
    name: 'zenith-quotes',
    async load({ store, parseData, logger }) {
      logger.info('Fetching quotes from Zenith...')
      const quotes = await getQuotes()

      store.clear()

      for (const quote of quotes) {
        const id = quote.author_handle.replace(/^@/, '') || quote.author_name.toLowerCase().replace(/\s+/g, '-')
        const data = await parseData({
          id,
          data: {
            text: quote.text,
            author: {
              name: quote.author_name,
              handle: quote.author_handle || undefined,
              url: quote.author_url || undefined,
            },
          },
        })

        store.set({ id, data })
      }

      logger.info(`Loaded ${quotes.length} quotes.`)
    },
  }
}
