import type { FC } from 'react'
import type { TimelineItemProps } from '@/types/timeline'
import { cn } from '@/utils/style'

import { EraLine, JobLine, LocationLine } from './lines'

export const Post: FC<TimelineItemProps> = ({ item, context, isActive, onActivate }) => {
  const href = `/blog/${item.id.substring(0, 4)}/${item.id.split('-').slice(3).join('-')}`

  return (
    <div className="col-span-5 grid grid-cols-subgrid" onClick={onActivate}>
      <EraLine {...context} />
      <JobLine {...context} />
      <LocationLine {...context} />
      <div className="relative h-full">
        {/* <div className="size-[9px] bg-mist rounded-full absolute -left-[4px] top-2" /> */}
        <div className="h-full w-[1px] border-l dark:border-white/20" />
      </div>
      <div className="p-4">
        <time className="font-caps font-xs">
          {'date' in item &&
            item.date.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
        </time>
        <h2
          className={cn('dark:text-white', {
            'text-2xl': item.significance >= 4
          })}
        >
          <a href={href}>{item.title}</a>
        </h2>
        {item.significance > 3 && <p className="dark:text-mist max-w-prose text-pretty">{item.description}</p>}
      </div>
    </div>
  )
}
