import { useRef } from 'react'
import { highlightMarkdown } from './highlight-markdown'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: Props) {
  const preRef = useRef<HTMLPreElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  function syncScroll() {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop
      preRef.current.scrollLeft = taRef.current.scrollLeft
    }
  }

  // Trailing newline: textarea shows the empty final line, so the highlight layer
  // needs one too or the last line drifts out of alignment.
  const html = highlightMarkdown(value) + (value.endsWith('\n') ? '\n' : '')

  return (
    <div className="md-editor">
      <pre ref={preRef} aria-hidden="true" className="md-editor__pre" dangerouslySetInnerHTML={{ __html: html }} />
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        spellCheck={false}
        className="md-editor__textarea"
        placeholder="Write markdown here..."
      />
    </div>
  )
}
