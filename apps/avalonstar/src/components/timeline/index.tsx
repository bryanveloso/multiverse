import { useState } from 'react'

import { useTimelineData } from '../../hooks/useTimelineData'
import { getAuthorAge } from '../../utils/age'

import type {
  TimelineItem,
  TimelinePost,
  TimelineEra,
  TimelineLocation,
  TimelineJob,
  TimelineGap
} from '../../types/timeline'

import { Event } from './event'

export default function Timeline({ items }: { items: TimelineItem[] }) {
  const { sortedItems, activeItem, setActiveItem, getContextForDate } = useTimelineData(items)

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-[24px_24px_24px_16px_1fr]">
        <div className="grid col-span-5 grid-cols-subgrid">
          <div>E</div>
          <div>J</div>
          <div>L</div>
          <div>T</div>
          <div>P</div>
        </div>

        {sortedItems.map((item, itemIndex) => {
          const context = getContextForDate(item.date)
          const isActive = activeItem === `${item.type}-${itemIndex}`
          console.log(`context for ${item.date}`, context)

          if (item.type === 'event') {
            return <Event item={item} itemIndex={itemIndex} />
          } else {
            return (
              <div
                className="grid col-span-5 grid-cols-subgrid items-stretch"
                key={`${item.type}-${itemIndex}`}
              >
                <div className="relative">1</div>
                <div className="relative">2</div>
                <div className="relative">3</div>
                <div className="m-auto h-full relative">
                  <div className="size-[9px] bg-amber-500 rounded-full absolute -left-[4px] top-2" />
                  <div className="border-l border-amber-500 w-[1px] h-full" />
                </div>
                <div className="">
                  {item.title} /{' '}
                  {item.date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            )
          }
        })}
      </div>

    </div>
  )
}
