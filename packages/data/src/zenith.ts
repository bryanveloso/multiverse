const ZENITH_URL = import.meta.env.ZENITH_URL || 'http://localhost:7181'
const ZENITH_API_KEY = import.meta.env.ZENITH_API_KEY || ''

async function fetchZenith<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`/api${path}`, ZENITH_URL)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const headers: Record<string, string> = {}
  if (ZENITH_API_KEY) {
    headers['Authorization'] = `Bearer ${ZENITH_API_KEY}`
  }

  const response = await fetch(url.toString(), {
    headers,
    signal: AbortSignal.timeout(60000),
  })
  if (!response.ok) {
    throw new Error(`Zenith API error: ${response.status} ${response.statusText} for ${path}`)
  }
  return response.json() as Promise<T>
}

// --- Types ---

export interface ZenithPost {
  id: string
  title: string
  slug: string
  date: string
  description: string
  significance: number
  crosspost: boolean
  hero_image: ZenithImage | null
}

export interface ZenithPostDetail extends ZenithPost {
  body: string
  updated_at: string | null
  images: ZenithImage[]
}

export interface ZenithImage {
  id: string
  url: string
  alt: string
  caption: string
  width: number | null
  height: number | null
}

export interface ZenithEra {
  id: string
  title: string
  slug: string
  description: string
  color: string
  start_date: string
  end_date: string | null
}

export interface ZenithLocation {
  id: string
  name: string
  slug: string
  description: string
  color: string
  start_date: string
  end_date: string | null
}

export interface ZenithJob {
  id: string
  company: string
  title: string
  slug: string
  description: string
  color: string
  start_date: string
  end_date: string | null
}

export interface ZenithGap {
  id: string
  title: string
  slug: string
  date: string
  description: string
  body: string
  color: string
  significance: number
}

export interface ZenithAnnotation {
  id: string
  post_id: string
  date: string
  body: string
}

export interface ZenithProject {
  id: string
  title: string
  slug: string
  company: string
  date: string
  summary: string
  significance: number
  hero_image: string
}

export interface ZenithProjectDetail extends ZenithProject {
  involvement: string
  body: string
  job_id: string | null
  links: ZenithProjectLink[]
  images: ZenithProjectImage[]
}

export interface ZenithProjectLink {
  id: string
  href: string
  label: string
}

export interface ZenithProjectImage {
  id: string
  url: string
  alt: string
  is_thumbnail: boolean
  position: number
}

export interface ZenithQuote {
  id: string
  text: string
  author_name: string
  author_handle: string
  author_url: string
  project_id: string | null
}

// --- Writing ---

export async function getPosts(options?: { limit?: number; offset?: number; significance?: number }) {
  const params: Record<string, string | number> = {}
  if (options?.limit) params.limit = options.limit
  if (options?.offset) params.offset = options.offset
  if (options?.significance) params.significance = options.significance
  return fetchZenith<ZenithPost[]>('/posts', params)
}

export async function getAllPosts() {
  const posts: ZenithPost[] = []
  let offset = 0
  const limit = 100
  while (true) {
    const batch = await getPosts({ limit, offset })
    posts.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }
  return posts
}

export async function getAllPostDetails() {
  const posts: ZenithPostDetail[] = []
  let offset = 0
  const limit = 100
  while (true) {
    const batch = await fetchZenith<ZenithPostDetail[]>('/posts/bulk', { limit, offset })
    posts.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }
  return posts
}

export async function getPost(slug: string) {
  return fetchZenith<ZenithPostDetail>(`/posts/${slug}`)
}

export async function getPostAnnotations(slug: string) {
  return fetchZenith<ZenithAnnotation[]>(`/posts/${slug}/annotations`)
}

// --- Timeline ---

export interface ZenithTimelineEvent {
  id: string
  event_type: string
  date: string
  end_date: string | null
  title: string
  slug: string
  description: string
  color: string
  significance: number
  metadata: Record<string, unknown>
}

export async function getTimeline(options?: { limit?: number; offset?: number; event_type?: string; significance?: number }) {
  const params: Record<string, string | number> = {}
  if (options?.limit) params.limit = options.limit
  if (options?.offset) params.offset = options.offset
  if (options?.event_type) params.event_type = options.event_type
  if (options?.significance) params.significance = options.significance
  return fetchZenith<ZenithTimelineEvent[]>('/timeline', params)
}

export async function getAllTimelineEvents() {
  const events: ZenithTimelineEvent[] = []
  let offset = 0
  const limit = 200
  while (true) {
    const batch = await getTimeline({ limit, offset })
    events.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }
  return events
}

export async function getEras() {
  return fetchZenith<ZenithEra[]>('/eras')
}

export async function getLocations() {
  return fetchZenith<ZenithLocation[]>('/locations')
}

export async function getJobs() {
  return fetchZenith<ZenithJob[]>('/jobs')
}

export async function getGaps() {
  return fetchZenith<ZenithGap[]>('/gaps')
}

// --- Works ---

export async function getProjects(options?: { limit?: number; offset?: number }) {
  const params: Record<string, string | number> = {}
  if (options?.limit) params.limit = options.limit
  if (options?.offset) params.offset = options.offset
  return fetchZenith<ZenithProject[]>('/projects', params)
}

export async function getProject(slug: string) {
  return fetchZenith<ZenithProjectDetail>(`/projects/${slug}`)
}

export async function getQuotes() {
  return fetchZenith<ZenithQuote[]>('/quotes')
}
