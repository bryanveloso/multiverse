const QUESTLOG_API_URL = import.meta.env.QUESTLOG_API_URL || 'http://localhost:7176/api'

async function fetchAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${QUESTLOG_API_URL}${endpoint}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`API error: ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error)
    return null
  }
}

// --- Types ---

export interface Franchise {
  id: string
  name: string
  slug: string
}

export interface Genre {
  id: string
  name: string
  slug: string
  igdb_id: number | null
  parent_id: string | null
}

export interface Work {
  id: string
  name: string
  slug: string
  franchise: Franchise | null
  original_release_year: number | null
}

export interface Edition {
  id: string
  work_id: string
  name: string
  slug: string
  edition_type: 'original' | 'remaster' | 'remake' | 'port' | 'definitive' | 'collection'
  igdb_id: number | null
  cover_url: string | null
  release_date: string | null
  summary: string | null
}

export interface WorkDetail extends Work {
  editions: Edition[]
}

export interface List {
  id: string
  slug: string
  name: string
  description: string
  is_ranked: boolean
  entry_count: number
}

export interface ListEntry {
  id: string
  work_id: string
  work_name: string
  work_slug: string
  position: number | null
  notes: string
}

export interface ListDetail extends Omit<List, 'entry_count'> {
  entries: ListEntry[]
}

export interface ListActivity {
  id: string
  timestamp: string
  verb: 'created' | 'added' | 'removed' | 'reordered'
  entries: string[]
  metadata: Record<string, unknown>
}

// --- Warframe ---

export interface RemainingItem {
  name: string
  category: string
  mastery_req: number
  mastery_value: number
  is_prime: boolean
  vaulted: boolean
  equippable: boolean
  acquisition: string
  tags: string[]
  vault_date: string
}

export interface AcquisitionGroup {
  acquisition: string
  count: number
  mastery_points: number
}

export interface MasteryRemaining {
  current_mastery_rank: number
  total_remaining: number
  total_obtainable: number
  obtainable_mastery_points: number
  by_acquisition: AcquisitionGroup[]
  items: RemainingItem[]
}

// --- API Functions ---

export async function getWorks(options?: { franchise?: string; limit?: number }): Promise<Work[]> {
  const params = new URLSearchParams()
  if (options?.franchise) params.set('franchise', options.franchise)
  if (options?.limit) params.set('limit', options.limit.toString())
  const query = params.toString() ? `?${params}` : ''
  return (await fetchAPI<Work[]>(`/works${query}`)) || []
}

export async function getWork(slug: string): Promise<WorkDetail | null> {
  return fetchAPI<WorkDetail>(`/works/${slug}`)
}

export async function getFranchises(): Promise<Franchise[]> {
  return (await fetchAPI<Franchise[]>('/franchises')) || []
}

export async function getGenres(): Promise<Genre[]> {
  return (await fetchAPI<Genre[]>('/genres')) || []
}

export async function getLists(): Promise<List[]> {
  return (await fetchAPI<List[]>('/lists')) || []
}

export async function getList(slug: string): Promise<ListDetail | null> {
  return fetchAPI<ListDetail>(`/lists/${slug}`)
}

export async function getListActivity(slug: string, limit?: number): Promise<ListActivity[]> {
  const query = limit ? `?limit=${limit}` : ''
  return (await fetchAPI<ListActivity[]>(`/lists/${slug}/activity${query}`)) || []
}
