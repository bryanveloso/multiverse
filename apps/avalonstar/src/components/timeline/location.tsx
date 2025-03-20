import type { FC } from 'react'
import type { TimelineItemProps } from '@/types/timeline'
import { EraLine, JobLine, LocationLine } from './lines'

export const Location: FC<TimelineItemProps> = ({ item, itemIndex, context, isActive, onActivate }) => {
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
        <div className="py-6 text-xs font-bold uppercase">{item.name}</div>
      </div>
    </div>
  )
}
