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
    <div className="grid col-span-5 grid-cols-subgrid" onClick={onActivate}>
      <EraLine {...context} />
      <JobLine {...context} />
      <LocationLine {...context} />
      <div className="m-auto h-full relative">
        <div className=" bg-mist rounded absolute -left-[4px] top-2 uppercase text-[10px] p-1">
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
