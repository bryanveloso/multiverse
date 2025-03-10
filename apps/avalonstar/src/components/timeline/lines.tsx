import type { FC } from "react";
import type { TimelineContext } from "../../types/timeline";

export const EraLine: FC<TimelineContext> = (context) => {
  const { activeEras, isEndOfEra } = context

  return (
    <div className="h-full relative">
      {activeEras[0] ? (
        <div
          className="border-l w-[1px] h-full"
          style={{ borderColor: activeEras[0]?.color }}
        ></div>
      ) : (
        <div></div>
      )}
      {isEndOfEra &&
        activeEras.map((era) => (
          <div
            key={era.title}
            className="absolute text-[0.5rem] font-bold whitespace-nowrap top-0 uppercase"
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
    <div className="m-auto h-full relative">
      {activeJobs[0] ? (
        <div
          className="border-r w-[1px] h-full"
          style={{ borderColor: activeJobs[0]?.color }}
        ></div>
      ) : (
        <div></div>
      )}
      {isEndOfJob &&
        activeJobs.map((job) => (
          <div
            key={job.title}
            className="absolute text-[0.5rem] font-bold whitespace-nowrap top-0 uppercase"
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
    <div className="m-auto h-full relative">
      {activeLocations[0] ? (
        <div
          className="border-r w-[1px] h-full"
          style={{ borderColor: activeLocations[0]?.color }}
        ></div>
      ) : (
        <div></div>
      )}
      {isEndOfLocation &&
        activeLocations.map((location) => (
          <div
            key={location.title}
            className="absolute text-[0.5rem] font-bold whitespace-nowrap top-0 uppercase"
            style={{ color: location.color, writingMode: 'vertical-lr' }}
          >
            {location.title}
          </div>
        ))}
    </div>
  )
}
