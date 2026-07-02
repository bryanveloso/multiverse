import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getPages, getPosts } from '@/lib/api'
import type { Page, Post } from '@/lib/api'

export function Dashboard() {
  const navigate = useNavigate()
  const [pages, setPages] = useState<Page[]>([])
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getPages(), getPosts()])
      .then(([pg, p]) => {
        setPages(pg)
        setRecentPosts(p.slice(0, 5))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-neutral-500">Loading...</p>
  }

  const slotTotal = pages.reduce((sum, p) => sum + p.slot_count, 0)

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-sm text-neutral-400">Pages</p>
          <p className="text-3xl font-bold">{pages.length}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-sm text-neutral-400">Slots</p>
          <p className="text-3xl font-bold">{slotTotal}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-sm text-neutral-400">Posts</p>
          <p className="text-3xl font-bold">{recentPosts.length}+</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Pages</h3>
            <Link to="/pages" className="text-sm text-neutral-400 hover:text-white">
              View all
            </Link>
          </div>
          {pages.length === 0 ? (
            <p className="text-sm text-neutral-500">No pages yet.</p>
          ) : (
            <ul className="space-y-2">
              {pages.map((p) => (
                <li key={p.id}>
                  <div
                    onClick={() => navigate(`/pages/${p.slug}`)}
                    className="flex cursor-pointer items-center justify-between rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:border-neutral-700"
                  >
                    <span>
                      <span className="text-neutral-200">{p.title || p.slug}</span>
                      <span className="ml-2 text-neutral-500">{p.slug}</span>
                    </span>
                    <span className="text-xs text-neutral-500">
                      {p.slot_count} slot{p.slot_count === 1 ? '' : 's'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Recent Posts</h3>
            <Link to="/posts" className="text-sm text-neutral-400 hover:text-white">
              View all
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="text-sm text-neutral-500">No posts yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentPosts.map((p) => (
                <li key={p.id}>
                  <div className="rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm">
                    <span className="text-neutral-200">{p.title}</span>
                    <span className="ml-2 text-neutral-500">{new Date(p.date).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
