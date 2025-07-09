import { Fragment } from 'react'
import { useTimelineData } from '@/hooks/useTimelineData'
import type { 
  TimelineItem, 
  TimelineContext, 
  TimelineEra, 
  TimelineGap, 
  TimelineJob, 
  TimelineLocation, 
  TimelinePost 
} from '@/types/timeline'

import { Era } from './era'
import { Gap } from './gap'
import { Job } from './job'
import { Location } from './location'
import { Post } from './post'

import { LocationIcon } from '@/components/location-icon'
import { JobIcon } from '@/components/job-icon'
import { EraIcon } from '@/components/era-icon'

interface RenderTimelineItemProps {
  item: TimelineItem
  itemIndex: number
  context: TimelineContext
  setActiveItem: (id: string | null) => void
}

const renderTimelineItem = ({ item, itemIndex, context, setActiveItem }: RenderTimelineItemProps) => {
  const itemId = `${item.type}-${itemIndex}`

  const componentMap = {
    era: () => (
      <Era
        item={item as TimelineEra}
        itemIndex={itemIndex}
        context={context}
        onActivate={() => setActiveItem(itemId)}
      />
    ),
    gap: () => (
      <Gap
        item={item as TimelineGap}
        itemIndex={itemIndex}
        context={context}
        onActivate={() => setActiveItem(itemId)}
      />
    ),
    job: () => (
      <Job
        item={item as TimelineJob}
        itemIndex={itemIndex}
        context={context}
        onActivate={() => setActiveItem(itemId)}
      />
    ),
    location: () => (
      <Location
        item={item as TimelineLocation}
        itemIndex={itemIndex}
        context={context}
        onActivate={() => setActiveItem(itemId)}
      />
    ),
    post: () => (
      <Post
        item={item as TimelinePost}
        itemIndex={itemIndex}
        context={context}
        onActivate={() => setActiveItem(itemId)}
      />
    ),
    default: () => (
      <div className="">
        Unknown item type: {item.type}: {JSON.stringify(item)}
      </div>
    )
  }

  const renderFunction = componentMap[item.type as keyof typeof componentMap] || componentMap.default
  return renderFunction()
}

export default function Timeline({ items }: { items: TimelineItem[] }) {
  const { sortedItems, setActiveItem, getContextForItem } = useTimelineData(items)

  return (
    <>
      <div className="col-span-6 grid grid-cols-subgrid items-start align-baseline text-white/10">
        <div>
          <EraIcon className="size-3.5" />
        </div>
        <div>
          <JobIcon className="size-3.5" />
        </div>
        <div>
          <LocationIcon className="size-3.5" />
        </div>
        <div className="self-stretch">
          <div className="border-timeline h-full w-[1px] border-l" />
        </div>
        <div className="hidden sm:block"></div>
        <div className="col-span-2 col-start-5 pb-6 pl-4 sm:col-span-1 sm:col-start-6 sm:pl-2">
          <h2 className="font-xs font-caps uppercase">The Timeline Begins</h2>
        </div>
      </div>

      {sortedItems.map((item, itemIndex) => {
        const context = getContextForItem(item, itemIndex)

        // Get next item for display context
        const nextItem = itemIndex < sortedItems.length - 1 ? sortedItems[itemIndex + 1] : null
        const nextItemContext = nextItem ? getContextForItem(nextItem, itemIndex + 1) : undefined

        const enhancedContext: TimelineContext = {
          ...context,
          nextItem: nextItem || undefined,
          nextItemContext
        }

        return (
          <Fragment key={`${item.type}-${itemIndex}`}>
            {renderTimelineItem({
              item,
              itemIndex,
              context: enhancedContext,
              setActiveItem
            })}
          </Fragment>
        )
      })}
    </>
  )
}
