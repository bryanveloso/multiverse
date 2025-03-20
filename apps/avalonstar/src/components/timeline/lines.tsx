import type { FC } from 'react'
import type { TimelineContext } from '@/types/timeline'

export const EraLine: FC<TimelineContext> = (context) => {
  const { activeEras, isEndOfEra, nextItemContext } = context

  const getBackgroundColor = () => {
    const currentColor = activeEras[0]?.color
    const nextColor = nextItemContext?.activeEras[0]?.color
    const defaultColor = 'oklch(100% 0 0 / 10%)'

    if (currentColor && currentColor !== nextColor) {
      return {
        backgroundImage: `linear-gradient(${currentColor}, ${nextColor || defaultColor})`
      }
    }

    return { backgroundColor: currentColor || defaultColor }
  }

  return (
    <div className="relative h-full">
      <div className="h-full w-[1px]" style={getBackgroundColor()}></div>
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
  const { activeJobs, isEndOfJob, nextItemContext } = context

  const getBackgroundColor = () => {
    const currentColor = activeJobs[0]?.color
    const nextColor = nextItemContext?.activeJobs[0]?.color
    const defaultColor = 'oklch(100% 0 0 / 10%)'

    if (currentColor && currentColor !== nextColor) {
      return {
        backgroundImage: `linear-gradient(${currentColor}, ${nextColor || defaultColor})`
      }
    }

    return { backgroundColor: currentColor || defaultColor }
  }

  return (
    <div className="relative h-full">
      <div className="h-full w-[1px]" style={getBackgroundColor()}></div>
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
  const { activeLocations, isEndOfLocation, nextItemContext } = context

  const getBackgroundColor = () => {
    const currentColor = activeLocations[0]?.color
    const nextColor = nextItemContext?.activeLocations[0]?.color
    const defaultColor = 'oklch(100% 0 0 / 10%)'

    if (currentColor && currentColor !== nextColor) {
      return {
        backgroundImage: `linear-gradient(${currentColor}, ${nextColor || defaultColor})`
      }
    }

    return { backgroundColor: currentColor || defaultColor }
  }

  return (
    <div className="relative h-full">
      <div className="h-full w-[1px]" style={getBackgroundColor()}></div>
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
