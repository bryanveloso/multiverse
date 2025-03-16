import type { FC } from 'react'
import type { TimelineItemProps } from '@/types/timeline'
import { EraLine, JobLine, LocationLine } from './lines'

export const Job: FC<TimelineItemProps> = ({ item, itemIndex, context, isActive, onActivate }) => {
  return (
    <div data-index={itemIndex} className="col-span-6 grid grid-cols-subgrid" onClick={onActivate}>
      <EraLine {...context} />
      <JobLine {...context} />
      <LocationLine {...context} />
      <div className="dark:border-timeline relative h-full border-b">
        <div className="dark:border-timeline h-full w-[1px] border-l" />
      </div>
      <div className="dark:border-timeline border-b"></div>
      <div className="dark:border-timeline border-b">
        <div className="px-2 font-bold uppercase">
          <div className="relative inline-block py-6 text-xs">
            <div>{item.title}</div>
            <div style={{ color: item.color }}>{item.company}</div>
            <span className="absolute -bottom-[1px] left-0 h-0.5 w-full" style={{ backgroundColor: item.color }}></span>
          </div>
        </div>
      </div>
    </div>
  )
}
