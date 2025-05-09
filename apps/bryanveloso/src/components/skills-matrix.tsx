import type { CollectionEntry } from 'astro:content';
import { useState, useMemo } from 'react';

type Project = CollectionEntry<'projects'>;

interface SkillsMatrixProps {
  projects: Project[];
  onSkillFilter: (skill: string | null) => void;
}

interface SkillNode {
  id: string;
  label: string;
  count: number;
  projects: string[];
}

interface ProjectNode {
  id: string;
  title: string;
  skills: string[];
}

// This would ideally come from your content schema
// For this example, we're generating sample skills data
const generateSkillsData = (projects: Project[]): [SkillNode[], ProjectNode[]] => {
  // Define a set of skills per project (in a real implementation, this would be part of your content schema)
  const projectSkills: Record<string, string[]> = {
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

  // Create project nodes
  const projectNodes: ProjectNode[] = projects.map(project => ({
    id: project.id,
    title: project.data.title,
    skills: projectSkills[project.id] || ['UI/UX Design'] // Fallback if no skills defined
  }));

  // Create skill nodes
  const skillsMap = new Map<string, SkillNode>();
  
  projectNodes.forEach(project => {
    project.skills.forEach(skill => {
      if (!skillsMap.has(skill)) {
        skillsMap.set(skill, {
          id: skill.toLowerCase().replace(/\s+/g, '-'),
          label: skill,
          count: 0,
          projects: []
        });
      }
      
      const skillNode = skillsMap.get(skill)!;
      skillNode.count += 1;
      skillNode.projects.push(project.id);
    });
  });

  return [Array.from(skillsMap.values()), projectNodes];
};

const SkillsMatrix = ({ projects, onSkillFilter }: SkillsMatrixProps) => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [skillNodes, projectNodes] = useMemo(() => generateSkillsData(projects), [projects]);

  // Sort skills by frequency (most common first)
  const sortedSkills = useMemo(() => {
    return [...skillNodes].sort((a, b) => b.count - a.count);
  }, [skillNodes]);

  const handleSkillClick = (skill: string) => {
    const newSelectedSkill = selectedSkill === skill ? null : skill;
    setSelectedSkill(newSelectedSkill);
    onSkillFilter(newSelectedSkill);
  };

  return (
    <div className="my-8">
      <h2 className="text-2xl font-light mb-4">Skills & Technologies</h2>
      
      <div className="flex flex-wrap gap-2">
        {sortedSkills.map((skill) => (
          <button
            key={skill.id}
            onClick={() => handleSkillClick(skill.label)}
            className={`rounded-full px-3 py-1 text-sm transition-all duration-200 ${
              selectedSkill === skill.label
                ? 'bg-apple-green text-white shadow-md'
                : 'bg-slate-blue/10 text-slate-blue hover:bg-slate-blue/20'
            }`}
          >
            <span className="font-medium">{skill.label}</span>
            <span className="ml-1 opacity-70">({skill.count})</span>
          </button>
        ))}
      </div>

      {selectedSkill && (
        <div className="mt-4 rounded bg-midnight-blue/10 p-4">
          <h3 className="text-lg font-medium mb-2">
            Projects using <span className="text-apple-green">{selectedSkill}</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {projectNodes
              .filter(project => 
                project.skills.includes(selectedSkill)
              )
              .map(project => (
                <div 
                  key={project.id}
                  className="bg-white/5 rounded p-3 text-sm hover:bg-white/10 transition-colors"
                >
                  {project.title}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsMatrix;