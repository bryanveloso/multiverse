import type { FC } from 'react'
import type { TimelineItemProps, TimelinePost } from '@/types/timeline'
import { cn } from '@/utils/style'

import { EraLine, JobLine, LocationLine } from './lines'

export const Post: FC<TimelineItemProps<TimelinePost>> = ({ item, itemIndex, context, onActivate }) => {
  const href = `/blog/${item.id.substring(0, 4)}/${item.id.split('-').slice(3).join('-')}`

  return (
    <div data-index={itemIndex} className="col-span-6 grid grid-cols-subgrid" onClick={onActivate}>
      <EraLine {...context} />
      <JobLine {...context} />
      <LocationLine {...context} />
      <div className="relative h-full">
        <div className="border-timeline h-full w-[1px] border-l" />
      </div>
      <div className="hidden py-6 sm:block">
        {item.crosspost && (
          <div className="outline-royal mx-3 flex h-full items-center justify-center rounded uppercase outline">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="size-3">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M23.0001 2c0 -0.55228 -0.4477 -1 -1 -1h-7v2l4.5858 0L1.29297 21.2929l1.41421 1.4142L21.0001 4.41421V9h2V2Zm-3.4142 19 -5.7929 -5.7929 1.4142 -1.4142 5.7929 5.7929V15h2v7c0 0.5523 -0.4477 1 -1 1h-7v-2h4.5858ZM1.29297 2.70711l7.5 7.49999 1.41423 -1.41421 -7.50002 -7.5 -1.41421 1.41422Z"
                clipRule="evenodd"
                strokeWidth={1}
                className="text-royal"
              />
            </svg>
          </div>
        )}
      </div>
      <div
        className={cn(
          'col-span-2 col-start-5 pr-8 pl-4 sm:col-span-1 sm:col-start-6 sm:pl-2',
          itemIndex === 0 ? 'pb-6' : 'py-6',
          item.significance === 1 && 'opacity-20'
          // 'transition-opacity hover:opacity-100'
        )}>
        <div className="font-caps flex">
          <time dateTime={item.date.toISOString()} className="font-xs text-graphite">
            {'date' in item &&
              item.date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
          </time>
          {item.crosspost && <span className="text-royal block pl-2 sm:hidden">[crosspost]</span>}
        </div>
        <h2
          className={cn('text-white', {
            'font-heading text-xl sm:text-2xl': item.significance >= 4
          })}>
          <a href={href}>{item.title}</a>
        </h2>
        {item.heroImage && item.significance == 5 && (
          <img
            src={item.heroImage.src}
            alt={item.title}
            className="my-2 hidden aspect-[6/1] w-full rounded object-cover shadow"
          />
        )}
        {item.significance > 3 && <p className="text-mist max-w-prose text-pretty">{item.description}</p>}
        {item.significance == 3 && (
          <p className="text-mist/50 max-w-prose pt-1 text-xs text-pretty">{item.description}</p>
        )}
      </div>
    </div>
  )
}
