import { useMemo, useState } from 'react'
import { getAuthorAge } from '../utils/age'
import type {
  TimelineItem,
  TimelinePost,
  TimelineEra,
  TimelineLocation,
  TimelineJob,
  TimelineGap,
  TimelineContext
} from '../types/timeline'

export function useTimelineData(items: TimelineItem[]) {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  // Memoize processed data to avoid recalculation on re-renders
  const { sortedItems, eras, locations, jobs } = useMemo(() => {
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
      type: 'event' as const,
      title: `${era.title}`,
      date: era.startDate,
      color: era.color || '#6B7280',
      data: era
    }))

    const locationEvents = locations.map((location) => ({
      type: 'event' as const,
      title: `Moved to ${location.name}`,
      date: location.startDate,
      color: location.color || '#3B82F6',
      data: location
    }))

    const jobEvents = jobs.map((job) => ({
      type: 'event' as const,
      title: `Started at ${job.company} as ${job.title}`,
      date: job.startDate,
      color: '#10B981',
      data: job
    }))

    // Combine and sort all items by date
    const sortedItems = [
      ...posts,
      ...gaps,
      ...eraEvents,
      ...locationEvents,
      ...jobEvents
    ].sort((a, b) => b.date.getTime() - a.date.getTime())

    return {
      sortedItems,
      eras,
      locations,
      jobs
    }
  }, [items])

  // Function to check if an item is active at a given date
  const isActiveAtDate = (
    item: TimelineEra | TimelineLocation | TimelineJob,
    date: Date
  ) => {
    const endDate = item.endDate || new Date()
    return date >= item.startDate && date <= endDate
  }

  // Get context for a specific item
  const getContextForItem = (item: TimelineItem): TimelineContext => {
    const date =
      'date' in item
        ? item.date
        : 'startDate' in item
          ? item.startDate
          : new Date()

    // Calculate significance from the item or use default value
    const significance =
      'significance' in item
        ? item.significance || 3
        : item.type === 'event'
          ? 5
          : 3

    return {
      activeEras: eras.filter((era) => isActiveAtDate(era, date)),
      activeLocations: locations.filter((loc) => isActiveAtDate(loc, date)),
      activeJobs: jobs.filter((job) => isActiveAtDate(job, date)),
      authorAge: getAuthorAge(date),
      significance
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
