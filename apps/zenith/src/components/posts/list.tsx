import { useEffect, useState } from 'react'
import { getPosts } from '@/lib/api'
import type { Post } from '@/lib/api'

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Posts</h2>

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-neutral-500">No posts found.</p>
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
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/50">
                <td className="py-2 pr-4 text-neutral-200">{p.title}</td>
                <td className="py-2 pr-4 text-neutral-500">
                  {new Date(p.date).toLocaleDateString()}
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-xs ${
                      p.status === 'published'
                        ? 'bg-emerald-900/50 text-emerald-400'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-2 pr-4 text-neutral-500">{p.significance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
