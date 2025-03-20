import type { FC } from 'react'
import type { TimelineItemProps } from '@/types/timeline'
import { EraLine, JobLine, LocationLine } from './lines'

export const Era: FC<TimelineItemProps> = ({ item, itemIndex, context, isActive, onActivate }) => {
  return (
    <div data-index={itemIndex} className="col-span-6 grid grid-cols-subgrid" onClick={onActivate}>
      <EraLine {...context} />
      <JobLine {...context} />
      <LocationLine {...context} />
      <div className="border-timeline relative h-full border-b">
        <div className="border-timeline h-full w-[1px] border-l" />
      </div>
      <div className="border-timeline hidden border-b sm:block"></div>
      <div className="border-timeline col-span-2 col-start-5 border-b pl-4 sm:col-span-1 sm:col-start-6 sm:pl-2">
        <div className="text-sm font-bold uppercase">
          <span className="relative inline-block py-6" style={{ color: item.color }}>
            {item.title}
            <span className="absolute -bottom-[1px] left-0 h-0.5 w-full" style={{ backgroundColor: item.color }}></span>
          </span>
        </div>
      </div>
    </div>
  )
}
