import { useEffect, useRef, useState } from 'react'
import { getWorks } from '@/lib/questlog'
import type { QuestlogWork } from '@/lib/questlog'

// Cached across editor opens — the works list rarely changes within a session.
let worksCache: QuestlogWork[] | null = null

interface Props {
  value: string
  onChange: (value: string) => void
}

export function WorkRefInput({ value, onChange }: Props) {
  const [works, setWorks] = useState<QuestlogWork[]>(worksCache || [])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (worksCache) return
    getWorks()
      .then((w) => {
        worksCache = w
        setWorks(w)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const q = value.trim().toLowerCase()
  const matches = q
    ? works.filter((w) => w.slug.includes(q) || w.name.toLowerCase().includes(q)).slice(0, 8)
    : []
  const exact = works.find((w) => w.slug === value)

  function select(w: QuestlogWork) {
    onChange(w.slug)
    setOpen(false)
  }

  return (
    <div ref={boxRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setActive(0)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!open || matches.length === 0) return
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive((a) => Math.min(a + 1, matches.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive((a) => Math.max(a - 1, 0))
          } else if (e.key === 'Enter') {
            e.preventDefault()
            select(matches[active])
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
        placeholder="questlog-work-slug"
        className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
      />
      {value && exact && !open && (
        <p className="mt-1 truncate text-xs text-emerald-400/80">✓ {exact.name}</p>
      )}
      {open && matches.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded border border-neutral-700 bg-neutral-900 shadow-xl">
          {matches.map((w, i) => (
            <li key={w.id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  select(w)
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm ${
                  i === active ? 'bg-neutral-800' : ''
                }`}
              >
                <span className="min-w-0 flex-1 truncate text-neutral-200">
                  {w.name}
                  {w.original_release_year && (
                    <span className="ml-1 text-neutral-500">({w.original_release_year})</span>
                  )}
                </span>
                <span className="shrink-0 font-mono text-xs text-neutral-500">{w.slug}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
