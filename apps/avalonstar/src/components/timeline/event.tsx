import type { FC } from 'react'
import type { TimelineItemProps } from '@/types/timeline'
import { EraLine, JobLine, LocationLine } from './lines'

export const Event: FC<TimelineItemProps> = ({
  item,
  itemIndex,
  context,
  isActive,
  onActivate
}) => {
  return (
    <div className="col-span-5 grid grid-cols-subgrid" onClick={onActivate}>
      <EraLine {...context} />
      <JobLine {...context} />
      <LocationLine {...context} />
      <div className="relative h-full border-b dark:border-white/10">
        <div className="h-full w-[1px] border-l dark:border-white/20" />
      </div>
      <div className="border-b dark:border-white/10">
        <div className="p-4 uppercase text-xs font-bold">
          {item.type === 'era' && <span>item.title</span>}
          {item.era && item.title}
        </div>
      </div>
    </div>
  )
}
