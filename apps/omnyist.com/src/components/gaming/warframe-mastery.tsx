import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import type { MasteryRemaining, RemainingItem } from '@/lib/questlog'

const API =
  import.meta.env.PUBLIC_QUESTLOG_API_URL || 'https://questlog.omnyist.com/api'

type SortKey = 'mastery_value' | 'mastery_req' | 'name'
type SortDir = 'asc' | 'desc'

function wikiUrl(name: string): string {
  return `https://wiki.warframe.com/w/${encodeURIComponent(name.replace(/ /g, '_'))}`
}

export default function WarframeMastery() {
  const [data, setData] = useState<MasteryRemaining | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters (client-side over a single fetch)
  const [category, setCategory] = useState('')
  const [hidePrimes, setHidePrimes] = useState(false)
  const [equippableOnly, setEquippableOnly] = useState(true)
  const [includeVaulted, setIncludeVaulted] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('mastery_value')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  useEffect(() => {
    const controller = new AbortController()
    fetch(
      `${API}/warframe/mastery/remaining?include_vaulted=true&include_primes=true&limit=1000`,
      { signal: controller.signal },
    )
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`)
        return res.json()
      })
      .then((json: MasteryRemaining) => setData(json))
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Failed to load')
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  const categories = useMemo(() => {
    if (!data) return []
    return [...new Set(data.items.map((i) => i.category))].sort()
  }, [data])

  const rows = useMemo(() => {
    if (!data) return []
    const filtered = data.items.filter((i) => {
      if (category && i.category !== category) return false
      if (hidePrimes && i.is_prime) return false
      if (equippableOnly && !i.equippable) return false
      if (!includeVaulted && i.vaulted) return false
      return true
    })
    const dir = sortDir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name) * dir
      return (a[sortKey] - b[sortKey]) * dir
    })
  }, [data, category, hidePrimes, equippableOnly, includeVaulted, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : 'desc')
    }
  }

  if (loading) return <p className="text-gray-600">Loading mastery data…</p>
  if (error)
    return <p className="text-red-400">Couldn’t load mastery data: {error}</p>
  if (!data) return <p className="text-gray-600">No mastery data yet.</p>

  const arrow = (key: SortKey) =>
    key === sortKey ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''

  return (
    <div>
      {/* Headline stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Stat label="Mastery Rank" value={data.current_mastery_rank} />
        <Stat label="Remaining" value={data.total_remaining} />
        <Stat label="Obtainable" value={data.total_obtainable} />
        <Stat
          label="MR points in reach"
          value={data.obtainable_mastery_points.toLocaleString()}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg bg-black-100 px-3 py-1.5"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Toggle checked={equippableOnly} onChange={setEquippableOnly} label="Equippable only" />
        <Toggle checked={hidePrimes} onChange={setHidePrimes} label="Hide Primes" />
        <Toggle checked={includeVaulted} onChange={setIncludeVaulted} label="Include vaulted" />
        <span className="text-gray-500 ml-auto">{rows.length} shown</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg bg-black-100">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <Th onClick={() => toggleSort('name')}>Item{arrow('name')}</Th>
              <th className="px-3 py-2">Category</th>
              <Th onClick={() => toggleSort('mastery_value')} right>
                MR value{arrow('mastery_value')}
              </Th>
              <Th onClick={() => toggleSort('mastery_req')} right>
                Req{arrow('mastery_req')}
              </Th>
              <th className="px-3 py-2">Acquire</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <Row key={item.name + item.category} item={item} />
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="px-3 py-6 text-center text-gray-500">
            Nothing matches these filters.
          </p>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-black-100 p-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  )
}

function Th({
  children,
  onClick,
  right,
}: {
  children: ReactNode
  onClick: () => void
  right?: boolean
}) {
  return (
    <th
      onClick={onClick}
      className={`px-3 py-2 cursor-pointer hover:text-gray-300 ${right ? 'text-right' : ''}`}
    >
      {children}
    </th>
  )
}

function Row({ item }: { item: RemainingItem }) {
  return (
    <tr className="border-t border-black-50 hover:bg-black-50 transition-colors">
      <td className="px-3 py-2">
        <a
          href={wikiUrl(item.name)}
          target="_blank"
          rel="noreferrer"
          className="hover:text-turquoise-400"
        >
          {item.name}
        </a>
        {item.is_prime && (
          <span className="ml-2 text-xs text-yellow-500">Prime</span>
        )}
        {item.vaulted && (
          <span className="ml-2 text-xs text-red-400">Vaulted</span>
        )}
      </td>
      <td className="px-3 py-2 text-gray-600">{item.category}</td>
      <td className="px-3 py-2 text-right">{item.mastery_value.toLocaleString()}</td>
      <td className="px-3 py-2 text-right text-gray-600">{item.mastery_req}</td>
      <td className="px-3 py-2 text-gray-600">{item.acquisition || '—'}</td>
    </tr>
  )
}
