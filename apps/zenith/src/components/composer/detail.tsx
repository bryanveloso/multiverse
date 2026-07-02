import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { getManifest, upsertManifest, getEditorials, createEditorial } from '@/lib/api'
import type { Slot, Editorial } from '@/lib/api'

export function ComposerDetail() {
  const { subject = '' } = useParams<{ subject: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [pagePath, setPagePath] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [editorials, setEditorials] = useState<Editorial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  const loadEditorials = useCallback(() => {
    getEditorials(subject)
      .then(setEditorials)
      .catch(() => {})
  }, [subject])

  useEffect(() => {
    getManifest(subject)
      .then((m) => {
        setTitle(m.title)
        setPagePath(m.page_path)
        setSlots(m.slots)
      })
      .catch(() => {
        // No manifest yet — start empty; Save will create it.
        setTitle(subject)
      })
      .finally(() => setLoading(false))
    loadEditorials()
  }, [subject, loadEditorials])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await upsertManifest(subject, { title, page_path: pagePath, slots })
      setDirty(false)
    } finally {
      setSaving(false)
    }
  }, [subject, title, pagePath, slots])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleSave])

  function updateSlot(index: number, patch: Partial<Slot>) {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
    setDirty(true)
  }

  function addSlot() {
    setSlots((prev) => [...prev, { name: '', label: '', required: false }])
    setDirty(true)
  }

  function removeSlot(index: number) {
    setSlots((prev) => prev.filter((_, i) => i !== index))
    setDirty(true)
  }

  function moveSlot(index: number, dir: -1 | 1) {
    setSlots((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setDirty(true)
  }

  async function createForSlot(slot: Slot) {
    const editorial = await createEditorial({ subject, slug: slot.name, title: slot.label || slot.name })
    navigate(`/editorials/${editorial.id}`)
  }

  const bySlug = new Map(editorials.map((e) => [e.slug, e]))
  const slotNames = new Set(slots.map((s) => s.name))
  const unplaced = editorials.filter((e) => !slotNames.has(e.slug))
  const filledCount = slots.filter((s) => bySlug.has(s.name)).length

  if (loading) {
    return <p className="text-neutral-500">Loading...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/composer')} className="text-neutral-400 hover:text-white">
            &larr;
          </button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title || subject}</h2>
            <p className="text-sm text-neutral-500">
              {subject} · {filledCount} of {slots.length} slot{slots.length === 1 ? '' : 's'} filled
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-xs text-neutral-500">Unsaved changes</span>}
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="rounded bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-400">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setDirty(true)
            }}
            className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-400">Page path</label>
          <input
            type="text"
            value={pagePath}
            onChange={(e) => {
              setPagePath(e.target.value)
              setDirty(true)
            }}
            placeholder="/gaming/final-fantasy"
            className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Slots</h3>
          <button onClick={addSlot} className="text-sm text-neutral-400 hover:text-white">
            + Add slot
          </button>
        </div>
        {slots.length === 0 ? (
          <p className="text-sm text-neutral-500">No slots yet. Add one to define the page's shape.</p>
        ) : (
          <ul className="space-y-2">
            {slots.map((slot, i) => {
              const filled = bySlug.get(slot.name)
              return (
                <li
                  key={i}
                  className="flex items-center gap-2 rounded border border-neutral-800 bg-neutral-900 px-3 py-2"
                >
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveSlot(i, -1)}
                      disabled={i === 0}
                      className="text-xs text-neutral-600 hover:text-white disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveSlot(i, 1)}
                      disabled={i === slots.length - 1}
                      className="text-xs text-neutral-600 hover:text-white disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                  <input
                    type="text"
                    value={slot.name}
                    onChange={(e) => updateSlot(i, { name: e.target.value })}
                    placeholder="slot-name"
                    className="w-40 rounded border border-neutral-800 bg-neutral-950 px-2 py-1 font-mono text-xs text-white outline-none focus:border-neutral-600"
                  />
                  <input
                    type="text"
                    value={slot.label}
                    onChange={(e) => updateSlot(i, { label: e.target.value })}
                    placeholder="Label"
                    className="flex-1 rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-sm text-white outline-none focus:border-neutral-600"
                  />
                  <label className="flex items-center gap-1 text-xs text-neutral-400">
                    <input
                      type="checkbox"
                      checked={slot.required}
                      onChange={(e) => updateSlot(i, { required: e.target.checked })}
                    />
                    required
                  </label>
                  {filled ? (
                    <Link
                      to={`/editorials/${filled.id}`}
                      className="rounded bg-emerald-900/50 px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-900"
                    >
                      filled →
                    </Link>
                  ) : (
                    <button
                      onClick={() => createForSlot(slot)}
                      disabled={!slot.name}
                      className="rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-700 disabled:opacity-40"
                    >
                      + create
                    </button>
                  )}
                  <button
                    onClick={() => removeSlot(i)}
                    className="text-xs text-neutral-600 hover:text-red-400"
                  >
                    ✕
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {unplaced.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Unplaced editorials</h3>
          <p className="text-xs text-neutral-500">
            These editorials exist in this subject but aren't claimed by any slot.
          </p>
          <ul className="space-y-1">
            {unplaced.map((e) => (
              <li key={e.id}>
                <Link
                  to={`/editorials/${e.id}`}
                  className="flex items-center gap-2 rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:border-neutral-700"
                >
                  <span className="font-mono text-xs text-neutral-500">{e.slug}</span>
                  <span className="text-neutral-300">{e.title || e.slug}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
