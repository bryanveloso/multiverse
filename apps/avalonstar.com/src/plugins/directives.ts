import { defineMdastPlugin } from 'satteri'
import type { LeafDirective } from 'satteri'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const directivesPlugin = defineMdastPlugin({
  name: 'avalonstar-directives',

  leafDirective(node: Readonly<LeafDirective>) {
    if (node.name === 'figure') {
      const attrs = node.attributes ?? {}
      const src = attrs.src ?? ''
      const alt = escapeHtml(attrs.alt ?? '')
      const caption = attrs.caption ?? ''

      let html = '<figure>'
      html += `<img src="${escapeHtml(src)}" alt="${alt}" loading="lazy" />`
      if (caption) {
        html += `<figcaption>${escapeHtml(caption)}</figcaption>`
      }
      html += '</figure>'

      return { rawHtml: html }
    }
  },
})
