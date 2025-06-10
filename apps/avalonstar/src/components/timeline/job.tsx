import type { FC } from 'react'
import type { TimelineItemProps, TimelineJob } from '@/types/timeline'
import { EraLine, JobLine, LocationLine } from './lines'

export const Job: FC<TimelineItemProps<TimelineJob>> = ({ item, itemIndex, context, onActivate }) => {
  return (
    <div data-index={itemIndex} className="col-span-6 grid grid-cols-subgrid" onClick={onActivate}>
      <EraLine {...context} />
      <JobLine {...context} />
      <LocationLine {...context} />
      <div className="border-timeline relative h-full">
        <div className="border-timeline h-full w-[1px] border-l" />
      </div>
      <div className="border-timeline hidden sm:block"></div>
      <div className="border-timeline col-span-2 col-start-5 bg-no-repeat pl-4 sm:col-span-1 sm:col-start-6 sm:pl-2">
        <div className="font-bold uppercase">
          <div className="relative inline-block py-6 text-xs">
            <div>{item.title}</div>
            <div style={{ color: item.color }}>{item.company}</div>
            <span className="absolute top-4 left-0 h-[1px] w-full" style={{ backgroundColor: item.color }}></span>
          </div>
        </div>
      </div>
    </div>
  )
}
