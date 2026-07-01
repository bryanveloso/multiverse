import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getEditorial, updateEditorial } from '@/lib/api'
import type { Editorial } from '@/lib/api'

export function EditorialEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [editorial, setEditorial] = useState<Editorial | null>(null)
  const [body, setBody] = useState('')
  const [title, setTitle] = useState('')
  const [position, setPosition] = useState<string>('')
  const [workRef, setWorkRef] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getEditorial(id)
      .then((e) => {
        setEditorial(e)
        setBody(e.body)
        setTitle(e.title)
        setPosition(e.position !== null ? String(e.position) : '')
        setWorkRef(e.work_ref)
        setStatus(e.status)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = useCallback(async () => {
    if (!id || !editorial) return
    setSaving(true)
    try {
      const updated = await updateEditorial(id, {
        title,
        body,
        position: position !== '' ? Number(position) : null,
        work_ref: workRef,
        status,
      })
      setEditorial(updated)
      setDirty(false)
    } finally {
      setSaving(false)
    }
  }, [id, editorial, title, body, position, workRef, status])

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

  if (!editorial) {
    return <p className="text-neutral-500">Editorial not found.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/editorials')}
            className="text-neutral-400 hover:text-white"
          >
            &larr;
          </button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {editorial.title || editorial.slug}
            </h2>
            <p className="text-sm text-neutral-500">
              {editorial.subject}/{editorial.slug}
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
              placeholder="Entry title"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm text-neutral-400">Body</label>
            <textarea
              value={body}
              onChange={(e) => {
                setBody(e.target.value)
                setDirty(true)
              }}
              className="h-[calc(100vh-320px)] w-full resize-none rounded border border-neutral-800 bg-neutral-900 px-4 py-3 font-mono text-sm text-white outline-none focus:border-neutral-600"
              placeholder="Write markdown here..."
            />
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
            <label className="mb-1 block text-sm text-neutral-400">Work Reference</label>
            <input
              type="text"
              value={workRef}
              onChange={(e) => {
                setWorkRef(e.target.value)
                setDirty(true)
              }}
              className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
              placeholder="questlog-work-slug"
            />
          </div>
          <div className="rounded border border-neutral-800 bg-neutral-900 p-3 text-xs text-neutral-500">
            <p>
              <strong className="text-neutral-400">Subject:</strong> {editorial.subject}
            </p>
            <p>
              <strong className="text-neutral-400">Slug:</strong> {editorial.slug}
            </p>
            <p>
              <strong className="text-neutral-400">Created:</strong>{' '}
              {new Date(editorial.created_at).toLocaleString()}
            </p>
            <p>
              <strong className="text-neutral-400">Modified:</strong>{' '}
              {new Date(editorial.modified_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
