import type { MiddlewareHandler } from 'astro'

export const fontMiddleware: MiddlewareHandler = async ({ request }, next) => {
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
}
