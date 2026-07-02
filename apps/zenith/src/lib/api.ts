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

export interface Slot {
  id: string
  slug: string
  title: string
  body: string
  position: number | null
  work_ref: string
  status: 'draft' | 'published'
  created_at: string
  modified_at: string
}

export interface Page {
  id: string
  slug: string
  title: string
  path: string
  slot_count: number
  created_at: string
  modified_at: string
}

export interface PageDetail {
  id: string
  slug: string
  title: string
  path: string
  slots: Slot[]
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

export interface Gap {
  id: string
  title: string
  slug: string
  date: string
  description: string
  body: string
  color: string
  significance: number
  created_at: string
  modified_at: string
}

// --- Pages ---

export async function getPages(): Promise<Page[]> {
  return fetchApi<Page[]>('/pages')
}

export async function getPage(slug: string): Promise<PageDetail> {
  return fetchApi<PageDetail>(`/pages/${slug}`)
}

export async function createPage(data: { slug: string; title?: string; path?: string }): Promise<PageDetail> {
  return fetchApi<PageDetail>('/pages', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updatePage(slug: string, data: Partial<Page>): Promise<PageDetail> {
  return fetchApi<PageDetail>(`/pages/${slug}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deletePage(slug: string): Promise<void> {
  await fetchApi(`/pages/${slug}`, { method: 'DELETE' })
}

// --- Slots ---

export async function createSlot(pageSlug: string, data: Partial<Slot>): Promise<Slot> {
  return fetchApi<Slot>(`/pages/${pageSlug}/slots`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getSlot(id: string): Promise<Slot> {
  return fetchApi<Slot>(`/slots/${id}`)
}

export async function updateSlot(id: string, data: Partial<Slot>): Promise<Slot> {
  return fetchApi<Slot>(`/slots/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteSlot(id: string): Promise<void> {
  await fetchApi(`/slots/${id}`, { method: 'DELETE' })
}

// --- Posts ---

export async function getPosts(status?: string): Promise<Post[]> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : ''
  return fetchApi<Post[]>(`/posts${qs}`)
}

export async function getPost(slug: string): Promise<Post> {
  return fetchApi<Post>(`/posts/${slug}`)
}

export async function createPost(data: Partial<Post>): Promise<Post> {
  return fetchApi<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updatePost(slug: string, data: Partial<Post>): Promise<Post> {
  return fetchApi<Post>(`/posts/${slug}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

// --- Gaps ---

export async function getGaps(): Promise<Gap[]> {
  return fetchApi<Gap[]>('/gaps')
}

export async function getGap(id: string): Promise<Gap> {
  return fetchApi<Gap>(`/gaps/${id}`)
}

export async function createGap(data: Partial<Gap>): Promise<Gap> {
  return fetchApi<Gap>('/gaps', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateGap(id: string, data: Partial<Gap>): Promise<Gap> {
  return fetchApi<Gap>(`/gaps/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteGap(id: string): Promise<void> {
  await fetchApi(`/gaps/${id}`, { method: 'DELETE' })
}
