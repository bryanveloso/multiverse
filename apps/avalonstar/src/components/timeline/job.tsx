import type { FC } from 'react'
import type { TimelineItemProps } from '@/types/timeline'
import { EraLine, JobLine, LocationLine } from './lines'

export const Job: FC<TimelineItemProps> = ({ item, itemIndex, context, isActive, onActivate }) => {
  return (
    <div data-index={{ itemIndex }} className="col-span-5 grid grid-cols-subgrid" onClick={onActivate}>
      <EraLine {...context} />
      <JobLine {...context} />
      <LocationLine {...context} />
      <div className="dark:border-timeline relative h-full border-b">
        <div className="dark:border-timeline h-full w-[1px] border-l" />
      </div>
      <div className="dark:border-timeline border-b">
        <div className="p-4 py-6 text-xs font-bold uppercase">
          <div>{item.title}</div>
          <div>{item.company}</div>
        </div>
      </div>
    </div>
  )
}
