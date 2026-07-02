import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router'
import { getEditorials, getSubjects, createEditorial, deleteEditorial } from '@/lib/api'
import type { Editorial } from '@/lib/api'
import { Modal, ConfirmDialog } from '../ui/modal'

export function EditorialList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [editorials, setEditorials] = useState<Editorial[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formSubject, setFormSubject] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Editorial | null>(null)

  const activeSubject = searchParams.get('subject') || undefined
  const activeStatus = searchParams.get('status') || undefined

  useEffect(() => {
    setLoading(true)
    Promise.all([getEditorials(activeSubject, activeStatus), getSubjects()])
      .then(([e, s]) => {
        setEditorials(e)
        setSubjects(s)
      })
      .finally(() => setLoading(false))
  }, [activeSubject, activeStatus])

  function setFilter(key: string, value: string | undefined) {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value)
      } else {
        prev.delete(key)
      }
      return prev
    })
  }

  function openCreate() {
    setFormSubject(activeSubject || '')
    setFormSlug('')
    setFormTitle('')
    setCreateOpen(true)
  }

  async function submitCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!formSubject || !formSlug) return
    setCreating(true)
    try {
      const editorial = await createEditorial({ subject: formSubject, slug: formSlug, title: formTitle })
      setCreateOpen(false)
      navigate(`/editorials/${editorial.id}`)
    } finally {
      setCreating(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    await deleteEditorial(deleteTarget.id)
    setEditorials((prev) => prev.filter((e) => e.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Editorials</h2>
        <button
          onClick={openCreate}
          className="rounded bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
        >
          New Editorial
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('subject', undefined)}
          className={`rounded px-3 py-1 text-sm ${
            !activeSubject ? 'bg-neutral-700 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          All
        </button>
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setFilter('subject', s)}
            className={`rounded px-3 py-1 text-sm ${
              activeSubject === s ? 'bg-neutral-700 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
        <div className="mx-2 border-l border-neutral-800" />
        <button
          onClick={() => setFilter('status', undefined)}
          className={`rounded px-3 py-1 text-sm ${
            !activeStatus ? 'bg-neutral-700 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          Any status
        </button>
        <button
          onClick={() => setFilter('status', 'draft')}
          className={`rounded px-3 py-1 text-sm ${
            activeStatus === 'draft' ? 'bg-neutral-700 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          Draft
        </button>
        <button
          onClick={() => setFilter('status', 'published')}
          className={`rounded px-3 py-1 text-sm ${
            activeStatus === 'published' ? 'bg-neutral-700 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          Published
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : editorials.length === 0 ? (
        <p className="text-neutral-500">No editorials found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-left text-neutral-400">
              <th className="pb-2 pr-4 font-medium">Subject</th>
              <th className="pb-2 pr-4 font-medium">Title / Slug</th>
              <th className="pb-2 pr-4 font-medium">Position</th>
              <th className="pb-2 pr-4 font-medium">Work Ref</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
              <th className="pb-2 pr-4 font-medium">Modified</th>
              <th className="pb-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {editorials.map((e) => (
              <tr key={e.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/50">
                <td className="py-2 pr-4 text-neutral-400">{e.subject}</td>
                <td className="py-2 pr-4">
                  <Link to={`/editorials/${e.id}`} className="text-neutral-200 hover:text-white">
                    {e.title || e.slug}
                  </Link>
                  {e.title && <span className="ml-2 text-neutral-600">{e.slug}</span>}
                </td>
                <td className="py-2 pr-4 text-neutral-400">{e.position ?? '—'}</td>
                <td className="py-2 pr-4 text-neutral-500">{e.work_ref || '—'}</td>
                <td className="py-2 pr-4">
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-xs ${
                      e.status === 'published'
                        ? 'bg-emerald-900/50 text-emerald-400'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {e.status}
                  </span>
                </td>
                <td className="py-2 pr-4 text-neutral-500">{new Date(e.modified_at).toLocaleDateString()}</td>
                <td className="py-2 text-right">
                  <button onClick={() => setDeleteTarget(e)} className="text-neutral-600 hover:text-red-400">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Editorial">
        <form onSubmit={submitCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Subject</label>
            <input
              type="text"
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              placeholder="final-fantasy"
              className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Slug</label>
            <input
              type="text"
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              placeholder="intro"
              className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Title (optional)</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            />
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
              disabled={creating || !formSubject || !formSlug}
              className="rounded bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete editorial"
        message={`Delete "${deleteTarget?.title || deleteTarget?.slug}"? This can't be undone.`}
      />
    </div>
  )
}
