import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getPages, createPage } from '@/lib/api'
import type { Page } from '@/lib/api'
import { Modal } from '../ui/modal'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function PagesList() {
  const navigate = useNavigate()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    getPages()
      .then(setPages)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const slug = formSlug || slugify(formTitle)

  async function submitCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!slug) return
    setCreating(true)
    try {
      const page = await createPage({ slug, title: formTitle })
      navigate(`/pages/${page.slug}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Pages</h2>
        <button
          onClick={() => {
            setFormTitle('')
            setFormSlug('')
            setCreateOpen(true)
          }}
          className="rounded bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
        >
          New Page
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : pages.length === 0 ? (
        <p className="text-neutral-500">No pages yet.</p>
      ) : (
        <ul className="space-y-2">
          {pages.map((p) => (
            <li
              key={p.id}
              onClick={() => navigate(`/pages/${p.slug}`)}
              className="flex cursor-pointer items-center justify-between rounded border border-neutral-800 bg-neutral-900 px-4 py-3 hover:border-neutral-700"
            >
              <span>
                <span className="text-neutral-200">{p.title || p.slug}</span>
                <span className="ml-2 text-sm text-neutral-500">{p.slug}</span>
                {p.path && <span className="ml-2 font-mono text-xs text-neutral-600">{p.path}</span>}
              </span>
              <span className="text-sm text-neutral-500">
                {p.slot_count} slot{p.slot_count === 1 ? '' : 's'}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Page">
        <form onSubmit={submitCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Final Fantasy Favorites"
              className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Slug</label>
            <input
              type="text"
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              placeholder={slugify(formTitle) || 'final-fantasy-favorites'}
              className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 font-mono text-sm text-white outline-none focus:border-neutral-600"
            />
            <p className="mt-1 text-xs text-neutral-500">Will save as: {slug || '…'}</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !slug}
              className="rounded bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
