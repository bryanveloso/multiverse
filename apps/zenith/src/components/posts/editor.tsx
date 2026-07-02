import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getPost, updatePost } from '@/lib/api'
import type { Post } from '@/lib/api'
import { MarkdownEditor } from '../pages/markdown-editor'

export function PostEditor() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [body, setBody] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('draft')
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    getPost(slug)
      .then((p) => {
        setPost(p)
        setBody(p.body)
        setTitle(p.title)
        setDescription(p.description)
        setStatus(p.status)
      })
      .finally(() => setLoading(false))
  }, [slug])

  const handleSave = useCallback(async () => {
    if (!slug || !post) return
    setSaving(true)
    try {
      const updated = await updatePost(slug, { title, description, body, status })
      setPost(updated)
      setDirty(false)
    } finally {
      setSaving(false)
    }
  }, [slug, post, title, description, body, status])

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

  if (!post) {
    return <p className="text-neutral-500">Post not found.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/posts')} className="text-neutral-400 hover:text-white">
            &larr;
          </button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title || post.slug}</h2>
            <p className="text-sm text-neutral-500">{post.slug}</p>
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
            <label className="mb-1 block text-sm text-neutral-400">Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setDirty(true)
              }}
              className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
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
            Saving a published post triggers a rebuild of avalonstar.com.
          </div>
          <div className="rounded border border-neutral-800 bg-neutral-900 p-3 text-xs text-neutral-500">
            <p>
              <strong className="text-neutral-400">Date:</strong> {new Date(post.date).toLocaleDateString()}
            </p>
            <p>
              <strong className="text-neutral-400">Significance:</strong> {post.significance}
            </p>
            <p>
              <strong className="text-neutral-400">Modified:</strong>{' '}
              {new Date(post.modified_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
