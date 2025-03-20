import type { FC } from 'react'
import type { TimelineContext } from '@/types/timeline'

const getBackgroundStyle = (currentColor?: string, nextColor?: string) => {
  const defaultColor = 'oklch(100% 0 0 / 10%)'

  if (currentColor && currentColor !== nextColor) {
    return {
      backgroundImage: `linear-gradient(${currentColor}, ${nextColor || defaultColor})`
    }
  }

  return { backgroundColor: currentColor || defaultColor }
}

interface TimelineLineProps {
  currentItem?: { color?: string; title?: string }
  nextItem?: { color?: string }
  isEnd: boolean
  label: string
}

const TimelineLine: FC<TimelineLineProps> = ({ currentItem, nextItem, isEnd, label }) => {
  const style = getBackgroundStyle(currentItem?.color, nextItem?.color)

  return (
    <div className="relative h-full">
      <div className="h-full w-[1px]" style={style}></div>
      {isEnd && currentItem && (
        <div
          className="absolute top-0 pl-1 text-[0.5rem] font-bold whitespace-nowrap uppercase"
          style={{ color: currentItem.color, writingMode: 'vertical-lr' }}
        >
          {label}
        </div>
      )}
    </div>
  )
}

export const EraLine: FC<TimelineContext> = (context) => {
  const { activeEra, isEndOfEra, nextItemContext } = context

  return (
    <TimelineLine
      currentItem={activeEra}
      nextItem={nextItemContext?.activeEra}
      isEnd={isEndOfEra}
      label={activeEra?.title || ''}
    />
  )
}

export const JobLine: FC<TimelineContext> = (context) => {
  const { activeJob, isEndOfJob, nextItemContext } = context

  return (
    <TimelineLine
      currentItem={activeJob}
      nextItem={nextItemContext?.activeJob}
      isEnd={isEndOfJob}
      label={activeJob?.company || ''}
    />
  )
}

export const LocationLine: FC<TimelineContext> = (context) => {
  const { activeLocation, isEndOfLocation, nextItemContext } = context

  return (
    <TimelineLine
      currentItem={activeLocation}
      nextItem={nextItemContext?.activeLocation}
      isEnd={isEndOfLocation}
      label={activeLocation?.name || ''}
    />
  )
}
