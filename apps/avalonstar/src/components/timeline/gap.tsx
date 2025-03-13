import type { FC } from 'react'
import type { TimelineItemProps } from '@/types/timeline'
import { EraLine, JobLine, LocationLine } from './lines'

export const Gap: FC<TimelineItemProps> = ({ item, context, isActive, onActivate }) => {
  return (
    <div className="col-span-5 grid grid-cols-subgrid" onClick={onActivate}>
      <EraLine {...context} />
      <JobLine {...context} />
      <LocationLine {...context} />
      <div className="relative h-full flex flex-col justify-between">
        <div className="h-[1px] w-3 bg-white/20 relative -mt-[1px]" />
        <div
          className="text-[10px] uppercase font-bold text-white/20"
          style={{ writingMode: 'vertical-lr' }}
        >
          GAP
        </div>
        <div className="h-[1px] w-3 bg-white/20" />
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
