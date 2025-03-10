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
      className="grid col-span-5 grid-cols-subgrid border-t border-amber-500"
      onClick={onActivate}
    >
      <div className="col-span-5">
        <div className="p-2">{item.title}</div>
      </div>
    </div>
  )
}
