import { useMemo, useState } from 'react'
import type {
  TimelineContext,
  TimelineEra,
  TimelineItem,
  TimelineJob,
  TimelineLocation
} from '@/types/timeline'
import { getAuthorAge } from '@/utils/age'

// Type for items that can have a date
type DateItem = { date?: Date }
type StartDateItem = { startDate?: Date }

// Helper function to extract date from different item types
const getItemDate = (item: DateItem | StartDateItem): Date => {
  if ('date' in item && item.date instanceof Date) return item.date
  if ('startDate' in item && item.startDate instanceof Date) return item.startDate
  return new Date()
}

export function useTimelineData(items: TimelineItem[]) {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  // Function to check if an item is active at a given date
  const isActiveAtDate = (item: TimelineEra | TimelineLocation | TimelineJob, date: Date) => {
    const endDate = item.endDate || new Date()
    return date >= item.startDate && date <= endDate
  }

  // Memoize processed data to avoid recalculation on re-renders
  const { sortedItems, eras, locations, jobs, endOccurrences } = useMemo(() => {
    // Items are pre-sorted and pre-processed at build time by Astro
    // This hook only needs to filter by type and calculate UI-specific data
    const eras = items.filter((item): item is TimelineEra => item.type === 'era')
    const locations = items.filter((item): item is TimelineLocation => item.type === 'location')
    const jobs = items.filter((item): item is TimelineJob => item.type === 'job')

    // Items are already sorted from the Astro component
    const sortedItems = items

    // Calculate end occurances for eras, locations, and jobs
    const endOccurrences = {
      eras: {} as Record<string, number>,
      jobs: {} as Record<string, number>,
      locations: {} as Record<string, number>
    }

    // Initialize endOccurrences for ongoing items (without end dates)
    const initializeEndOccurrences = <T extends { endDate?: Date }>(
      items: T[],
      getKey: (item: T) => string,
      targetMap: Record<string, number>
    ) => {
      items.forEach((item) => {
        if (!item.endDate) {
          targetMap[getKey(item)] = 0
        }
      })
    }

    // Initialize endOccurrences for all item types
    initializeEndOccurrences(eras, (era) => era.title, endOccurrences.eras)
    initializeEndOccurrences(locations, (location) => location.name, endOccurrences.locations)
    initializeEndOccurrences(jobs, (job) => job.company, endOccurrences.jobs)

    // Helper function to update endOccurrences based on active items
    const updateEndOccurrences = <T extends TimelineEra | TimelineLocation | TimelineJob>(
      items: T[],
      getKey: (item: T) => string,
      targetMap: Record<string, number>,
      date: Date,
      index: number
    ) => {
      items.forEach((item) => {
        if (item.endDate && isActiveAtDate(item, date) && !(getKey(item) in targetMap)) {
          targetMap[getKey(item)] = index
        }
      })
    }

    sortedItems.forEach((item, index) => {
      const date = getItemDate(item)

      // Update endOccurrences for all item types
      updateEndOccurrences(eras, (era) => era.title, endOccurrences.eras, date, index)
      updateEndOccurrences(jobs, (job) => job.company, endOccurrences.jobs, date, index)
      updateEndOccurrences(locations, (location) => location.name, endOccurrences.locations, date, index)
    })

    return {
      sortedItems,
      eras,
      locations,
      jobs,
      endOccurrences
    }
  }, [items])

  // Get context for a specific item
  const getContextForItem = (item: TimelineItem, itemIndex: number): TimelineContext => {
    const date = getItemDate(item)

    // Find the active era, location, and job (taking the first active one if there are multiple)
    const activeEra = eras.find((era) => isActiveAtDate(era, date))
    const activeLocation = locations.find((loc) => isActiveAtDate(loc, date))
    const activeJob = jobs.find((job) => isActiveAtDate(job, date))

    // Calculate significance from the item or use default value
    const significance = 'significance' in item ? item.significance || 3 : 3

    // Calculate the ends of eras, locations, and jobs
    const isEndOfEra = activeEra ? endOccurrences.eras[activeEra.title] === itemIndex : false
    const isEndOfJob = activeJob ? endOccurrences.jobs[activeJob.company] === itemIndex : false
    const isEndOfLocation = activeLocation ? endOccurrences.locations[activeLocation.name] === itemIndex : false

    return {
      activeEra,
      activeLocation,
      activeJob,
      authorAge: getAuthorAge(date),
      significance,
      isEndOfEra,
      isEndOfJob,
      isEndOfLocation
    }
  }

  return {
    sortedItems,
    eras,
    locations,
    jobs,
    activeItem,
    setActiveItem,
    isActiveAtDate,
    getContextForItem
  }
}
