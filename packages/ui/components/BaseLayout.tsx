import React, { ReactNode } from 'react'

// Site Types
export type SiteType = 'mind' | 'work' | 'play'

// Constants
const siteUrls = {
  mind: 'https://avalonstar.com',
  work: 'https://bryanveloso.com',
  play: 'https://omnyist.com'
}

// For local development
const devPorts = {
  mind: '5321',
  work: '5322',
  play: '5323'
}

interface BaseLayoutProps {
  activeSite: SiteType
  mindContent?: ReactNode
  workContent?: ReactNode
  playContent?: ReactNode
  isDev?: boolean
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  activeSite,
  mindContent,
  workContent,
  playContent,
  isDev = false
}) => {
  return (
    <div className="flex h-screen w-screen">
      {/* Mind (Avalonstar) */}
      <div className={`${activeSite === 'mind' ? 'flex-auto' : 'w-24'} h-screen`}>
        <div>
          {activeSite === 'mind' ? (
            <div className="m-6 bg-gray-900">{mindContent}</div>
          ) : (
            <div className="flex h-16 items-center justify-center border-b border-gray-200 bg-gray-100">
              <a
                href={isDev ? `http://localhost:${devPorts.mind}` : siteUrls.mind}
                className="truncate px-2 text-xl font-bold text-gray-500 hover:text-gray-900"
              >
                Avalonstar
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Work (Bryan Veloso) */}
      <div className={`${activeSite === 'work' ? 'flex-1' : 'w-[256px]'} work h-screen bg-amber-50 p-6 px-6`}>
        <div>
          {activeSite === 'work' ? (
            <div className="p-6">{workContent}</div>
          ) : (
            <div className="h-screen items-center justify-center">
              <a href={isDev ? `http://localhost:${devPorts.work}` : siteUrls.work} className="">
                <div className="-rotate-90 transform">Bryan Veloso</div>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Play (Omnyist) */}
      <div className={`${activeSite === 'play' ? 'flex-1' : 'w-24'} h-screen`}>
        <div>
          {activeSite === 'play' ? (
            <div className="p-6">{playContent}</div>
          ) : (
            <div className="p-6">
              <a href={isDev ? `http://localhost:${devPorts.play}` : siteUrls.play} className="">
                Omnyist
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BaseLayout
