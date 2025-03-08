import React, { ReactNode } from 'react';

// Site Types
export type SiteType = 'mind' | 'work' | 'play';

// Constants
const siteUrls = {
  mind: 'https://avalonstar.com',
  work: 'https://bryanveloso.com',
  play: 'https://omnyist.com',
};

// For local development
const devPorts = {
  mind: '5321',
  work: '5322',
  play: '5323',
};

interface BaseLayoutProps {
  activeSite: SiteType;
  mindContent?: ReactNode;
  workContent?: ReactNode;
  playContent?: ReactNode;
  isDev?: boolean;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  activeSite,
  mindContent,
  workContent,
  playContent,
  isDev = false,
}) => {
  return (
    <div className="flex h-screen w-screen">
      {/* Mind (Avalonstar) */}
      <div className={`${activeSite === 'mind' ? 'flex-auto' : 'w-24'} h-screen`}>
        <div>
          {activeSite === 'mind' ? (
            <div className="m-6 bg-gray-900">
              {mindContent}
            </div>
          ) : (
            <div className="h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-center">
              <a
                href={isDev ? `http://localhost:${devPorts.mind}` : siteUrls.mind}
                className="text-xl font-bold text-gray-500 hover:text-gray-900 truncate px-2"
              >
                Avalonstar
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Work (Bryan Veloso) */}
      <div
        className={`${activeSite === 'work' ? 'flex-1' : 'w-[256px]'} h-screen p-6 work bg-amber-50 px-6`}
      >
        <div>
          {activeSite === 'work' ? (
            <div className="p-6">
              {workContent}
            </div>
          ) : (
            <div className="h-screen items-center justify-center">
              <a
                href={isDev ? `http://localhost:${devPorts.work}` : siteUrls.work}
                className=""
              >
                <div className="transform -rotate-90">Bryan Veloso</div>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Play (Omnyist) */}
      <div className={`${activeSite === 'play' ? 'flex-1' : 'w-24'} h-screen`}>
        <div>
          {activeSite === 'play' ? (
            <div className="p-6">
              {playContent}
            </div>
          ) : (
            <div className="p-6">
              <a
                href={isDev ? `http://localhost:${devPorts.play}` : siteUrls.play}
                className=""
              >
                Omnyist
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;