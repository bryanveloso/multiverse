import type { FC } from 'react'
import type { TimelineItemProps } from '../../types/timeline'

export const Event: FC<TimelineItemProps> = ({
  item,
  itemIndex,
  context,
  isActive,
  onActivate
}) => {
  return (
    <div className="grid col-span-5 grid-cols-subgrid" onClick={onActivate}>
      <div className="col-span-5 border-t border-amber-500">{item.title}</div>
    </div>
  )
}
