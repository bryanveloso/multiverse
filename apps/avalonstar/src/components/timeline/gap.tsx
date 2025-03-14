import type { FC } from 'react'
import type { TimelineItemProps } from '@/types/timeline'
import { EraLine, JobLine, LocationLine } from './lines'

export const Gap: FC<TimelineItemProps> = ({ item, itemIndex, context, isActive, onActivate }) => {
  return (
    <div data-index={{ itemIndex }} className="col-span-5 grid grid-cols-subgrid" onClick={onActivate}>
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
      <div className="p-4 py-6">
        <time className="font-caps font-xs text-graphite">
          {'date' in item &&
            item.date.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
        </time>
        <h2 className="font-bold">{item.title}</h2>
        <p className="dark:text-mist max-w-prose">{item.description}</p>
      </div>
    </div>
  )
}
