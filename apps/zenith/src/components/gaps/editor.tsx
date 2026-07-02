import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getGap, updateGap } from '@/lib/api'
import type { Gap } from '@/lib/api'
import { MarkdownEditor } from '../editorial/markdown-editor'

export function GapEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [gap, setGap] = useState<Gap | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [body, setBody] = useState('')
  const [color, setColor] = useState('')
  const [significance, setSignificance] = useState('3')
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getGap(id)
      .then((g) => {
        setGap(g)
        setTitle(g.title)
        setSlug(g.slug)
        setDate(g.date)
        setDescription(g.description)
        setBody(g.body)
        setColor(g.color)
        setSignificance(String(g.significance))
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = useCallback(async () => {
    if (!id || !gap) return
    setSaving(true)
    try {
      const updated = await updateGap(id, {
        title,
        slug,
        date,
        description,
        body,
        color,
        significance: Number(significance),
      })
      setGap(updated)
      setDirty(false)
    } finally {
      setSaving(false)
    }
  }, [id, gap, title, slug, date, description, body, color, significance])

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

  if (!gap) {
    return <p className="text-neutral-500">Gap not found.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/posts')} className="text-neutral-400 hover:text-white">
            &larr;
          </button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title || gap.slug}</h2>
            <p className="text-sm text-neutral-500">gap · {gap.slug}</p>
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
            <label className="mb-1 block text-sm text-neutral-400">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                setDirty(true)
              }}
              className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
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
            <label className="mb-1 block text-sm text-neutral-400">Significance</label>
            <input
              type="number"
              value={significance}
              onChange={(e) => {
                setSignificance(e.target.value)
                setDirty(true)
              }}
              className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Color</label>
            <input
              type="text"
              value={color}
              onChange={(e) => {
                setColor(e.target.value)
                setDirty(true)
              }}
              placeholder="#rrggbb"
              className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setDirty(true)
              }}
              rows={4}
              className="w-full resize-none rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            />
          </div>
          <div className="rounded border border-amber-900/40 bg-amber-950/30 p-3 text-xs text-amber-400/80">
            Saving a gap triggers a rebuild of avalonstar.com.
          </div>
        </div>
      </div>
    </div>
  )
}
