import type { CollectionEntry } from 'astro:content';
import { useState } from 'react';

type Project = CollectionEntry<'projects'>;

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Function to render significance indicators (1-5 rating)
  const renderSignificanceIndicators = () => {
    const significance = project.data.significance || 3;
    return (
      <div className="flex gap-1" aria-label={`Significance: ${significance} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 w-1.5 rounded-full ${
              i < significance 
                ? 'bg-apple-green' 
                : 'bg-slate-blue/30'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  };

  // Extract skills from project content (for demo purposes)
  // In a real implementation, you would add a skills array to your content schema
  const skills = ['React', 'TypeScript', 'Tailwind CSS', 'UI/UX Design'];

  return (
    <div 
      className={`group relative mb-8 overflow-hidden rounded-md transition-all duration-300 ${
        isExpanded ? 'bg-midnight-blue/10 shadow-lg' : ''
      }`}
    >
      {/* Card Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Project logo would go here */}
          <h3 className="text-lg font-light">{project.data.title}</h3>
        </div>
        <div className="flex items-center gap-3">
          {renderSignificanceIndicators()}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-blue hover:text-apple-green transition-colors"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Show less" : "Show more"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            >
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Project Hero Image */}
      <div 
        className="relative mb-4 cursor-pointer overflow-hidden rounded shadow-md transition-all duration-300"
        onClick={() => onClick(project)}
      >
        {project.data.heroImage ? (
          <img
            src={project.data.heroImage.src}
            alt={project.data.title}
            width={project.data.heroImage.width}
            height={project.data.heroImage.height}
            className="aspect-[4/1] h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="bg-slate-blue flex aspect-[4/1] items-center justify-center text-gray-500">
            {project.data.title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cool-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-sm font-medium">Click to view full project details</span>
        </div>
      </div>

      {/* Basic Project Info */}
      <div className="text-cool-black rounded-sm p-2 text-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider">{project.data.company}</span>
          <span className="text-cool-grey text-xs">{project.data.date.getFullYear()}</span>
        </div>
      </div>

      {/* Expandable Content */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4">
          {/* Summary */}
          <div className="mb-4">
            <h4 className="text-apple-green pb-2 text-xs font-medium uppercase">Summary</h4>
            <p className="text-cool-grey">{project.data.summary}</p>
          </div>

          {/* Skills Tags */}
          <div className="mb-4">
            <h4 className="text-apple-green pb-2 text-xs font-medium uppercase">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-slate-blue/10 text-slate-blue rounded-full px-3 py-1 text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Involvement */}
          {project.data.involvement && (
            <div className="mb-4">
              <h4 className="text-apple-green pb-2 text-xs font-medium uppercase">Involvement</h4>
              <p className="text-cool-grey">{project.data.involvement}</p>
            </div>
          )}

          {/* Thumbnail Gallery - For demo purposes */}
          <div className="mb-4">
            <h4 className="text-apple-green pb-2 text-xs font-medium uppercase">Gallery</h4>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-slate-blue/10 aspect-video rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;