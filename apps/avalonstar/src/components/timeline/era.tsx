import type { FC } from 'react'
import type { TimelineEra } from '../../types/timeline'

export const Era: FC<{
  item: TimelineEra
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
