import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { getEditorials, getSubjects, createEditorial, deleteEditorial } from '@/lib/api'
import type { Editorial } from '@/lib/api'

export function EditorialList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [editorials, setEditorials] = useState<Editorial[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

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

  async function handleCreate() {
    const subject = activeSubject || prompt('Subject slug (e.g., final-fantasy):')
    if (!subject) return

    const slug = prompt('Entry slug (e.g., intro, ffvii):')
    if (!slug) return

    setCreating(true)
    try {
      const editorial = await createEditorial({ subject, slug })
      setEditorials((prev) => [...prev, editorial])
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this editorial?')) return
    await deleteEditorial(id)
    setEditorials((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Editorials</h2>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="rounded bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200 disabled:opacity-50"
        >
          {creating ? 'Creating...' : 'New Editorial'}
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
                <td className="py-2 pr-4 text-neutral-500">
                  {new Date(e.modified_at).toLocaleDateString()}
                </td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-neutral-600 hover:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
