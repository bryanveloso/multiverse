import { useState } from 'react';
import { getAuthorAge } from '../utils/age';

interface TimelinePost {
  type: 'post';
  title: string;
  date: Date;
  description?: string;
  slug?: string;
  id?: string;
  significance?: number;
}

interface TimelineEra {
  type: 'era';
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  color?: string;
}

interface TimelineLocation {
  type: 'location';
  name: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  color?: string;
}

interface TimelineJob {
  type: 'job';
  company: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

interface TimelineGap {
  type: 'gap';
  title: string;
  date: Date;
  description?: string;
  color?: string;
  significance?: number;
}

type TimelineItem = 
  | TimelinePost 
  | TimelineEra 
  | TimelineLocation
  | TimelineJob
  | TimelineGap;

interface TimelineMonth {
  date: Date;
  items: TimelineItem[];
  activeEras: TimelineEra[];
  activeLocations: TimelineLocation[];
  activeJobs: TimelineJob[];
}

export default function Timeline({ items }: { items: TimelineItem[] }) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Generate array of all months between earliest and latest dates
  const generateMonthlyTimeline = () => {
    const allDates = items.flatMap((item) => {
      if (item.type === 'era' || item.type === 'location' || item.type === 'job') {
        return [item.startDate, item.endDate || new Date()];
      }
      return item.date ? [item.date] : [];
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

      // Find single-date items that belong to this month
      const monthItems = items
        .filter((item) => {
          if (item.type === 'era' || item.type === 'location' || item.type === 'job') {
            // For span-based items, check if startDate month/year matches current month
            if (item.startDate.getMonth() === monthDate.getMonth() && 
                item.startDate.getFullYear() === monthDate.getFullYear()) {
              return true;
            }
            return false;
          }
          
          // For single date items like posts and gaps
          const itemDate = new Date('date' in item ? item.date : new Date());
          return (
            itemDate.getMonth() === monthDate.getMonth() &&
            itemDate.getFullYear() === monthDate.getFullYear()
          );
        })
        .sort((a, b) => {
          // Sort items within the month newest first
          if ('date' in a && 'date' in b) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          return 0;
        });

      // Find active eras, locations, and jobs for this month
      const activeEras = items.filter((item): item is TimelineEra => {
        if (item.type !== 'era') return false;
        return monthDate >= item.startDate && monthDate <= (item.endDate || new Date());
      });
      
      // Find active locations for this month
      const activeLocations = items.filter((item): item is TimelineLocation => {
        if (item.type !== 'location') return false;
        const endDate = item.endDate || new Date();
        return monthDate >= item.startDate && monthDate <= endDate;
      });
      
      // Find active jobs for this month
      const activeJobs = items.filter((item): item is TimelineJob => {
        if (item.type !== 'job') return false;
        const endDate = item.endDate || new Date();
        return monthDate >= item.startDate && monthDate <= endDate;
      });

      months.push({
        date: monthDate,
        items: monthItems,
        activeEras,
        activeLocations,
        activeJobs,
      });

      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    return months;
  };

  const timelineMonths = generateMonthlyTimeline();

  // Sort eras, locations, and jobs newest first for the navigation
  const sortedEras = items
    .filter((item): item is TimelineEra => item.type === 'era')
    .sort((a, b) => {
      const aEndTime = a.endDate?.getTime() || new Date().getTime();
      const bEndTime = b.endDate?.getTime() || new Date().getTime();
      return bEndTime - aEndTime;
    });
    
  const sortedLocations = items
    .filter((item): item is TimelineLocation => item.type === 'location')
    .sort((a, b) => {
      const aEndDate = a.endDate || new Date();
      const bEndDate = b.endDate || new Date();
      return bEndDate.getTime() - aEndDate.getTime();
    });
    
  const sortedJobs = items
    .filter((item): item is TimelineJob => item.type === 'job')
    .sort((a, b) => {
      const aEndDate = a.endDate || new Date();
      const bEndDate = b.endDate || new Date();
      return bEndDate.getTime() - aEndDate.getTime();
    });

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-[200px_1px_1fr] gap-8">
        {/* Navigation panel */}
        <div className="sticky top-4 h-fit space-y-6">
          {/* Era Navigation */}
          <div className="space-y-1">
            <h3 className="font-medium text-xs uppercase text-gray-400 mb-2 px-2">Life Eras</h3>
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
          
          {/* Locations Navigation */}
          {sortedLocations.length > 0 && (
            <div className="space-y-1">
              <h3 className="font-medium text-xs uppercase text-gray-400 mb-2 px-2">Locations</h3>
              {sortedLocations.map((location, index) => (
                <div
                  key={`location-nav-${index}`}
                  className="p-2 text-sm rounded-lg cursor-pointer hover:bg-gray-50"
                  style={{ color: location.color || '#3B82F6' }}
                  onClick={() => {
                    const element = document.getElementById(
                      `location-${location.startDate.getTime()}`
                    );
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {location.name}
                </div>
              ))}
            </div>
          )}
          
          {/* Jobs Navigation */}
          {sortedJobs.length > 0 && (
            <div className="space-y-1">
              <h3 className="font-medium text-xs uppercase text-gray-400 mb-2 px-2">Work</h3>
              {sortedJobs.map((job, index) => (
                <div
                  key={`job-nav-${index}`}
                  className="p-2 text-sm rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    const element = document.getElementById(
                      `job-${job.startDate.getTime()}`
                    );
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {job.title} <span className="text-xs text-gray-500 block">at {job.company}</span>
                </div>
              ))}
            </div>
          )}
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

              {/* All timeline indicators: Eras, Locations, Jobs */}
              
              {/* Era indicators */}
              {month.activeEras.map((era, eraIndex) => {
                const isStart = month.date.getTime() === era.startDate.getTime();
                const isEnd = month.date.getTime() === era.endDate.getTime();

                return (
                  <div
                    key={`era-${eraIndex}`}
                    id={isStart ? `era-${era.startDate.getTime()}` : undefined}
                    className="absolute -left-12 -ml-2 w-8"
                    style={{
                      backgroundColor: era.color || '#E5E7EB',
                      opacity: 0.3,
                      top: '-1rem',
                      bottom: '-1rem',
                      borderTopLeftRadius: isEnd ? '6px' : '0', 
                      borderTopRightRadius: isEnd ? '6px' : '0', 
                      borderBottomLeftRadius: isStart ? '6px' : '0',
                      borderBottomRightRadius: isStart ? '6px' : '0',
                    }}
                  />
                );
              })}
              
              {/* Location indicators (offset left of eras) */}
              {month.activeLocations.map((location, locIndex) => {
                const endDate = location.endDate || new Date();
                const isStart = month.date.getTime() === location.startDate.getTime();
                const isEnd = month.date.getTime() === endDate.getTime();

                return (
                  <div
                    key={`location-${locIndex}`}
                    id={isStart ? `location-${location.startDate.getTime()}` : undefined}
                    className="absolute -left-20 -ml-2 w-8"
                    style={{
                      backgroundColor: location.color || '#3B82F6', // Default blue
                      opacity: 0.3,
                      top: '-1rem',
                      bottom: '-1rem',
                      borderTopLeftRadius: isEnd ? '6px' : '0',
                      borderTopRightRadius: isEnd ? '6px' : '0',
                      borderBottomLeftRadius: isStart ? '6px' : '0',
                      borderBottomRightRadius: isStart ? '6px' : '0',
                    }}
                  />
                );
              })}
              
              {/* Job indicators (offset right of eras) */}
              {month.activeJobs.map((job, jobIndex) => {
                const endDate = job.endDate || new Date();
                const isStart = month.date.getTime() === job.startDate.getTime();
                const isEnd = month.date.getTime() === endDate.getTime();

                return (
                  <div
                    key={`job-${jobIndex}`}
                    id={isStart ? `job-${job.startDate.getTime()}` : undefined}
                    className="absolute -left-4 -ml-2 w-8"
                    style={{
                      backgroundColor: '#10B981', // Default green for jobs
                      opacity: 0.3,
                      top: '-1rem',
                      bottom: '-1rem',
                      borderTopLeftRadius: isEnd ? '6px' : '0',
                      borderTopRightRadius: isEnd ? '6px' : '0',
                      borderBottomLeftRadius: isStart ? '6px' : '0',
                      borderBottomRightRadius: isStart ? '6px' : '0',
                    }}
                  />
                );
              })}

              {/* Items for this month */}
              <div className="space-y-4">
                {month.items.map((item, itemIndex) => {
                  // Calculate opacity based on significance (if available)
                  const significance = 'significance' in item ? item.significance || 3 : 3;
                  const opacity = 0.6 + (significance * 0.08); // 1-5 scale maps to 0.68-1.0 opacity
                  
                  // Calculate author's age for the item's date
                  let itemDate;
                  if ('date' in item) {
                    itemDate = item.date;
                  } else if ('startDate' in item) {
                    itemDate = item.startDate;
                  } else {
                    itemDate = new Date();
                  }
                  const authorAge = getAuthorAge(itemDate);
                  
                  return (
                    <div
                      key={`${item.type}-${itemIndex}`}
                      className={`
                        p-4 rounded-lg transition-all
                        ${item.type === 'post' ? 'bg-white hover:bg-gray-50' : ''}
                        ${item.type === 'gap' ? 'bg-gray-50 hover:bg-gray-100' : ''}
                        ${item.type === 'location' ? 'bg-blue-50 hover:bg-blue-100 border-l-4' : ''}
                        ${item.type === 'job' ? 'bg-green-50 hover:bg-green-100 border-l-4' : ''}
                        ${activeItem === `${item.type}-${itemIndex}` ? 'ring-2 ring-green-500' : ''}
                        cursor-pointer
                      `}
                      style={{
                        opacity: opacity,
                        borderLeftColor: item.type === 'location' || item.type === 'job'
                          ? (item.color || '#4B5563') 
                          : undefined
                      }}
                      onClick={() => setActiveItem(`${item.type}-${itemIndex}`)}
                    >
                      {/* Timeline item badge */}
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg mb-1">
                          {item.type === 'post' || item.type === 'gap'
                            ? item.title 
                            : item.type === 'location' 
                              ? item.name
                              : item.type === 'job' 
                                ? `${item.title} at ${item.company}`
                                : item.title
                          }
                        </h3>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                          Age: {authorAge}
                        </span>
                      </div>
                      
                      {/* Date display */}
                      <div className="text-sm text-gray-500 mb-2">
                        {/* Single date items */}
                        {(item.type === 'post' || item.type === 'gap') && 
                          new Date(item.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        }
                        
                        {/* Period items (with start/end dates) */}
                        {item.type === 'era' && 
                          `${new Date(item.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - 
                          ${item.endDate 
                            ? new Date(item.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                            : 'Present'}`
                        }
                        
                        {/* Location period */}
                        {item.type === 'location' && 
                          `${item.startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - 
                          ${item.endDate 
                            ? item.endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                            : 'Present'}`
                        }
                        
                        {/* Job period */}
                        {item.type === 'job' && 
                          `${item.startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - 
                          ${item.endDate 
                            ? item.endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                            : 'Present'}`
                        }
                      </div>
                      
                      {/* Description */}
                      {item.description && <p className="text-gray-600">{item.description}</p>}
                      
                      {/* Action links */}
                      {item.type === 'post' && item.id && (
                        <a
                          href={`/blog/${item.id.substring(0, 4)}/${item.id.split('-').slice(3).join('-')}`}
                          className="text-green-600 hover:text-green-700 text-sm mt-2 inline-block"
                        >
                          Read post →
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
