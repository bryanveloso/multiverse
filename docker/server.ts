import { statSync, readFileSync } from 'fs'
import { join } from 'path'

const DIST_PATH = process.env.DIST_PATH || './dist'
const PORT = parseInt(process.env.PORT || '3000')

// Define redirect patterns
const redirectRules = [
  {
    pattern: /^\/blog\/(\d{4})\/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\/\d{1,2}\/([^\/]+)\/?$/i,
    getRedirect: (matches: RegExpMatchArray) => `/blog/${matches[1]}-${matches[2]}`
  },
  {
    pattern: /^\/legacy\/blog\/(\d{4})\/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\/\d{1,2}\/([^\/]+)\/?$/i,
    getRedirect: (matches: RegExpMatchArray) => `/blog/${matches[1]}-${matches[2]}`
  },
  {
    pattern: /^\/journal\/(\d{4})\/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\/\d{1,2}\/([^\/]+)\/?$/i,
    getRedirect: (matches: RegExpMatchArray) => `/blog/${matches[1]}-${matches[2]}`
  },
  // Root sections redirect to homepage
  {
    pattern: /^\/(blog|journal|legacy\/blog)\/?$/i,
    getRedirect: () => '/'
  }
]

// Content types for common file extensions
const contentTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
}

// Helper function to determine content type
function getContentType(filePath: string): string {
  const ext = filePath.substring(filePath.lastIndexOf('.'))
  return contentTypes[ext] || 'application/octet-stream'
}

// Start Bun server
const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname

    console.log(`Received request: ${path}`)

    // Health check endpoint
    if (path === '/health') {
      const uptime = process.uptime()
      const memoryUsage = process.memoryUsage()
      
      return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(uptime),
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) // MB
        },
        environment: process.env.NODE_ENV || 'development'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })
    }

    // Check for redirects
    for (const rule of redirectRules) {
      const matches = path.match(rule.pattern)
      if (matches) {
        const redirectPath = rule.getRedirect(matches)
        console.log(`Redirecting ${path} to ${redirectPath}`)
        return new Response(null, {
          status: 301,
          headers: {
            Location: redirectPath,
            // Security headers even for redirects
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
          }
        })
      }
    }

    // Handle static file serving
    let filePath = join(DIST_PATH, path === '/' ? 'index.html' : path)

    try {
      // Check if file exists
      const fileStat = statSync(filePath)

      // If a directory is requested, try to serve index.html
      if (fileStat.isDirectory()) {
        filePath = join(filePath, 'index.html')
      }

      // Read file content
      const fileContent = readFileSync(filePath)

      // Get content type
      const contentType = getContentType(filePath)

      return new Response(fileContent, {
        headers: {
          'Content-Type': contentType,
          // Add cache control for static assets
          'Cache-Control': filePath.endsWith('.html') ? 'no-cache' : 'public, max-age=31536000',
          // Security headers
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
        }
      })
    } catch (error) {
      // If file not found, try to serve 404.html
      try {
        const notFoundPath = join(DIST_PATH, '404.html')
        const notFoundContent = readFileSync(notFoundPath)

        return new Response(notFoundContent, {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            // Security headers
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
          }
        })
      } catch {
        // If no 404.html, return a plain 404 response
        return new Response('Not Found', {
          status: 404,
          headers: {
            'Content-Type': 'text/plain'
          }
        })
      }
    }
  },
  error(error) {
    console.error('Server error:', error)
    return new Response('Server Error', {
      status: 500
    })
  }
})

console.log(`Server running at http://localhost:${server.port}`)

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  server.stop()
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...')
  server.stop()
  process.exit(0)
})
