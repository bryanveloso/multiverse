import { expect, test, describe } from 'bun:test'
import { cn } from './style'
import { getAuthorAge } from './age'

describe('Style Utilities', () => {
  describe('cn function', () => {
    test('merges classes correctly', () => {
      expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
    })

    test('handles conflicting Tailwind classes', () => {
      // tailwind-merge should resolve conflicts
      expect(cn('px-4', 'px-8')).toBe('px-8')
      expect(cn('text-red-500', 'text-blue-600')).toBe('text-blue-600')
    })

    test('handles conditional classes', () => {
      expect(cn('base', true && 'active', false && 'inactive'))
        .toBe('base active')
    })

    test('handles arrays and objects', () => {
      expect(cn(['px-4', 'py-2'], { 'bg-red': true, 'bg-blue': false }))
        .toBe('px-4 py-2 bg-red')
    })

    test('handles empty and undefined values', () => {
      expect(cn()).toBe('')
      expect(cn(undefined, null, '')).toBe('')
    })
  })
})

describe('Age Utilities', () => {
  describe('getAuthorAge function', () => {
    test('calculates age correctly for Date objects', () => {
      const birthDate = new Date('1983-04-02')
      
      // Before birthday in 2023
      expect(getAuthorAge(new Date('2023-03-01'))).toBe(39)
      
      // On birthday in 2023
      expect(getAuthorAge(new Date('2023-04-02'))).toBe(40)
      
      // After birthday in 2023
      expect(getAuthorAge(new Date('2023-06-15'))).toBe(40)
    })

    test('calculates age correctly for string dates', () => {
      expect(getAuthorAge('2023-03-01')).toBe(39)
      expect(getAuthorAge('2023-04-02')).toBe(40)
      expect(getAuthorAge('2023-06-15')).toBe(40)
    })

    test('handles edge cases around birthday', () => {
      // Day before birthday
      expect(getAuthorAge(new Date('2023-04-01'))).toBe(39)
      
      // Day after birthday
      expect(getAuthorAge(new Date('2023-04-03'))).toBe(40)
    })

    test('handles same month but different days', () => {
      // Same month, before birthday day
      expect(getAuthorAge(new Date('2023-04-01'))).toBe(39)
      
      // Same month, after birthday day
      expect(getAuthorAge(new Date('2023-04-15'))).toBe(40)
    })

    test('handles leap years correctly', () => {
      // Test around leap year
      expect(getAuthorAge(new Date('2024-02-29'))).toBe(40)
      expect(getAuthorAge(new Date('2024-04-02'))).toBe(41)
    })

    test('handles future dates', () => {
      expect(getAuthorAge(new Date('2030-06-15'))).toBe(47)
    })

    test('handles past dates before birth', () => {
      expect(getAuthorAge(new Date('1980-01-01'))).toBe(-4)
    })
  })
})