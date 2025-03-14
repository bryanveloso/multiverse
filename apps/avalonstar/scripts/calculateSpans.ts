import fs from 'fs'
import path from 'path'
import { mkdir } from 'node:fs/promises'
import { parse as parseYAML } from 'yaml'

// Configure paths.
const contentDir = path.join(process.cwd(), 'src/content')
const outputPath = path.join(process.cwd(), 'src/utils/spans.ts')

// Function to read content from directories.
async function readContentDirectory(dir: string) {
  const items = []
  const files = fs.readdirSync(path.join(contentDir, dir))

  for (const file of files) {
    if (file.endsWith('.md') || file.endsWith('.mdx') || file.endsWith('.json')) {
      const filePath = path.join(contentDir, dir, file)
      const content = await Bun.file(filePath).text()

      // Parse frontmatter.
      let data
      if (file.endsWith('.json')) {
        data = JSON.parse(content)
      } else {
        const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/)
        if (frontmatterMatch && frontmatterMatch[1]) {
          data = parseYAML(frontmatterMatch[1])
        }
      }

      if (data) {
        // Add the slug from filename if not present.
        if (!data.slug) {
          data.slug = file.replace(/\.(md|mdx|json)$/, '')
        }
        items.push({ ...data, filePath })
      }
    }
  }

  return items
}

async function calculateSpans() {
  const eras = await readContentDirectory('eras')
  const gaps = await readContentDirectory('gaps')
  const jobs = await readContentDirectory('jobs')
  const locations = await readContentDirectory('locations')
  const posts = await readContentDirectory('blog')

  console.log(
    `Found ${posts.length} posts, ${gaps.length} gaps, ${eras.length} eras, ${locations.length} locations, and ${jobs.length} jobs.`
  )

  // Sort all items by date.
  const allItems = [
    ...eras.map((era) => ({
      type: 'era',
      startDate: new Date(era.startDate),
      endDate: era.endDate ? new Date(era.endDate) : new Date(),
      slug: era.slug,
      title: era.title
    })),
    ...gaps.map((gap) => ({
      type: 'gap',
      date: new Date(gap.date),
      title: gap.title
    })),
    ...jobs.map((job) => ({
      type: 'job',
      startDate: new Date(job.startDate),
      endDate: job.endDate ? new Date(job.endDate) : new Date(),
      slug: job.slug,
      title: job.title,
      company: job.company
    })),
    ...locations.map((location) => ({
      type: 'location',
      startDate: new Date(location.startDate),
      endDate: location.endDate ? new Date(location.endDate) : new Date(),
      slug: location.slug,
      title: location.name
    })),
    ...posts.map((post) => ({
      type: 'post',
      date: new Date(post.date),
      id: post.slug
    }))
  ].sort((a, b) => {
    const dateA = 'date' in a ? a.date : a.startDate
    const dateB = 'date' in b ? b.date : b.startDate
    return dateA.getTime() - dateB.getTime()
  })

  const spanLengths = {
    eras: {} as Record<string, number>,
    jobs: {} as Record<string, number>,
    locations: {} as Record<string, number>
  }

  // Calculate for eras
  console.log('Calculating spans for eras...')
  for (const era of eras) {
    const slug = era.slug
    const startDate = new Date(era.startDate)
    const endDate = era.endDate ? new Date(era.endDate) : new Date()

    // Count items in range
    const itemsInRange = allItems.filter((item) => {
      const itemDate = 'date' in item ? item.date : 'startDate' in item ? item.startDate : null
      return itemDate && itemDate >= startDate && itemDate <= endDate
    })

    spanLengths.eras[slug] = itemsInRange.length
    console.log(`  ${era.title} (${slug}): ${itemsInRange.length} items`)
  }

  // Calculate for jobs
  console.log('Calculating spans for jobs...')
  for (const job of jobs) {
    const slug = job.slug
    const startDate = new Date(job.startDate)
    const endDate = job.endDate ? new Date(job.endDate) : new Date()

    const itemsInRange = allItems.filter((item) => {
      const itemDate = 'date' in item ? item.date : 'startDate' in item ? item.startDate : null
      return itemDate && itemDate >= startDate && itemDate <= endDate
    })

    spanLengths.jobs[slug] = itemsInRange.length
    console.log(`  ${job.company} (${slug}): ${itemsInRange.length} items`)
  }

  // Calculate for locations
  console.log('Calculating spans for locations...')
  for (const location of locations) {
    const slug = location.slug
    const startDate = new Date(location.startDate)
    const endDate = location.endDate ? new Date(location.endDate) : new Date()

    const itemsInRange = allItems.filter((item) => {
      const itemDate = 'date' in item ? item.date : 'startDate' in item ? item.startDate : null
      return itemDate && itemDate >= startDate && itemDate <= endDate
    })

    spanLengths.locations[slug] = itemsInRange.length
    console.log(`  ${location.name} (${slug}): ${itemsInRange.length} items`)
  }

  const dirPath = `src/utils`
  try {
    await mkdir(dirPath, { recursive: true })
  } catch (error) {
    console.log(`Note: ${dirPath} already exists or couldn't be created.`)
  }

  const fileContent = `// Auto-generated spans - DO NOT EDIT MANUALLY
// Generated on ${new Date().toISOString()}

export const spanLengths = ${JSON.stringify(spanLengths, null, 2)}
`

  await Bun.write(outputPath, fileContent)
  console.log(`Span calculations complete! File written to: ${outputPath}`)
}

calculateSpans().catch(console.error)
