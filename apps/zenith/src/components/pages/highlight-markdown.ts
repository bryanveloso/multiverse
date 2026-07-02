// Lightweight highlighter for the markdown + remark-directive syntax Zenith uses.
// It only wraps tokens in <span>s — it never adds or removes visible characters —
// so the output aligns 1:1 with the textarea layered on top of it. Not a full
// parser; good enough to make directive syntax pop while writing.

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Inline tokens: directives (::name{…}), attribute braces, inline code, bold,
// italic, and links. Matched in one pass so tokens don't nest-corrupt each other.
const INLINE = /(`[^`]+`)|(::[A-Za-z][\w-]*(?:\{[^}]*\})?)|(\{[^}]*\})|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*|_[^_\s][^_]*_)|(\[[^\]]+\]\([^)]+\))/g

function inline(text: string): string {
  let out = ''
  let last = 0
  let m: RegExpExecArray | null
  INLINE.lastIndex = 0
  while ((m = INLINE.exec(text))) {
    out += esc(text.slice(last, m.index))
    const tok = m[0]
    if (m[1]) {
      out += `<span class="tok-code">${esc(tok)}</span>`
    } else if (m[2]) {
      const dm = tok.match(/^(::[A-Za-z][\w-]*)(\{[^}]*\})?$/)!
      out += `<span class="tok-directive">${esc(dm[1])}</span>`
      if (dm[2]) out += `<span class="tok-attr">${esc(dm[2])}</span>`
    } else if (m[3]) {
      out += `<span class="tok-attr">${esc(tok)}</span>`
    } else if (m[4]) {
      out += `<span class="tok-strong">${esc(tok)}</span>`
    } else if (m[5]) {
      out += `<span class="tok-em">${esc(tok)}</span>`
    } else if (m[6]) {
      const lm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!
      out += `<span class="tok-link-text">[${esc(lm[1])}]</span>`
      out += `<span class="tok-link-url">(${esc(lm[2])})</span>`
    }
    last = INLINE.lastIndex
  }
  out += esc(text.slice(last))
  return out
}

function highlightLine(raw: string): string {
  // Container directive (:::name{…}) — opens or closes a block like :::lead
  let m = raw.match(/^(\s*)(:::)([A-Za-z][\w-]*)?(.*)$/)
  if (m) {
    const [, indent, marker, name, rest] = m
    const attr = rest.match(/^(\{[^}]*\})?([\s\S]*)$/)!
    let html = esc(indent) + `<span class="tok-directive">${marker}${esc(name || '')}</span>`
    if (attr[1]) html += `<span class="tok-attr">${esc(attr[1])}</span>`
    return html + inline(attr[2])
  }
  // Heading
  m = raw.match(/^(\s{0,3})(#{1,6})(\s.*)$/)
  if (m) {
    const [, indent, hashes, rest] = m
    return esc(indent) + `<span class="tok-heading">${esc(hashes)}${inline(rest)}</span>`
  }
  // Blockquote
  m = raw.match(/^(\s{0,3})(>+)(.*)$/)
  if (m) {
    const [, indent, gt, rest] = m
    return esc(indent) + `<span class="tok-quote">${esc(gt)}${inline(rest)}</span>`
  }
  // List marker
  m = raw.match(/^(\s*)([-*+]|\d+\.)(\s+)([\s\S]*)$/)
  if (m) {
    const [, indent, bullet, sp, rest] = m
    return esc(indent) + `<span class="tok-list">${esc(bullet)}</span>` + esc(sp) + inline(rest)
  }
  return inline(raw)
}

export function highlightMarkdown(code: string): string {
  return code.split('\n').map(highlightLine).join('\n')
}
