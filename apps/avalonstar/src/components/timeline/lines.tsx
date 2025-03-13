import type { FC } from 'react'
import type { TimelineContext } from '@/types/timeline'

export const EraLine: FC<TimelineContext> = (context) => {
  const { activeEras, isEndOfEra } = context

  return (
    <div className="relative h-full">
      {activeEras[0] ? (
        <div
          className="h-full w-[1px] border-l"
          style={{ borderColor: activeEras[0]?.color }}
        ></div>
      ) : (
        <div className="h-full w-[1px] border-r border-white/10"></div>
      )}
      {isEndOfEra &&
        activeEras.map((era) => (
          <div
            key={era.title}
            className="absolute top-0 pl-1 text-[0.5rem] font-bold whitespace-nowrap uppercase"
            style={{ color: era.color, writingMode: 'vertical-lr' }}
          >
            {era.title}
          </div>
        ))}
    </div>
  )
}

export const JobLine: FC<TimelineContext> = (context) => {
  const { activeJobs, isEndOfJob } = context

  return (
    <div className="relative h-full">
      {activeJobs[0] ? (
        <div
          className="h-full w-[1px] border-r"
          style={{ borderColor: activeJobs[0]?.color }}
        ></div>
      ) : (
        <div className="h-full w-[1px] border-r border-white/10"></div>
      )}
      {isEndOfJob &&
        activeJobs.map((job) => (
          <div
            key={job.title}
            className="absolute top-0 pl-1 text-[0.5rem] font-bold whitespace-nowrap uppercase"
            style={{ color: job.color, writingMode: 'vertical-lr' }}
          >
            {job.company}
          </div>
        ))}
    </div>
  )
}

export const LocationLine: FC<TimelineContext> = (context) => {
  const { activeLocations, isEndOfLocation } = context

  return (
    <div className="relative h-full">
      {activeLocations[0] ? (
        <div
          className="h-full w-[1px] border-l"
          style={{ borderColor: activeLocations[0]?.color }}
        ></div>
      ) : (
        <div className="h-full w-[1px] border-r border-white/10"></div>
      )}
      {isEndOfLocation &&
        activeLocations.map((location) => (
          <div
            key={location.name}
            className="absolute top-0 pl-1 text-[0.5rem] font-bold whitespace-nowrap uppercase"
            style={{ color: location.color, writingMode: 'vertical-lr' }}
          >
            {location.name}
          </div>
        ))}
    </div>
  )
}
