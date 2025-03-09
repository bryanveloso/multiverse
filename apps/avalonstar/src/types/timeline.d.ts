export interface TimelinePost {
  type: 'post'
  title: string
  date: Date
  description?: string
  slug?: string
  id?: string
  significance?: number
}

export interface TimelineEra {
  type: 'era'
  title: string
  startDate: Date
  endDate: Date
  description: string
  color?: string
}

export interface TimelineLocation {
  type: 'location'
  name: string
  startDate: Date
  endDate?: Date
  description?: string
  color?: string
}

export interface TimelineJob {
  type: 'job'
  company: string
  title: string
  startDate: Date
  endDate?: Date
  description?: string
}

export interface TimelineGap {
  type: 'gap'
  title: string
  date: Date
  description?: string
  color?: string
  significance?: number
}

export interface TimelineEvent {
  type: 'event'
  title: string
  date: Date
  color: string
  data: TimelineEra | TimelineLocation | TimelineJob
}

export type TimelineItem =
  | TimelinePost
  | TimelineEra
  | TimelineLocation
  | TimelineJob
  | TimelineGap
  | TimelineEvent

// Processed timeline data with sorted items and active contexts
export interface ProcessedTimelineData {
  sortedItems: (TimelinePost | TimelineGap | TimelineEvent)[]
  eras: TimelineEra[]
  locations: TimelineLocation[]
  jobs: TimelineJob[]
}

// Context data for a specific timeline point
export interface TimelineContext {
  activeEras: TimelineEra[]
  activeLocations: TimelineLocation[]
  activeJobs: TimelineJob[]
  authorAge: string
}

// Props for timeline components
export interface TimelineItemProps {
  item: TimelinePost | TimelineGap | TimelineEvent
  itemIndex: number
  context: TimelineContext
  isActive: boolean
  onActivate: (id: string) => void
}
