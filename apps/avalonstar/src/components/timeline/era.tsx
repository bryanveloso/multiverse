import type { FC } from 'react'
import type { TimelineItemProps } from '@/types/timeline'

import { EraChangeIcon } from '../era-change-icon'
import { EraLine, JobLine, LocationLine } from './lines'

export const Era: FC<TimelineItemProps> = ({ item, itemIndex, context, isActive, onActivate }) => {
  return (
    <div data-index={itemIndex} className="col-span-6 grid grid-cols-subgrid" onClick={onActivate}>
      <EraLine {...context} />
      <JobLine {...context} />
      <LocationLine {...context} />
      <div className="relative h-full">
        <div className="border-timeline h-full w-[1px] border-l" />
      </div>
      <div className="hidden py-6 sm:block">
        <div
          className="mx-3 flex h-full items-center justify-center rounded outline"
          style={{ backgroundColor: item.color, outlineColor: item.color }}>
          <EraChangeIcon className="size-4" />
        </div>
      </div>
      <div className="col-span-2 col-start-5 py-6 pl-4 sm:col-span-1 sm:col-start-6 sm:pl-2">
        <div className="pr-8">
          <span className="font-caps text-md relative inline-block uppercase" style={{ color: item.color }}>
            {item.title} Begins
          </span>
          <p className="max-w-prose">{item.description}</p>
        </div>
      </div>
    </div>
  )
}
