import type { FC } from 'react'
import type { TimelineItemProps } from '@/types/timeline'

export const Event: FC<TimelineItemProps> = ({
  item,
  itemIndex,
  context,
  isActive,
  onActivate
}) => {
  return (
    <div
      className="border-mist col-span-5 my-1 grid grid-cols-subgrid border-t"
      onClick={onActivate}
    >
      <div className="col-span-5">
        <div className="p-2">{item.title}</div>
      </div>
    </div>
  )
}
