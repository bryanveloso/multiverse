import type { FC } from "react";
import type { TimelineContext } from "../../types/timeline";

export const EraLine: FC<TimelineContext> = (context) => { 
  const { activeEras } = context;
  console.log(activeEras[0]?.color)
  
  return (
    <div className="m-auto h-full relative">
      {activeEras[0] ? (
        <div
          className="border-r w-[1px] h-full"
          style={{ borderColor: activeEras[0]?.color }}
        ></div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export const JobLine: FC<TimelineContext> = (context) => { 
  const { activeJobs } = context;
  console.log(activeJobs[0]?.color)
  
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
    </div>
  )
}

export const LocationLine: FC<TimelineContext> = (context) => { 
  const { activeLocations } = context;
  console.log(activeLocations[0]?.color)
  
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
    </div>
  )
}
