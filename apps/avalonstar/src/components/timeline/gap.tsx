import type { FC } from 'react'
import type { TimelineItemProps } from '@/types/timeline'
import { EraLine, JobLine, LocationLine } from './lines'

export const Gap: FC<TimelineItemProps> = ({
  item,
  context,
  isActive,
  onActivate
}) => {
  return (
    <div className="col-span-5 grid grid-cols-subgrid" onClick={onActivate}>
      <EraLine {...context} />
      <JobLine {...context} />
      <LocationLine {...context} />
      <div className="relative h-full">
        <div className="bg-mist absolute top-2 -left-[4px] rounded p-1 text-[10px] uppercase">
          <span>GAP</span>
        </div>
        {/* <div className="border-l border-mist w-[1px] h-full" /> */}
      </div>
      <div className="p-4">
        <h2 className="font-bold">{item.title}</h2>
        <time>
          {'date' in item &&
            item.date.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
        </time>
        <p className="">{item.description}</p>
      </div>
    </div>
  )
}
