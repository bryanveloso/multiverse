import type { CollectionEntry } from 'astro:content';
import { useState } from 'react';

import ProjectCard from '@/components/project-card';
import SkillsMatrix from '@/components/skills-matrix';
import ProjectModal from '@/components/project-modal';

interface EnhancedPortfolioProps {
  projects: CollectionEntry<'projects'>[];
}

const EnhancedPortfolio = ({ projects }: EnhancedPortfolioProps) => {
  const [selectedProject, setSelectedProject] = useState<CollectionEntry<'projects'> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredSkill, setFilteredSkill] = useState<string | null>(null);

  // Group projects by year (similar to the original timeline component)
  const projectsByYear = (() => {
    // Group by year
    const byYear = projects.reduce<Record<number, CollectionEntry<'projects'>[]>>((acc, project) => {
      const year = new Date(project.data.date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(project);
      return acc;
    }, {});

    // Convert to array of year objects sorted by year (newest first)
    return Object.entries(byYear)
      .map(([year, yearProjects]) => ({
        year: parseInt(year, 10),
        projects: yearProjects.sort((a, b) => 
          new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
        )
      }))
      .sort((a, b) => b.year - a.year);
  })();

  // Handle project card click to open modal
  const handleProjectClick = (project: CollectionEntry<'projects'>) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Handle skill filter
  const handleSkillFilter = (skill: string | null) => {
    setFilteredSkill(skill);
  };

  // Filter projects based on selected skill
  const getFilteredProjects = (yearProjects: CollectionEntry<'projects'>[]) => {
    if (!filteredSkill) return yearProjects;

    // This is a simplified filter based on the demo skills data
    // In a real implementation, you would filter based on your actual data structure
    const projectSkillMap: Record<string, string[]> = {
      'altair': ['React', 'TypeScript', 'Node.js', 'UI/UX Design', 'WebSockets'],
      'business-cards': ['Graphic Design', 'Branding', 'Print Design'],
      'codeconf': ['Event Design', 'Branding', 'UI/UX Design'],
      'emote-selector': ['Twitch API', 'UI/UX Design', 'React'],
      'flock': ['Product Design', 'User Research', 'UI/UX Design'],
      'gist': ['GitHub API', 'React', 'JavaScript'],
      'hello-base': ['React', 'Python', 'Django', 'UI/UX Design'],
      'landale': ['React', 'UI/UX Design', 'TypeScript'],
      'mashable': ['CSS', 'HTML', 'UI/UX Design'],
      'octicons': ['SVG', 'Icon Design', 'Design Systems'],
      'synthform': ['React', 'TypeScript', 'UI/UX Design'],
      'whispers': ['Game Design', 'UI/UX Design', 'Brand Identity']
    };
    
    return yearProjects.filter(project => {
      const skills = projectSkillMap[project.id] || [];
      return skills.includes(filteredSkill);
    });
  };

  return (
    <div>
      {/* Skills Matrix for filtering */}
      <SkillsMatrix projects={projects} onSkillFilter={handleSkillFilter} />
      
      {/* Timeline with enhanced project cards */}
      <div className="grid grid-cols-[24px_1fr] gap-x-2">
        {projectsByYear.map(({ year, projects: yearProjects }) => {
          const filteredYearProjects = getFilteredProjects(yearProjects);
          
          // If there are no projects after filtering, don't show the year
          if (filteredSkill && filteredYearProjects.length === 0) return null;
          
          return (
            <div key={year} className="contents">
              <div className="relative flex h-full">
                <h3 
                  className="text-slate-blue text-sm font-bold tabular-nums" 
                  style={{ writingMode: 'vertical-rl' }}
                >
                  <time dateTime={year.toString()}>{year}</time>
                </h3>
                <div className="l-[1px] border-timeline border-slate-blue/50 absolute h-full w-[1px] border-l" />
              </div>
              
              <div className="col-start-2">
                {filteredYearProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onClick={handleProjectClick} 
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Project modal for detailed view */}
      <ProjectModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default EnhancedPortfolio;