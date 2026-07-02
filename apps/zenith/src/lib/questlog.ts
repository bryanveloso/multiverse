// Questlog is public with permissive CORS, so the CMS browser fetches it directly
// (no Zenith proxy). Used to autocomplete editorial work_ref slugs.
const QUESTLOG_URL = import.meta.env.PUBLIC_QUESTLOG_URL || 'https://questlog.omnyist.com/api'

export interface QuestlogWork {
  id: string
  name: string
  slug: string
  franchise: { name: string; slug: string } | null
  original_release_year: number | null
}

export async function getWorks(): Promise<QuestlogWork[]> {
  const res = await fetch(`${QUESTLOG_URL}/works?limit=2000`)
  if (!res.ok) throw new Error(`Questlog API error: ${res.status}`)
  return res.json() as Promise<QuestlogWork[]>
}
