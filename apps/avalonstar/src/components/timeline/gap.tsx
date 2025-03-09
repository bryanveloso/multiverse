import type { FC } from 'react'
import type { TimelineItemProps } from '../../types/timeline'

export const Gap: FC<TimelineItemProps> = ({
  item,
  itemIndex,
  context,
  isActive,
  onActivate
}) => {
  console.log(context);

  return (
    <div className="grid col-span-5 grid-cols-subgrid" onClick={onActivate}>
      <div className="relative">1</div>
      <div className="relative">2</div>
      <div className="relative">3</div>
      <div className="m-auto h-full relative">
        <div className="size-[9px] bg-amber-500 rounded-full absolute -left-[4px] top-2" />
        <div className="border-l border-amber-500 w-[1px] h-full" />
      </div>
      <div className="">
        {item.title} /{' '}
        {'date' in item &&
          item.date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
      </div>
    </div>
  )
}
