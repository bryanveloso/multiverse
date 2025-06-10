import type { CollectionEntry } from 'astro:content';
import { useEffect, useRef, useState } from 'react';

type Project = CollectionEntry<'projects'>;

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Demo gallery images (in a real implementation, you would use project.data.images.gallery)
  const galleryImages = [
    { src: project?.data.heroImage?.src || '', alt: project?.data.title || '' },
    { src: project?.data.heroImage?.src || '', alt: project?.data.title || '' },
    { src: project?.data.heroImage?.src || '', alt: project?.data.title || '' },
  ];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen || !project) return null;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const renderGallery = () => {
    return (
      <div className="relative mt-6 overflow-hidden rounded-lg">
        <div className="aspect-video bg-midnight-blue/20">
          {galleryImages[currentImageIndex]?.src && (
            <img
              src={galleryImages[currentImageIndex].src}
              alt={galleryImages[currentImageIndex].alt}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        
        {galleryImages.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}
        
        {/* Thumbnail navigation */}
        <div className="mt-2 flex justify-center gap-2">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-apple-green scale-125' 
                  : 'bg-slate-blue/50 hover:bg-slate-blue'
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={index === currentImageIndex}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cool-black/90 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="bg-cool-black max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg p-6 shadow-2xl"
      >
        {/* Modal header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-light">{project.data.title}</h2>
            <div className="flex items-center text-sm text-cool-grey">
              <span className="font-medium">{project.data.company}</span>
              <span className="mx-2">•</span>
              <span>{project.data.date.getFullYear()}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-cool-grey hover:text-white rounded-full p-1 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Project significance */}
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-cool-grey">Significance:</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 w-2 rounded-full ${
                    i < (project.data.significance || 3)
                      ? 'bg-apple-green' 
                      : 'bg-slate-blue/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Gallery */}
        {renderGallery()}

        {/* Project details */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-apple-green pb-2 text-sm font-medium uppercase">Summary</h3>
            <p className="text-cool-grey">{project.data.summary}</p>
          </div>

          <div>
            <h3 className="text-apple-green pb-2 text-sm font-medium uppercase">Involvement</h3>
            <p className="text-cool-grey">{project.data.involvement}</p>
          </div>
        </div>

        {/* Technologies/Skills */}
        <div className="mt-8">
          <h3 className="text-apple-green pb-2 text-sm font-medium uppercase">Technologies & Skills</h3>
          <div className="flex flex-wrap gap-2">
            {/* In a real implementation, these would come from your project data */}
            {['React', 'TypeScript', 'UI/UX Design', 'Tailwind CSS', 'Figma'].map((tech, index) => (
              <span 
                key={index}
                className="bg-slate-blue/10 text-slate-blue rounded-full px-3 py-1 text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {project.data.links && project.data.links.length > 0 && (
          <div className="mt-8">
            <h3 className="text-apple-green pb-2 text-sm font-medium uppercase">Links</h3>
            <div className="flex flex-wrap gap-3">
              {project.data.links.map((link, index) => 
                link ? (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-midnight-blue hover:bg-midnight-blue/80 flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white transition-colors"
                  >
                    {link.label || 'View Project'}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </a>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;