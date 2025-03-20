// Base type shared by all timeline items
interface BaseTimelineItem {
  id?: string // Unique identifier
  type: string // Discriminator for the union
  title: string // Display title
  description?: string // Optional description
  color?: string // Optional styling color
  significance?: number // Optional importance value
  slug?: string // Optional slug
}

// Items with a single point in time
interface TimelinePointItem extends BaseTimelineItem {
  date: Date
}

// Items with a date range
interface TimelineRangeItem extends BaseTimelineItem {
  startDate: Date
  endDate?: Date
}

// Specific item types
interface TimelinePost extends TimelinePointItem {
  type: 'post'
  id: string // Required for posts
  crosspost?: boolean
}

interface TimelineGap extends TimelinePointItem {
  type: 'gap'
}

interface TimelineEra extends TimelineRangeItem {
  type: 'era'
}

interface TimelineLocation extends TimelineRangeItem {
  type: 'location'
  name: string
}

interface TimelineJob extends TimelineRangeItem {
  type: 'job'
  company: string
  title: string
}

// Union of all direct timeline items
export type TimelineItem = TimelinePost | TimelineGap | TimelineEra | TimelineLocation | TimelineJob | TimelineEvent

// Context data for a specific timelin e point
export interface TimelineContext {
  activeEras: TimelineEra[]
  activeLocations: TimelineLocation[]
  activeJobs: TimelineJob[]
  authorAge: number
  significance: number
  isEndOfEra: boolean
  isEndOfJob: boolean
  isEndOfLocation: boolean
  nextItem?: TimelineItem
  nextItemContext?: TimelineContext
}

// Component props with proper generics
export interface TimelineItemProps<T extends TimelineItem = TimelineItem> {
  item: T
  itemIndex: number // Using itemIndex instead of index
  context: TimelineContext // Added context
  isActive: boolean
  onActivate: () => void
}
