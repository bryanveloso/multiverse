import type { CollectionEntry } from 'astro:content'
import { useMemo } from 'react'

import Avalonstar from '@/components/logos/avalonstar'
import Facebook from '@/components/logos/facebook'
import GitHub from '@/components/logos/github'
import Twitch from '@/components/logos/twitch'

type Project = CollectionEntry<'projects'>

interface TimelineProps {
  projects: Project[]
}

const getLogo = (project: Project) => { 
  const logoMap = {
    'avalonstar': () => <div><Avalonstar className="size-6" /></div>,
    'facebook': () => <div><Facebook className="size-6" /></div>,
    'github': () => <div><GitHub className="size-6 text-white" /></div>,
    'twitch': () => <div><Twitch className="size-6 text-white" /></div>,
    'default': () => <div className="size-6 bg-black rounded-full"></div>
  }

  const renderFunction = logoMap[project.data.company.toLowerCase() as keyof typeof logoMap] || logoMap.default
  return renderFunction()
}

const Timeline = ({ projects }: TimelineProps) => {
  // Group projects by year
  const projectsByYear = useMemo(() => {
    // Group by year
    const byYear = projects.reduce<Record<number, Project[]>>((acc, project) => {
      const year = project.data.date.getFullYear()
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(project)
      return acc
    }, {})

    // Convert to array of year objects sorted by year (newest first)
    return Object.entries(byYear)
      .map(([year, yearProjects]) => ({
        year: parseInt(year, 10),
        projects: yearProjects.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      }))
      .sort((a, b) => b.year - a.year)
  }, [projects])

  return (
    <div className="grid grid-cols-[24px_1fr] gap-x-2">
      {projectsByYear.map(({ year, projects }) => (
        <>
          <div className="relative flex h-full">
            <h3 className="text-slate-blue text-sm font-bold tabular-nums" style={{ writingMode: 'vertical-rl' }}>
              <time dateTime={year.toString()}>{year}</time>
            </h3>
            <div className="l-[1px] dark:border-timeline border-slate-blue/50 absolute h-full w-[1px] border-l" />
          </div>
          <div key={year} className="col-start-2">
              {projects.map((project) => (
                <div key={project.id} className='mb-8'>
                  <div className="">
                    <div className="mb-4 flex items-center gap-2">
                      {getLogo(project)}
                      <h3 className="text-lg font-light">{project.data.title}</h3>
                    </div>

                    {project.data.heroImage ? (
                      <img
                        src={
                          typeof project.data.heroImage === 'string'
                            ? project.data.heroImage
                            : project.data.heroImage.src || project.data.heroImage.toString()
                        }
                        alt={project.data.title}
                        className="aspect-[4/1] h-auto rounded object-cover shadow-xl"
                      />
                    ) : (
                      <div className="flex aspect-[4/1] items-center justify-center bg-slate-blue text-gray-500 rounded">
                        {project.data.title}
                      </div>
                    )}
                  </div>
                  <div className="text-cool-black rounded-sm p-4 text-sm">
                    <div className="leading-tight">
                      <h4 className="uppercase">{project.data.title}</h4>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs uppercase">{project.data.company}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </>
      ))}
    </div>
  )
 }

 export default Timeline
