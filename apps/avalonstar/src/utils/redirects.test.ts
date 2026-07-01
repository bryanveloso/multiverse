import { expect, test, describe } from 'bun:test'

// Extract redirect logic from docker/server.ts for testing
const redirectRules = [
  {
    pattern: /^\/blog\/(\d{4})\/\d{2}\/\d{2}\/([^\/]+)\/?$/,
    getRedirect: (matches: RegExpMatchArray) => `/blog/${matches[1]}-${matches[2]}`
  },
  {
    pattern: /^\/journal\/(\d{4})\/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\/\d{1,2}\/([^\/]+)\/?$/i,
    getRedirect: (matches: RegExpMatchArray) => `/blog/${matches[1]}-${matches[2]}`
  },
  {
    pattern: /^\/(blog|journal|legacy\/blog)\/?$/i,
    getRedirect: () => '/'
  }
]

function processRedirect(path: string): string | null {
  for (const rule of redirectRules) {
    const matches = path.match(rule.pattern)
    if (matches) {
      return rule.getRedirect(matches)
    }
  }
  return null
}

describe('URL Redirect Logic', () => {
  describe('Legacy blog post redirects', () => {
    test('redirects old WordPress-style blog URLs', () => {
      expect(processRedirect('/blog/2024/01/15/my-post-title/'))
        .toBe('/blog/2024-my-post-title')
      
      expect(processRedirect('/blog/2023/12/08/another-post'))
        .toBe('/blog/2023-another-post')
    })

    test('handles URLs without trailing slash', () => {
      expect(processRedirect('/blog/2024/01/15/my-post-title'))
        .toBe('/blog/2024-my-post-title')
    })
  })

  describe('Legacy journal redirects', () => {
    test('redirects old journal URLs with month names', () => {
      expect(processRedirect('/journal/2023/mar/15/old-journal-post/'))
        .toBe('/blog/2023-old-journal-post')
      
      expect(processRedirect('/journal/2024/dec/3/year-end-post/'))
        .toBe('/blog/2024-year-end-post')
    })

    test('handles case insensitive month names', () => {
      expect(processRedirect('/journal/2023/MAR/15/uppercase-month/'))
        .toBe('/blog/2023-uppercase-month')
      
      expect(processRedirect('/journal/2023/Dec/25/mixed-case/'))
        .toBe('/blog/2023-mixed-case')
    })

    test('handles all month abbreviations', () => {
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                     'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
      
      months.forEach(month => {
        expect(processRedirect(`/journal/2023/${month}/15/test-post/`))
          .toBe('/blog/2023-test-post')
      })
    })
  })

  describe('Section root redirects', () => {
    test('redirects section roots to homepage', () => {
      expect(processRedirect('/blog/')).toBe('/')
      expect(processRedirect('/blog')).toBe('/')
      expect(processRedirect('/journal/')).toBe('/')
      expect(processRedirect('/journal')).toBe('/')
      expect(processRedirect('/legacy/blog/')).toBe('/')
      expect(processRedirect('/legacy/blog')).toBe('/')
    })

    test('handles case insensitive section names', () => {
      expect(processRedirect('/BLOG/')).toBe('/')
      expect(processRedirect('/Journal')).toBe('/')
    })
  })

  describe('No redirect cases', () => {
    test('returns null for modern URLs that don\'t need redirects', () => {
      expect(processRedirect('/blog/2024-modern-post')).toBeNull()
      expect(processRedirect('/about')).toBeNull()
      expect(processRedirect('/')).toBeNull()
      expect(processRedirect('/projects')).toBeNull()
    })

    test('returns null for malformed legacy URLs', () => {
      expect(processRedirect('/blog/not-a-year/01/15/post/')).toBeNull()
      expect(processRedirect('/journal/2023/invalid/15/post/')).toBeNull()
      expect(processRedirect('/blog/2024/13/15/invalid-month/')).toBe('/blog/2024-invalid-month')
    })
  })
})