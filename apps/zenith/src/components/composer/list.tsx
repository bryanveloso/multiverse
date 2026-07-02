import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getManifests, upsertManifest } from '@/lib/api'
import type { PageManifest } from '@/lib/api'
import { Modal } from '../ui/modal'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ComposerList() {
  const navigate = useNavigate()
  const [manifests, setManifests] = useState<PageManifest[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [subjectInput, setSubjectInput] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    getManifests()
      .then(setManifests)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function submitNew(e: React.FormEvent) {
    e.preventDefault()
    if (!subjectInput) return
    const subject = slugify(subjectInput)
    setCreating(true)
    try {
      await upsertManifest(subject, { title: subjectInput, slots: [] })
      navigate(`/composer/${subject}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Composer</h2>
        <button
          onClick={() => {
            setSubjectInput('')
            setCreateOpen(true)
          }}
          className="rounded bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
        >
          New Subject
        </button>
      </div>
      <p className="text-sm text-neutral-500">
        Define the slots each subject's page expects, then author editorials to fill them.
      </p>

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : manifests.length === 0 ? (
        <p className="text-neutral-500">No subjects yet.</p>
      ) : (
        <ul className="space-y-2">
          {manifests.map((m) => (
            <li key={m.id}>
              <Link
                to={`/composer/${m.subject}`}
                className="flex items-center justify-between rounded border border-neutral-800 bg-neutral-900 px-4 py-3 hover:border-neutral-700"
              >
                <span>
                  <span className="text-neutral-200">{m.title || m.subject}</span>
                  <span className="ml-2 text-sm text-neutral-500">{m.subject}</span>
                </span>
                <span className="text-sm text-neutral-500">
                  {m.slots.length} slot{m.slots.length === 1 ? '' : 's'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Subject">
        <form onSubmit={submitNew} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Subject</label>
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="final-fantasy"
              className="w-full rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
            />
            <p className="mt-1 text-xs text-neutral-500">Saved as a slug: {slugify(subjectInput) || '…'}</p>
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
              disabled={creating || !subjectInput}
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
