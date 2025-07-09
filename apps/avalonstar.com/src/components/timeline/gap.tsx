import type { FC } from 'react'
import type { TimelineItemProps, TimelineGap } from '@/types/timeline'
import { EraLine, JobLine, LocationLine } from './lines'

export const Gap: FC<TimelineItemProps<TimelineGap>> = ({ item, itemIndex, context, onActivate }) => {
  return (
    <div data-index={itemIndex} className="col-span-6 grid grid-cols-subgrid" onClick={onActivate}>
      <EraLine {...context} />
      <JobLine {...context} />
      <LocationLine {...context} />
      <div className="relative flex h-full flex-col justify-between">
        <div className="bg-timeline relative -mt-[1px] h-[1px] w-3" />
        <div className="text-timeline text-[10px] font-bold uppercase" style={{ writingMode: 'vertical-lr' }}>
          GAP
        </div>
        <div className="bg-timeline h-[1px] w-3" />
      </div>
      <div className="hidden sm:block"></div>
      <div className="col-span-2 col-start-5 py-6 pr-8 pl-4 sm:col-span-1 sm:col-start-6 sm:pl-2">
        <time dateTime={item.date.toISOString()} className="font-caps font-xs text-graphite">
          {'date' in item &&
            item.date.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
        </time>
        <h2 className="font-bold">{item.title}</h2>
        <p className="text-mist max-w-prose pr-4">{item.description}</p>
      </div>
    </div>
  )
}
