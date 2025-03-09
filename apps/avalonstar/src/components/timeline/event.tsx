import type { FC } from 'react'
import type { TimelineItem } from '../../types/timeline'

export const Event: FC<{
  item: TimelineItem
  itemIndex: number
}> = ({ item, itemIndex }) => {
  return (
    <div
      className="grid col-span-5 grid-cols-subgrid"
      key={`${item.type}-${itemIndex}`}
    >
      <div className="col-span-5 border-t border-amber-500">{item.title}</div>
    </div>
  )
}
