import { expect, test, describe } from 'bun:test'
import type { TimelineEra, TimelineJob, TimelineLocation, TimelineItem } from '@/types/timeline'

// Mock getAuthorAge function
const mockGetAuthorAge = (date: Date) => Math.floor((date.getTime() - new Date('1985-06-15').getTime()) / (365.25 * 24 * 60 * 60 * 1000))

// Extract and test the core logic functions from useTimelineData
const getItemDate = (item: any): Date => {
  if ('date' in item && item.date instanceof Date) return item.date
  if ('startDate' in item && item.startDate instanceof Date) return item.startDate
  return new Date()
}

const isActiveAtDate = (item: TimelineEra | TimelineLocation | TimelineJob, date: Date) => {
  const endDate = item.endDate || new Date()
  return date >= item.startDate && date <= endDate
}

describe('Timeline Data Processing', () => {
  describe('getItemDate', () => {
    test('extracts date from items with date property', () => {
      const testDate = new Date('2023-01-15')
      const item = { date: testDate }
      expect(getItemDate(item)).toBe(testDate)
    })

    test('extracts startDate from items with startDate property', () => {
      const testDate = new Date('2023-06-01')
      const item = { startDate: testDate }
      expect(getItemDate(item)).toBe(testDate)
    })

    test('returns current date for items without date properties', () => {
      const item = { title: 'No date item' }
      const result = getItemDate(item)
      expect(result).toBeInstanceOf(Date)
    })

    test('prefers date over startDate when both exist', () => {
      const dateValue = new Date('2023-01-15')
      const startDateValue = new Date('2023-02-01')
      const item = { date: dateValue, startDate: startDateValue }
      expect(getItemDate(item)).toBe(dateValue)
    })
  })

  describe('isActiveAtDate', () => {
    test('returns true when date is within active range', () => {
      const era: TimelineEra = {
        type: 'era',
        title: 'Test Era',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31')
      }
      
      const testDate = new Date('2022-06-15')
      expect(isActiveAtDate(era, testDate)).toBe(true)
    })

    test('returns false when date is before start', () => {
      const job: TimelineJob = {
        type: 'job',
        title: 'Developer',
        company: 'Test Corp',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31')
      }
      
      const testDate = new Date('2019-12-15')
      expect(isActiveAtDate(job, testDate)).toBe(false)
    })

    test('returns false when date is after end', () => {
      const location: TimelineLocation = {
        type: 'location',
        name: 'San Francisco',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31')
      }
      
      const testDate = new Date('2024-01-15')
      expect(isActiveAtDate(location, testDate)).toBe(false)
    })

    test('returns true for ongoing items without end date', () => {
      const era: TimelineEra = {
        type: 'era',
        title: 'Current Era',
        startDate: new Date('2020-01-01')
        // No endDate - ongoing
      }
      
      const testDate = new Date('2024-01-15')
      expect(isActiveAtDate(era, testDate)).toBe(true)
    })

    test('includes start date boundary', () => {
      const job: TimelineJob = {
        type: 'job',
        title: 'Developer',
        company: 'Test Corp',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31')
      }
      
      expect(isActiveAtDate(job, new Date('2020-01-01'))).toBe(true)
    })

    test('includes end date boundary', () => {
      const job: TimelineJob = {
        type: 'job',
        title: 'Developer',
        company: 'Test Corp',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31')
      }
      
      expect(isActiveAtDate(job, new Date('2023-12-31'))).toBe(true)
    })
  })

  describe('Timeline filtering', () => {
    const mockItems: TimelineItem[] = [
      {
        type: 'era',
        title: 'College Era',
        startDate: new Date('2003-09-01'),
        endDate: new Date('2007-05-01')
      } as TimelineEra,
      {
        type: 'job',
        title: 'Software Engineer',
        company: 'Tech Corp',
        startDate: new Date('2007-06-01'),
        endDate: new Date('2010-12-31')
      } as TimelineJob,
      {
        type: 'location',
        name: 'San Francisco',
        startDate: new Date('2005-01-01'),
        endDate: new Date('2015-12-31')
      } as TimelineLocation,
      {
        type: 'post',
        title: 'My first post',
        date: new Date('2008-03-15')
      } as any
    ]

    test('filters items by type correctly', () => {
      const eras = mockItems.filter((item): item is TimelineEra => item.type === 'era')
      const jobs = mockItems.filter((item): item is TimelineJob => item.type === 'job')
      const locations = mockItems.filter((item): item is TimelineLocation => item.type === 'location')

      expect(eras).toHaveLength(1)
      expect(eras[0].title).toBe('College Era')
      
      expect(jobs).toHaveLength(1)
      expect(jobs[0].company).toBe('Tech Corp')
      
      expect(locations).toHaveLength(1)
      expect(locations[0].name).toBe('San Francisco')
    })

    test('finds active items at specific date', () => {
      const testDate = new Date('2008-06-01') // After college, during job
      
      const eras = mockItems.filter((item): item is TimelineEra => item.type === 'era')
      const jobs = mockItems.filter((item): item is TimelineJob => item.type === 'job')
      const locations = mockItems.filter((item): item is TimelineLocation => item.type === 'location')

      const activeEra = eras.find(era => isActiveAtDate(era, testDate))
      const activeJob = jobs.find(job => isActiveAtDate(job, testDate))
      const activeLocation = locations.find(location => isActiveAtDate(location, testDate))

      expect(activeEra).toBeUndefined() // College era ended in May 2007
      expect(activeJob?.company).toBe('Tech Corp')
      expect(activeLocation?.name).toBe('San Francisco')
    })
  })
})