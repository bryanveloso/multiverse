import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getSlot, updateSlot } from '@/lib/api'
import type { Slot } from '@/lib/api'
import { MarkdownEditor } from './markdown-editor'
import { WorkRefInput } from './work-ref-input'

export function SlotEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [slot, setSlot] = useState<Slot | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [body, setBody] = useState('')
  const [position, setPosition] = useState('')
  const [workRef, setWorkRef] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getSlot(id)
      .then((s) => {
        setSlot(s)
        setTitle(s.title)
        setSlug(s.slug)
        setBody(s.body)
        setPosition(s.position !== null ? String(s.position) : '')
        setWorkRef(s.work_ref)
        setStatus(s.status)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = useCallback(async () => {
    if (!id || !slot) return
    setSaving(true)
    try {
      const updated = await updateSlot(id, {
        title,
        slug,
        body,
        position: position !== '' ? Number(position) : null,
        work_ref: workRef,
        status,
      })
      setSlot(updated)
      setDirty(false)
    } finally {
      setSaving(false)
    }
  }, [id, slot, title, slug, body, position, workRef, status])

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

  if (loading) {
    return <p className="text-neutral-500">Loading...</p>
  }

  if (!slot) {
    return <p className="text-neutral-500">Slot not found.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-neutral-400 hover:text-white">
            &larr;
          </button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title || slug}</h2>
            <p className="text-sm text-neutral-500">slot · {slug}</p>
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

      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="space-y-4">
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
              placeholder="Slot title"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm text-neutral-400">Body</label>
            <div className="h-[calc(100vh-320px)]">
              <MarkdownEditor
                value={body}
                onChange={(next) => {
                  setBody(next)
                  setDirty(true)
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as 'draft' | 'published')
                setDirty(true)
              }}
              className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Position</label>
            <input
              type="number"
              value={position}
              onChange={(e) => {
                setPosition(e.target.value)
                setDirty(true)
              }}
              className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
              placeholder="—"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value)
                setDirty(true)
              }}
              className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Work Reference</label>
            <WorkRefInput
              value={workRef}
              onChange={(v) => {
                setWorkRef(v)
                setDirty(true)
              }}
            />
          </div>
          <div className="rounded border border-amber-900/40 bg-amber-950/30 p-3 text-xs text-amber-400/80">
            Saving a published slot triggers a rebuild of omnyist.com.
          </div>
        </div>
      </div>
    </div>
  )
}
