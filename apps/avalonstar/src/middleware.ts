import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const url = new URL(request.url)
  const path = url.pathname

  // Legacy URL patterns that need redirection
  // Handle patterns like:
  // /journal/YEAR/MONTH/DAY/slug/ -> /blog/YEAR/slug
  // /legacy/blog/YEAR/MONTH/DAY/slug/ -> /blog/YEAR/slug
  // /blog/YEAR/MONTH/DAY/slug/ -> /blog/YEAR/slug

  // First, check if it's a legacy format URL
  const legacyPatterns = [
    /^\/journal\/(\d{4})\/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\/\d{1,2}\/([^\/]+)\/?$/i,
    /^\/legacy\/blog\/(\d{4})\/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\/\d{1,2}\/([^\/]+)\/?$/i,
    /^\/blog\/(\d{4})\/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\/\d{1,2}\/([^\/]+)\/?$/i
  ]

  for (const pattern of legacyPatterns) {
    const match = path.match(pattern)
    if (match) {
      const [_, year, slug] = match
      return new Response(null, {
        status: 301, // Permanent redirect
        headers: {
          Location: `/blog/${year}/${slug}`
        }
      })
    }
  }

  // Redirect just the /blog/ index page to /, but not blog posts
  if (path === '/blog' || path === '/blog/') {
    return new Response(null, {
      status: 301, // Permanent redirect
      headers: {
        Location: '/'
      }
    })
  }

  const response = await next()

  // Only process font files.
  if (request.url.includes('/fonts/')) {
    const headers = new Headers(response.headers)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('Access-Control-Allow-Origin', '*')

    // Set correct content type based on file extension
    const url = new URL(request.url)
    const ext = url.pathname.split('.').pop()
    if (ext === 'woff2') {
      headers.set('Content-Type', 'font/woff2')
    } else if (ext === 'woff') {
      headers.set('Content-Type', 'font/woff')
    } else if (ext === 'ttf') {
      headers.set('Content-Type', 'font/ttf')
    } else if (ext === 'otf') {
      headers.set('Content-Type', 'font/otf')
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    })
  }

  return response
})
