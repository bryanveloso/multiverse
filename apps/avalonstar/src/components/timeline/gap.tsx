import type { FC } from 'react'
import type { TimelineItemProps } from '@/types/timeline'
import { EraLine, JobLine, LocationLine } from './lines'

export const Gap: FC<TimelineItemProps> = ({ item, itemIndex, context, isActive, onActivate }) => {
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
      <div className="mx-3 flex h-full items-center justify-center rounded uppercase">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="text-timeline size-3">
          <path
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 23c6.0751 0 11 -4.9249 11 -11 0 -6.07513 -4.9249 -11 -11 -11C5.92487 1 1 5.92487 1 12c0 6.0751 4.92487 11 11 11Z"
          />
          <path stroke="currentColor" strokeLinejoin="round" strokeWidth={2} d="M17 7H7v10h10V7Z" />
        </svg>
      </div>
      <div className="py-6">
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
