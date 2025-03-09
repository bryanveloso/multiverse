import { useState, useEffect } from 'react';
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
  | TimelineGap
  | TimelineEvent;

// Define the event type for era/location/job events
interface TimelineEvent {
  type: 'event';
  title: string;
  date: Date;
  color: string;
  data: TimelineEra | TimelineLocation | TimelineJob;
}

export default function Timeline({ items }: { items: TimelineItem[] }) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Filter and sort items by type
  const posts = items
    .filter((item): item is TimelinePost => item.type === 'post')
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const gaps = items
    .filter((item): item is TimelineGap => item.type === 'gap')
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const eras = items
    .filter((item): item is TimelineEra => item.type === 'era')
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  
  const locations = items
    .filter((item): item is TimelineLocation => item.type === 'location')
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  
  const jobs = items
    .filter((item): item is TimelineJob => item.type === 'job')
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

  // Create events for the start of each era, location, and job
  const eraEvents = eras.map(era => ({
    type: 'event' as const,
    title: `Started era: ${era.title}`,
    date: era.startDate,
    color: era.color || '#6B7280',
    data: era
  }));

  const locationEvents = locations.map(location => ({
    type: 'event' as const,
    title: `Moved to ${location.name}`,
    date: location.startDate,
    color: location.color || '#3B82F6',
    data: location
  }));

  const jobEvents = jobs.map(job => ({
    type: 'event' as const,
    title: `Started at ${job.company} as ${job.title}`,
    date: job.startDate,
    color: '#10B981',
    data: job
  }));

  // Combine all date-based items, sorted by date (newest first)
  const sortedItems = [...posts, ...gaps, ...eraEvents, ...locationEvents, ...jobEvents].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );

  // Function to check if an item is active at a given date
  const isActiveAtDate = (item: TimelineEra | TimelineLocation | TimelineJob, date: Date) => {
    const endDate = item.endDate || new Date();
    return date >= item.startDate && date <= endDate;
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="timeline-grid">
        {/* First we'll create a grid where each post will occupy a row */}
        {sortedItems.map((item, itemIndex) => {
          // Get active context items for this date point
          const activeEras = eras.filter(era => isActiveAtDate(era, item.date));
          const activeLocations = locations.filter(loc => isActiveAtDate(loc, item.date));
          const activeJobs = jobs.filter(job => isActiveAtDate(job, item.date));
          
          // Calculate opacity based on significance
          const significance = 'significance' in item ? item.significance || 3 : 3;
          const opacity = 0.6 + significance * 0.08;
          const authorAge = getAuthorAge(item.date);

          return (
            <div 
              key={`${item.type}-${itemIndex}`} 
              className="grid grid-cols-[150px_1fr] gap-4 mb-8"
            >
              {/* Context column - contains era, location, job indicators */}
              <div className="relative">
                {/* Era, location, and job bars */}
                <div className="flex space-x-2 justify-end h-full">
                  {/* Era bars */}
                  {activeEras.map((era, eraIdx) => (
                    <div key={`era-${eraIdx}`} className="flex flex-col items-center">
                      <div 
                        className="w-2 h-full rounded-full"
                        style={{ backgroundColor: era.color || '#6B7280' }}
                      />
                      <div className="text-xs text-gray-600 text-right w-full mt-1">
                        {era.title}
                      </div>
                    </div>
                  ))}
                  
                  {/* Location bars */}
                  {activeLocations.map((location, locIdx) => (
                    <div key={`loc-${locIdx}`} className="flex flex-col items-center">
                      <div 
                        className="w-2 h-full rounded-full"
                        style={{ backgroundColor: location.color || '#3B82F6' }}
                      />
                      <div className="text-xs text-gray-600 text-right w-full mt-1">
                        {location.name}
                      </div>
                    </div>
                  ))}
                  
                  {/* Job bars */}
                  {activeJobs.map((job, jobIdx) => (
                    <div key={`job-${jobIdx}`} className="flex flex-col items-center">
                      <div 
                        className="w-2 h-full rounded-full"
                        style={{ backgroundColor: '#10B981' }}
                      />
                      <div className="text-xs text-gray-600 text-right w-full mt-1">
                        {job.company}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Content column */}
              <div className="relative">
                {/* Timeline dot */}
                <div className="absolute left-0 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center z-10">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: 
                        item.type === 'event' ? item.color :
                          item.type === 'gap' && 'color' in item 
                            ? item.color || '#6B7280' 
                            : '#6B7280'
                    }}
                  />
                </div>
                
                {/* Vertical line connecting to previous item */}
                {itemIndex < sortedItems.length - 1 && (
                  <div className="absolute left-0 top-6 -translate-x-1/2 w-px bg-gray-200 h-full" />
                )}
                
                {/* Display different types of items */}
                {item.type === 'event' ? (
                  /* Life event card (era, job, location start) */
                  <div 
                    className={`
                      p-3 rounded-lg transition-all ml-6 
                      border-l-4 bg-gray-50 hover:bg-gray-100 
                      ${activeItem === `${item.type}-${itemIndex}` ? 'ring-2 ring-green-500' : ''}
                      shadow-sm hover:shadow cursor-pointer
                    `}
                    style={{ 
                      opacity,
                      borderLeftColor: item.color
                    }}
                    onClick={() => setActiveItem(`${item.type}-${itemIndex}`)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium mb-1 text-gray-800">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">
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
                    
                    {'description' in item.data && item.data.description && (
                      <p className="text-gray-600 mt-1 text-sm">{item.data.description}</p>
                    )}
                  </div>
                ) : (
                  /* Regular post or gap item */
                  <div 
                    className={`
                      p-4 rounded-lg transition-all ml-6
                      ${item.type === 'post' ? 'bg-white hover:bg-gray-50' : ''}
                      ${item.type === 'gap' ? 'bg-gray-50 hover:bg-gray-100' : ''}
                      ${activeItem === `${item.type}-${itemIndex}` ? 'ring-2 ring-green-500' : ''}
                      shadow-sm hover:shadow cursor-pointer
                    `}
                    style={{ opacity }}
                    onClick={() => setActiveItem(`${item.type}-${itemIndex}`)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg mb-1">
                        {item.title}
                      </h3>
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
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
