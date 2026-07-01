// Empty base ⇒ same-origin relative calls (/api/cms/...) in production, where the
// CMS and Zenith API share a hostname behind the tunnel. Dev sets PUBLIC_ZENITH_URL
// to reach Zenith on Saya directly (cross-origin, covered by the CORS allow-list).
const API_BASE = import.meta.env.PUBLIC_ZENITH_URL ?? ''

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}/api/cms${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

// --- Types ---

export interface Editorial {
  id: string
  subject: string
  slug: string
  title: string
  body: string
  position: number | null
  work_ref: string
  status: 'draft' | 'published'
  created_at: string
  modified_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  date: string
  description: string
  body: string
  significance: number
  crosspost: boolean
  status: string
  created_at: string
  modified_at: string
}

// --- Editorial ---

export async function getEditorials(subject?: string, status?: string): Promise<Editorial[]> {
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (status) params.set('status', status)
  const qs = params.toString()
  return fetchApi<Editorial[]>(`/editorials${qs ? `?${qs}` : ''}`)
}

export async function getEditorial(id: string): Promise<Editorial> {
  return fetchApi<Editorial>(`/editorials/${id}`)
}

export async function createEditorial(data: Partial<Editorial>): Promise<Editorial> {
  return fetchApi<Editorial>('/editorials', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateEditorial(id: string, data: Partial<Editorial>): Promise<Editorial> {
  return fetchApi<Editorial>(`/editorials/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteEditorial(id: string): Promise<void> {
  await fetchApi(`/editorials/${id}`, { method: 'DELETE' })
}

export async function getSubjects(): Promise<string[]> {
  return fetchApi<string[]>('/subjects')
}

// --- Posts ---

export async function getPosts(status?: string): Promise<Post[]> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : ''
  return fetchApi<Post[]>(`/posts${qs}`)
}

export async function getPost(slug: string): Promise<Post> {
  return fetchApi<Post>(`/posts/${slug}`)
}
