import { Fragment, type FC } from 'react'
import { useTimelineData } from '@/hooks/useTimelineData'
import type { TimelineItem, TimelineContext } from '@/types/timeline'

import { Event } from './event'
import { Post } from './post'
import { Gap } from './gap'

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
    event: () => (
      <Event
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
    post: () => (
      <Post
        item={item}
        itemIndex={itemIndex}
        context={context}
        isActive={isActive}
        onActivate={() => setActiveItem(itemId)}
      />
    ),
    default: () => <div className="">Unknown item type: {item.type}</div>
  }

  const renderFunction = componentMap[item.type as keyof typeof componentMap] || componentMap.default
  return renderFunction()
}

export default function Timeline({ items }: { items: TimelineItem[] }) {
  const { sortedItems, activeItem, setActiveItem, getContextForItem } = useTimelineData(items)

  return (
    <>
      <div className="col-span-5 grid grid-cols-subgrid">
        <div>E</div>
        <div>J</div>
        <div>L</div>
        <div></div>
        <div></div>
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
