import { useState } from 'react';

interface TimelinePost {
  type: 'post';
  title: string;
  date: Date;
  description: string;
  slug: string;
}

interface TimelineEra {
  type: 'era';
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  color?: string;
}

interface TimelineGap {
  type: 'gap';
  title: string;
  date: Date;
  description: string;
}

type TimelineItem = TimelinePost | TimelineEra | TimelineGap;

interface TimelineMonth {
  date: Date;
  items: TimelineItem[];
  activeEras: TimelineEra[];
}

export default function Timeline({ items }: { items: TimelineItem[] }) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Generate array of all months between earliest and latest dates
  const generateMonthlyTimeline = () => {
    const allDates = items.flatMap((item) => {
      if (item.type === 'era') {
        return [item.startDate, item.endDate];
      }
      return [item.date];
    });

    const earliestDate = new Date(
      Math.min(...allDates.map((d) => d.getTime()))
    );
    const latestDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

    const months: TimelineMonth[] = [];
    const currentDate = new Date(latestDate);
    currentDate.setDate(1); // Start at beginning of month

    while (currentDate >= earliestDate) {
      const monthDate = new Date(currentDate);

      // Find items that belong to this month
      const monthItems = items
        .filter((item) => {
          if (item.type === 'era') {
            return false; // Handle eras separately
          }
          const itemDate = new Date(item.date);
          return (
            itemDate.getMonth() === monthDate.getMonth() &&
            itemDate.getFullYear() === monthDate.getFullYear()
          );
        })
        .sort((a, b) => {
          // Sort items within the month newest first
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

      // Find active eras for this month
      const activeEras = items.filter((item): item is TimelineEra => {
        if (item.type !== 'era') return false;
        return monthDate >= item.startDate && monthDate <= item.endDate;
      });

      months.push({
        date: monthDate,
        items: monthItems,
        activeEras,
      });

      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    return months;
  };

  const timelineMonths = generateMonthlyTimeline();

  // Sort eras newest first for the navigation
  const sortedEras = items
    .filter((item): item is TimelineEra => item.type === 'era')
    .sort((a, b) => b.endDate.getTime() - a.endDate.getTime());

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-[200px_1px_1fr] gap-8">
        {/* Era Navigation */}
        <div className="sticky top-4 h-fit space-y-4">
          {sortedEras.map((era, index) => (
            <div
              key={`era-nav-${index}`}
              className="p-2 text-sm rounded-lg cursor-pointer hover:bg-gray-50"
              style={{ color: era.color || '#4B5563' }}
              onClick={() => {
                const element = document.getElementById(
                  `era-${era.startDate.getTime()}`
                );
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {era.title}
            </div>
          ))}
        </div>

        {/* Timeline Line */}
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-200" />
        </div>

        {/* Timeline Content */}
        <div className="space-y-16">
          {timelineMonths.map((month, monthIndex) => (
            <div
              key={month.date.getTime()}
              className="relative"
              id={`month-${month.date.getTime()}`}
            >
              {/* Month marker if there are items or it's the start/end of an era */}
              {(month.items.length > 0 ||
                month.activeEras.some(
                  (era) =>
                    month.date.getTime() === era.startDate.getTime() ||
                    month.date.getTime() === era.endDate.getTime()
                )) && (
                <div className="mb-4">
                  <time className="text-sm font-medium text-gray-500">
                    {month.date.toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              )}

              {/* Era indicators */}
              {month.activeEras.map((era, eraIndex) => {
                const isStart =
                  month.date.getTime() === era.startDate.getTime();
                const isEnd = month.date.getTime() === era.endDate.getTime();

                return (
                  <div
                    key={`era-${eraIndex}`}
                    id={isStart ? `era-${era.startDate.getTime()}` : undefined}
                    className="absolute -left-12 -ml-2 w-8"
                    style={{
                      backgroundColor: era.color || '#E5E7EB',
                      opacity: 0.2,
                      top: '-1rem',
                      bottom: '-1rem',
                      borderTopLeftRadius: isEnd ? '6px' : '0', // Note: swapped from isStart
                      borderTopRightRadius: isEnd ? '6px' : '0', // Because we're displaying newest first
                      borderBottomLeftRadius: isStart ? '6px' : '0',
                      borderBottomRightRadius: isStart ? '6px' : '0',
                    }}
                  />
                );
              })}

              {/* Items for this month */}
              <div className="space-y-4">
                {month.items.map((item, itemIndex) => (
                  <div
                    key={`${item.type}-${itemIndex}`}
                    className={`
                      p-4 rounded-lg transition-all
                      ${item.type === 'post' ? 'bg-white hover:bg-gray-50' : ''}
                      ${item.type === 'gap' ? 'bg-gray-50 hover:bg-gray-100' : ''}
                      ${activeItem === `${item.type}-${itemIndex}` ? 'ring-2 ring-green-500' : ''}
                      cursor-pointer
                    `}
                    onClick={() => setActiveItem(`${item.type}-${itemIndex}`)}
                  >
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                    {item.type === 'post' && (
                      <a
                        href={`/blog/${item.slug}`}
                        className="text-green-600 hover:text-green-700 text-sm mt-2 inline-block"
                      >
                        Read more →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
