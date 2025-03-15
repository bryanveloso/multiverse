import type { FC } from 'react'
import type { TimelineItemProps } from '@/types/timeline'
import { EraLine, JobLine, LocationLine } from './lines'

export const Era: FC<TimelineItemProps> = ({ item, itemIndex, context, isActive, onActivate }) => {
  return (
    <div data-index={itemIndex} className="col-span-6 grid grid-cols-subgrid" onClick={onActivate}>
      <EraLine {...context} />
      <JobLine {...context} />
      <LocationLine {...context} />
      <div className="dark:border-timeline relative h-full border-b">
        <div className="dark:border-timeline h-full w-[1px] border-l" />
      </div>
      <div></div>
      <div className="dark:border-timeline border-b">
        <div className="py-6 text-xs font-bold uppercase">{item.title}</div>
      </div>
    </div>
  )
}
