import { Fragment, type FC } from 'react'
import { useTimelineData } from '@/hooks/useTimelineData'
import type { TimelineItem, TimelineContext } from '@/types/timeline'

import { Era } from './era'
import { Gap } from './gap'
import { Job } from './job'
import { Location } from './location'
import { Post } from './post'

interface RenderTimelineItemProps {
  item: TimelineItem
  itemIndex: number
  context: TimelineContext
  activeItem: string | null
  setActiveItem: (id: string | null) => void
}

const renderTimelineItem: FC<RenderTimelineItemProps> = ({ item, itemIndex, context, activeItem, setActiveItem }) => {
  const isActive = activeItem === `${item.type}-${itemIndex}`
  const itemId = `${item.type}-${itemIndex}`

  const componentMap = {
    era: () => (
      <Era
        item={item}
        itemIndex={itemIndex}
        context={context}
        isActive={isActive}
        onActivate={() => setActiveItem(itemId)}
      />
    ),
    gap: () => (
      <Gap
        item={item}
        itemIndex={itemIndex}
        context={context}
        isActive={isActive}
        onActivate={() => setActiveItem(itemId)}
      />
    ),
    job: () => (
      <Job
        item={item}
        itemIndex={itemIndex}
        context={context}
        isActive={isActive}
        onActivate={() => setActiveItem(itemId)}
      />
    ),
    location: () => (
      <Location
        item={item}
        itemIndex={itemIndex}
        context={context}
        isActive={isActive}
        onActivate={() => setActiveItem(itemId)}
      />
    ),
    post: () => (
      <Post
        item={item}
        itemIndex={itemIndex}
        context={context}
        isActive={isActive}
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
  const { sortedItems, activeItem, setActiveItem, getContextForItem } = useTimelineData(items)

  return (
    <>
      <div className="col-span-5 grid grid-cols-subgrid items-start align-baseline">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="size-3.5 text-white/10">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M3 0c-0.55228 0 -1 0.447715 -1 1v6.5c0 0.37877 0.214 0.72503 0.55279 0.89443L9.76393 12l-7.21114 3.6056C2.214 15.775 2 16.1212 2 16.5V23c0 0.5523 0.44772 1 1 1h18c0.5523 0 1 -0.4477 1 -1v-6.5c0 -0.3788 -0.214 -0.725 -0.5528 -0.8944L14.2361 12l7.2111 -3.60557C21.786 8.22503 22 7.87877 22 7.5V1c0 -0.552285 -0.4477 -1 -1 -1H3Zm2.27775 7.52084L12 5l6.7222 2.52084L20 6.88197V2H4v4.88197l1.27775 0.63887ZM4 17.118l8 -4 8 4V22H4v-4.882Z"
              clipRule="evenodd"
              strokeWidth={1}
            />
          </svg>
        </div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="size-3.5 text-white/10">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M8 0c-0.55228 0 -1 0.447715 -1 1v4H1c-0.552285 0 -1 0.44772 -1 1v9c0 0.5523 0.447715 1 1 1v7c0 0.5523 0.44772 1 1 1h20c0.5523 0 1 -0.4477 1 -1v-7c0.5523 0 1 -0.4477 1 -1V6c0 -0.55228 -0.4477 -1 -1 -1h-6V1c0 -0.552285 -0.4477 -1 -1 -1H8Zm7 5V2H9v3h6Zm6 11h-6v1c0 0.5523 -0.4477 1 -1 1h-4c-0.55229 0 -1 -0.4477 -1 -1v-1H3v6h18v-6Zm1 -2h-7v-1c0 -0.5523 -0.4477 -1 -1 -1h-4c-0.55229 0 -1 0.4477 -1 1v1H2V7h20v7Zm-11 2h2v-2h-2v2Z"
              clipRule="evenodd"
              strokeWidth={1}
            />
          </svg>
        </div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="size-3.5 text-white/10">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M11.4 1.2c0.3556 -0.266667 0.8444 -0.266667 1.2 0l10 7.5c0.2518 0.18885 0.4 0.48524 0.4 0.8V22c0 0.5523 -0.4477 1 -1 1H2c-0.55228 0 -1 -0.4477 -1 -1V9.5c0 -0.31476 0.14819 -0.61115 0.4 -0.8l10 -7.5ZM3 10v11h18V10l-9 -6.75L3 10Z"
              clipRule="evenodd"
              strokeWidth={1}
            />
          </svg>
        </div>
        <div className="self-stretch">
          <div className="dark:border-timeline h-full w-[1px] border-l" />
        </div>
        <div>
          <div className="font-xs font-caps px-4 pb-6 text-white/10 uppercase">The Mind of Bryan Veloso</div>
        </div>
      </div>

      {sortedItems.map((item, itemIndex) => {
        const context = getContextForItem(item, itemIndex)

        return (
          <Fragment key={`${item.type}-${itemIndex}`}>
            {renderTimelineItem({
              item,
              itemIndex,
              context,
              activeItem,
              setActiveItem
            })}
          </Fragment>
        )
      })}
    </>
  )
}
