import type { FC } from 'react'
import type { TimelinePost, TimelineGap, TimelineContext } from '../../types/timeline'

interface PostProps {
  item: TimelinePost | TimelineGap
  itemIndex: number
  context: TimelineContext
  isActive: boolean
  onActivate: (id: string) => void
}

export const Post: FC<PostProps> = ({ 
  item, 
  itemIndex, 
  context, 
  isActive, 
  onActivate 
}) => {
  // Calculate opacity based on significance
  const significance = 'significance' in item ? item.significance || 3 : 3
  const opacity = 0.6 + significance * 0.08
  const { authorAge } = context
  
  return (
    <div
      className={`
        p-4 rounded-lg transition-all ml-6
        ${item.type === 'post' ? 'bg-white hover:bg-gray-50' : ''}
        ${item.type === 'gap' ? 'bg-gray-50 hover:bg-gray-100' : ''}
        ${isActive ? 'ring-2 ring-green-500' : ''}
        shadow-sm hover:shadow cursor-pointer
      `}
      style={{ opacity }}
      onClick={() => onActivate(`${item.type}-${itemIndex}`)}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
            Age: {authorAge}
          </span>
          <time className="text-sm text-gray-500">
            {item.date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
        </div>
      </div>

      {item.description && (
        <p className="text-gray-600 mt-2">{item.description}</p>
      )}

      {item.type === 'post' && item.id && (
        <a
          href={`/blog/${item.id.substring(0, 4)}/${item.id.split('-').slice(3).join('-')}`}
          className="text-green-600 hover:text-green-700 text-sm mt-2 inline-block"
        >
          Read post →
        </a>
      )}
    </div>
  )
}
