import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getSubjects, getEditorials, getPosts } from '@/lib/api'
import type { Editorial, Post } from '@/lib/api'

export function Dashboard() {
  const [subjects, setSubjects] = useState<string[]>([])
  const [recentEditorials, setRecentEditorials] = useState<Editorial[]>([])
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSubjects(), getEditorials(), getPosts()])
      .then(([s, e, p]) => {
        setSubjects(s)
        setRecentEditorials(e.slice(0, 5))
        setRecentPosts(p.slice(0, 5))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-neutral-500">Loading...</p>
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-sm text-neutral-400">Subjects</p>
          <p className="text-3xl font-bold">{subjects.length}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-sm text-neutral-400">Editorials</p>
          <p className="text-3xl font-bold">{recentEditorials.length}+</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-sm text-neutral-400">Posts</p>
          <p className="text-3xl font-bold">{recentPosts.length}+</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Recent Editorials</h3>
            <Link to="/editorials" className="text-sm text-neutral-400 hover:text-white">
              View all
            </Link>
          </div>
          {recentEditorials.length === 0 ? (
            <p className="text-sm text-neutral-500">No editorials yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentEditorials.map((e) => (
                <li key={e.id}>
                  <Link
                    to={`/editorials/${e.id}`}
                    className="block rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:border-neutral-700"
                  >
                    <span className="text-neutral-200">{e.title || e.slug}</span>
                    <span className="ml-2 text-neutral-500">{e.subject}</span>
                    <span
                      className={`ml-2 inline-block rounded px-1.5 py-0.5 text-xs ${
                        e.status === 'published'
                          ? 'bg-emerald-900/50 text-emerald-400'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {e.status}
                    </span>
                  </Link>
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
                    <span className="ml-2 text-neutral-500">
                      {new Date(p.date).toLocaleDateString()}
                    </span>
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
