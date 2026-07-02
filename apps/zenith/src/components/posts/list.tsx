import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getPosts, getGaps, createGap, createPost } from '@/lib/api'
import type { Post, Gap } from '@/lib/api'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type TimelineItem =
  | { kind: 'post'; id: string; date: string; title: string; to: string; status: string; significance: number }
  | { kind: 'gap'; id: string; date: string; title: string; to: string; color: string; significance: number }

export function Timeline() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [gaps, setGaps] = useState<Gap[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    // Fetched independently so a failure in one doesn't blank the other.
    getPosts()
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false))
    getGaps()
      .then(setGaps)
      .catch(() => {})
  }, [])

  async function handleNewPost() {
    const title = prompt('Post title:')
    if (!title) return
    setCreating(true)
    try {
      const post = await createPost({
        title,
        slug: `${slugify(title)}-${Date.now().toString(36)}`,
        date: new Date().toISOString(),
      })
      navigate(`/posts/${post.slug}`)
    } finally {
      setCreating(false)
    }
  }

  async function handleNewGap() {
    const title = prompt('Gap title:')
    if (!title) return
    const today = new Date().toISOString().slice(0, 10)
    setCreating(true)
    try {
      const gap = await createGap({ title, slug: `${slugify(title)}-${Date.now().toString(36)}`, date: today })
      navigate(`/gaps/${gap.id}`)
    } finally {
      setCreating(false)
    }
  }

  const items: TimelineItem[] = [
    ...posts.map(
      (p): TimelineItem => ({
        kind: 'post',
        id: p.id,
        date: p.date,
        title: p.title,
        to: `/posts/${p.slug}`,
        status: p.status,
        significance: p.significance,
      })
    ),
    ...gaps.map(
      (g): TimelineItem => ({
        kind: 'gap',
        id: g.id,
        date: g.date,
        title: g.title,
        to: `/gaps/${g.id}`,
        color: g.color,
        significance: g.significance,
      })
    ),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Timeline</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewGap}
            disabled={creating}
            className="rounded border border-neutral-700 px-3 py-1.5 text-sm font-medium text-neutral-200 hover:bg-neutral-800 disabled:opacity-50"
          >
            New Gap
          </button>
          <button
            onClick={handleNewPost}
            disabled={creating}
            className="rounded bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'New Post'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-neutral-500">Nothing here yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-left text-neutral-400">
              <th className="pb-2 pr-4 font-medium">Title</th>
              <th className="pb-2 pr-4 font-medium">Date</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
              <th className="pb-2 pr-4 font-medium">Significance</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={`${it.kind}-${it.id}`} className="border-b border-neutral-800/50 hover:bg-neutral-900/50">
                <td className="py-2 pr-4">
                  {it.kind === 'gap' ? (
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: it.color || '#f59e0b' }}
                      />
                      <Link to={it.to} className="italic text-neutral-300 hover:text-white">
                        {it.title}
                      </Link>
                    </span>
                  ) : (
                    <Link to={it.to} className="text-neutral-200 hover:text-white">
                      {it.title}
                    </Link>
                  )}
                </td>
                <td className="py-2 pr-4 text-neutral-500">{new Date(it.date).toLocaleDateString()}</td>
                <td className="py-2 pr-4">
                  {it.kind === 'gap' ? (
                    <span className="inline-block rounded bg-amber-900/40 px-1.5 py-0.5 text-xs text-amber-400">
                      gap
                    </span>
                  ) : (
                    <span
                      className={`inline-block rounded px-1.5 py-0.5 text-xs ${
                        it.status === 'published'
                          ? 'bg-emerald-900/50 text-emerald-400'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {it.status}
                    </span>
                  )}
                </td>
                <td className="py-2 pr-4 text-neutral-500">{it.significance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
