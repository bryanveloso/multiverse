import { useMemo, useState } from 'react'
import type {
  TimelineItem,
  TimelinePost,
  TimelineEra,
  TimelineLocation,
  TimelineJob,
  TimelineGap,
  TimelineContext
} from '@/types/timeline'
import { getAuthorAge } from '@/utils/age'

export function useTimelineData(items: TimelineItem[]) {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  // Function to check if an item is active at a given date
  const isActiveAtDate = (item: TimelineEra | TimelineLocation | TimelineJob, date: Date) => {
    const endDate = item.endDate || new Date()
    return date >= item.startDate && date <= endDate
  }

  // Memoize processed data to avoid recalculation on re-renders
  const { sortedItems, eras, locations, jobs, endOccurrences } = useMemo(() => {
    // Filter and sort items by type
    const posts = items
      .filter((item): item is TimelinePost => item.type === 'post')
      .sort((a, b) => b.date.getTime() - a.date.getTime())

    const gaps = items
      .filter((item): item is TimelineGap => item.type === 'gap')
      .sort((a, b) => b.date.getTime() - a.date.getTime())

    const eras = items
      .filter((item): item is TimelineEra => item.type === 'era')
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())

    const locations = items
      .filter((item): item is TimelineLocation => item.type === 'location')
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())

    const jobs = items
      .filter((item): item is TimelineJob => item.type === 'job')
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())

    // Create events for each era, location, and job
    const eraEvents = eras.map((era) => ({
      type: 'era' as const,
      title: `${era.title}`,
      date: era.startDate,
      color: era.color || '#6B7280',
      data: era
    }))

    const locationEvents = locations.map((location) => ({
      type: 'location' as const,
      title: `Moved to ${location.name}`,
      date: location.startDate,
      color: location.color || '#3B82F6',
      data: location
    }))

    const jobEvents = jobs.map((job) => ({
      type: 'job' as const,
      title: job.title,
      company: job.company,
      date: job.startDate,
      color: job.color || '#10B981',
      data: job
    }))

    // Combine and sort all items by date
    const sortedItems = [...posts, ...gaps, ...eraEvents, ...locationEvents, ...jobEvents].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    )

    // Calculate end occurances for eras, locations, and jobs
    const endOccurrences = {
      eras: {} as Record<string, number>,
      jobs: {} as Record<string, number>,
      locations: {} as Record<string, number>
    }

    eras.forEach((era) => {
      if (!era.endDate) {
        endOccurrences.eras[era.title] = 0
      }
    })

    locations.forEach((location) => {
      if (!location.endDate) {
        endOccurrences.locations[location.name] = 0
      }
    })

    jobs.forEach((job) => {
      if (!job.endDate) {
        endOccurrences.jobs[job.company] = 0
      }
    })

    sortedItems.forEach((item, index) => {
      const date =
        'date' in item ? item.date : 'startDate' in item ? (item as { startDate: Date }).startDate : new Date()

      // For each active context item, record this as the first occurrence
      // if we haven't seen it before
      eras.forEach((era) => {
        if (era.endDate && isActiveAtDate(era, date) && !endOccurrences.eras[era.title]) {
          endOccurrences.eras[era.title] = index
        }
      })

      // Similar for jobs and locations
      jobs.forEach((job) => {
        if (job.endDate && isActiveAtDate(job, date) && !endOccurrences.jobs[job.company]) {
          endOccurrences.jobs[job.company] = index
        }
      })

      locations.forEach((location) => {
        if (location.endDate && isActiveAtDate(location, date) && !endOccurrences.locations[location.name]) {
          endOccurrences.locations[location.name] = index
        }
      })
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
    const date = 'date' in item ? item.date : 'startDate' in item ? item.startDate : new Date()

    // Filter active eras, locations, and jobs
    const activeEras = eras.filter((era) => isActiveAtDate(era, date))
    const activeLocations = locations.filter((loc) => isActiveAtDate(loc, date))
    const activeJobs = jobs.filter((job) => isActiveAtDate(job, date))

    // Calculate significance from the item or use default value
    const significance = 'significance' in item ? item.significance || 3 : item.type === 'event' ? 5 : 3

    // Calculate the ends of eras, locations, and jobs
    const isEndOfEra = activeEras.some((era) => endOccurrences.eras[era.title] === itemIndex)
    const isEndOfJob = activeJobs.some((job) => endOccurrences.jobs[job.company] === itemIndex)
    const isEndOfLocation = activeLocations.some((loc) => endOccurrences.locations[loc.name] === itemIndex)

    return {
      activeEras,
      activeLocations,
      activeJobs,
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
