# Questlog API Integration

How Omnyist consumes the Questlog API.

## Base URL

```
Production: https://questlog.omnyist.com/api
Local:      http://localhost:7176/api
```

## API Documentation

Interactive docs available at `/api/docs` (OpenAPI/Swagger).

## Available Endpoints

### Library

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/franchises` | GET | List all franchises |
| `/genres` | GET | List all genres |
| `/works` | GET | List works (supports `?franchise=slug`, `?limit=N`, `?offset=N`) |
| `/works/{slug}` | GET | Get work with all editions |
| `/editions` | GET | List editions (supports `?work=slug`) |
| `/editions/{slug}` | GET | Get single edition |

### Lists

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/lists` | GET | List all lists with entry counts |
| `/lists/{slug}` | GET | Get list with all entries |
| `/lists/{slug}/activity` | GET | Get list activity history (supports `?limit=N`) |

### IGDB (Internal)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/igdb/search?q=name` | GET | Search IGDB for games |

## Response Schemas

### Work

```typescript
interface Work {
  id: string;
  name: string;
  slug: string;
  franchise: Franchise | null;
  original_release_year: number | null;
}

interface WorkDetail extends Work {
  editions: Edition[];
}
```

### Edition

```typescript
interface Edition {
  id: string;
  work_id: string;
  name: string;
  slug: string;
  edition_type: "original" | "remaster" | "remake" | "port" | "definitive" | "collection";
  igdb_id: number | null;
  cover_url: string | null;
  release_date: string | null;  // ISO date
  summary: string | null;
}
```

### Franchise

```typescript
interface Franchise {
  id: string;
  name: string;
  slug: string;
}
```

### Genre

```typescript
interface Genre {
  id: string;
  name: string;
  slug: string;
  igdb_id: number | null;
  parent_id: string | null;
}
```

### List

```typescript
interface List {
  id: string;
  slug: string;
  name: string;
  description: string;
  is_ranked: boolean;
  entry_count: number;
}

interface ListDetail extends Omit<List, "entry_count"> {
  entries: ListEntry[];
}

interface ListEntry {
  id: string;
  work_id: string;
  work_name: string;
  work_slug: string;
  position: number | null;
  notes: string;
}
```

### Activity

```typescript
interface ListActivity {
  id: string;
  timestamp: string;  // ISO datetime
  verb: "created" | "added" | "removed" | "reordered";
  entries: string[];  // Work slugs affected
  metadata: Record<string, unknown>;
}
```

## Astro Integration Patterns

### Static Generation (Build Time)

For pages that don't change often, fetch at build time:

```astro
---
// src/pages/games/index.astro
const API_BASE = import.meta.env.QUESTLOG_API_URL || "https://questlog.omnyist.com/api";

const works = await fetch(`${API_BASE}/works?limit=500`).then(r => r.json());
const franchises = await fetch(`${API_BASE}/franchises`).then(r => r.json());
---

<ul>
  {works.map(work => (
    <li><a href={`/games/${work.slug}`}>{work.name}</a></li>
  ))}
</ul>
```

### Dynamic Routes

```astro
---
// src/pages/games/[slug].astro
export async function getStaticPaths() {
  const API_BASE = import.meta.env.QUESTLOG_API_URL;
  const works = await fetch(`${API_BASE}/works?limit=500`).then(r => r.json());

  return works.map(work => ({
    params: { slug: work.slug },
    props: { work },
  }));
}

const { work } = Astro.props;
const workDetail = await fetch(`${API_BASE}/works/${work.slug}`).then(r => r.json());
---

<h1>{workDetail.name}</h1>
<ul>
  {workDetail.editions.map(edition => (
    <li>{edition.name} ({edition.edition_type})</li>
  ))}
</ul>
```

### Lists Page

```astro
---
// src/pages/lists/[slug].astro
export async function getStaticPaths() {
  const API_BASE = import.meta.env.QUESTLOG_API_URL;
  const lists = await fetch(`${API_BASE}/lists`).then(r => r.json());

  return lists.map(list => ({
    params: { slug: list.slug },
  }));
}

const { slug } = Astro.params;
const API_BASE = import.meta.env.QUESTLOG_API_URL;

const list = await fetch(`${API_BASE}/lists/${slug}`).then(r => r.json());
const activity = await fetch(`${API_BASE}/lists/${slug}/activity?limit=10`).then(r => r.json());
---

<h1>{list.name}</h1>
<p>{list.description}</p>

<h2>Entries ({list.entries.length})</h2>
<ul>
  {list.entries.map(entry => (
    <li>
      {entry.position ? `#${entry.position} ` : ""}
      <a href={`/games/${entry.work_slug}`}>{entry.work_name}</a>
    </li>
  ))}
</ul>

<h2>Recent Activity</h2>
<ul>
  {activity.map(a => (
    <li>{a.verb} {a.entries.join(", ")} - {new Date(a.timestamp).toLocaleDateString()}</li>
  ))}
</ul>
```

## Environment Variables

In `.env`:

```bash
QUESTLOG_API_URL=https://questlog.omnyist.com/api
```

## Rebuild Triggers

Since Astro generates static pages at build time, you'll need to trigger rebuilds when Questlog data changes. Options:

1. **Manual**: Trigger deploy after updating Questlog
2. **Webhook**: Add a post-save signal in Questlog to hit deploy hook
3. **Scheduled**: Daily rebuilds via cron/GitHub Actions

## Error Handling

All endpoints return proper HTTP status codes:

- `200` - Success
- `404` - Resource not found (returns `{"error": "..."}`)
- `500` - Server error

Example error handling:

```typescript
const response = await fetch(`${API_BASE}/works/${slug}`);
if (!response.ok) {
  if (response.status === 404) {
    return Astro.redirect("/404");
  }
  throw new Error(`API error: ${response.status}`);
}
const work = await response.json();
```
