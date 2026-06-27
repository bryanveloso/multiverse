import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri'

let processor: Awaited<ReturnType<typeof createSatteriMarkdownProcessor>> | null = null

async function getProcessor() {
  if (!processor) {
    processor = await createSatteriMarkdownProcessor({
      features: { directive: true },
    })
  }
  return processor
}

export async function renderMarkdown(content: string): Promise<string> {
  const proc = await getProcessor()
  const result = await proc.render(content)
  return result.code
}
