import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { getPage, updatePage, deletePage, createSlot, updateSlot, deleteSlot } from '@/lib/api'
import type { Slot } from '@/lib/api'
import { Modal, ConfirmDialog } from '../ui/modal'

export function PageDetail() {
  const { slug = '' } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [path, setPath] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  const [addOpen, setAddOpen] = useState(false)
  const [newSlug, setNewSlug] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)

  const [deleteSlotTarget, setDeleteSlotTarget] = useState<Slot | null>(null)
  const [deletePageOpen, setDeletePageOpen] = useState(false)

  const load = useCallback(() => {
    getPage(slug)
      .then((p) => {
        setTitle(p.title)
        setPath(p.path)
        setSlots(p.slots)
      })
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(load, [load])

  async function savePage() {
    setSaving(true)
    try {
      await updatePage(slug, { title, path })
      setDirty(false)
    } finally {
      setSaving(false)
    }
  }

  async function reorder(from: number, to: number) {
    const next = [...slots]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    const updates: { id: string; position: number }[] = []
    next.forEach((s, i) => {
      if (s.position !== i) {
        updates.push({ id: s.id, position: i })
        s.position = i
      }
    })
    setSlots([...next])
    await Promise.all(updates.map((u) => updateSlot(u.id, { position: u.position })))
  }

  async function submitAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newSlug) return
    setCreating(true)
    try {
      const slot = await createSlot(slug, { slug: newSlug, title: newTitle, position: slots.length })
      navigate(`/slots/${slot.id}`)
    } finally {
      setCreating(false)
    }
  }

  async function confirmDeleteSlot() {
    if (!deleteSlotTarget) return
    await deleteSlot(deleteSlotTarget.id)
    setSlots((prev) => prev.filter((s) => s.id !== deleteSlotTarget.id))
    setDeleteSlotTarget(null)
  }

  async function confirmDeletePage() {
    await deletePage(slug)
    navigate('/pages')
  }

  if (loading) {
    return <p className="text-neutral-500">Loading...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/pages')} className="text-neutral-400 hover:text-white">
            &larr;
          </button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title || slug}</h2>
            <p className="text-sm text-neutral-500">{slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-xs text-neutral-500">Unsaved changes</span>}
          <button
            onClick={savePage}
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
            value={path}
            onChange={(e) => {
              setPath(e.target.value)
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
          <button
            onClick={() => {
              setNewSlug('')
              setNewTitle('')
              setAddOpen(true)
            }}
            className="rounded bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
          >
            Add Slot
          </button>
        </div>
        {slots.length === 0 ? (
          <p className="text-sm text-neutral-500">No slots yet. Add the first block of this page.</p>
        ) : (
          <ul className="space-y-2">
            {slots.map((slot, i) => (
              <li
                key={slot.id}
                className="flex items-center gap-3 rounded border border-neutral-800 bg-neutral-900 px-3 py-2"
              >
                <div className="flex flex-col">
                  <button
                    onClick={() => reorder(i, i - 1)}
                    disabled={i === 0}
                    className="text-xs text-neutral-600 hover:text-white disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => reorder(i, i + 1)}
                    disabled={i === slots.length - 1}
                    className="text-xs text-neutral-600 hover:text-white disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>
                <span className="w-6 shrink-0 text-center text-xs tabular-nums text-neutral-500">
                  {slot.position ?? '—'}
                </span>
                <Link to={`/slots/${slot.id}`} className="min-w-0 flex-1">
                  <span className="text-neutral-200 hover:text-white">{slot.title || slot.slug}</span>
                  {slot.title && <span className="ml-2 font-mono text-xs text-neutral-600">{slot.slug}</span>}
                </Link>
                {slot.work_ref && <span className="font-mono text-xs text-neutral-500">{slot.work_ref}</span>}
                <span
                  className={`inline-block rounded px-1.5 py-0.5 text-xs ${
                    slot.status === 'published'
                      ? 'bg-emerald-900/50 text-emerald-400'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {slot.status}
                </span>
                <button
                  onClick={() => setDeleteSlotTarget(slot)}
                  className="text-xs text-neutral-600 hover:text-red-400"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-4">
        <button
          onClick={() => setDeletePageOpen(true)}
          className="text-sm text-neutral-600 hover:text-red-400"
        >
          Delete page
        </button>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Slot">
        <form onSubmit={submitAdd} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Slug</label>
            <input
              type="text"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="intro, ffvii, outro"
              className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Title (optional)</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !newSlug}
              className="rounded bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteSlotTarget !== null}
        onClose={() => setDeleteSlotTarget(null)}
        onConfirm={confirmDeleteSlot}
        title="Delete slot"
        message={`Delete "${deleteSlotTarget?.title || deleteSlotTarget?.slug}"? This can't be undone.`}
      />

      <ConfirmDialog
        open={deletePageOpen}
        onClose={() => setDeletePageOpen(false)}
        onConfirm={confirmDeletePage}
        title="Delete page"
        message={`Delete "${title || slug}" and all ${slots.length} of its slots? This can't be undone.`}
      />
    </div>
  )
}
