import * as React from 'react'

interface OgImageWithHeroProps {
  title: string
  date: Date
  authorAge: number
  description?: string
  hasHeroImage?: boolean
  heroImageData?: string
  headingFont?: string
  bodyFont?: string
}

export function OgImageWithHero({ title, date, authorAge, description, hasHeroImage, heroImageData, headingFont = 'ReallySansLarge', bodyFont = 'ReallySansSmall' }: OgImageWithHeroProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // If there's a hero image, use a different layout
  if (hasHeroImage) {
    return (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: '#0d0a11',
          display: 'flex',
          fontFamily: `${bodyFont}, sans-serif`
        }}>
        {/* Left side - Content */}
        <div
          style={{
            flex: 1,
            padding: 60,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
          <div style={{ display: 'flex', fontSize: 18, color: '#fff683', fontWeight: 600 }}>
            Avalonstar
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: title.length > 40 ? 42 : 52, fontWeight: 700, color: '#ffffff', lineHeight: 1.1, fontFamily: `${headingFont}, sans-serif` }}>
              {title}
            </div>

            {description && (
              <div style={{ fontSize: 18, color: '#b4cbd6', lineHeight: 1.4 }}>
                {description.length > 120 ? description.substring(0, 120) + '...' : description}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', fontSize: 16, color: '#939393', gap: 10 }}>
            <span>{formatDate(date)}</span>
            <span>•</span>
            <span>Age {authorAge}</span>
          </div>
        </div>

        {/* Right side - Hero image */}
        <div
          style={{
            width: 400,
            backgroundColor: '#241f33',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: '4px solid #bbf4b0'
          }}>
          {heroImageData ? (
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              <img
                src={heroImageData}
                width={400}
                height={630}
                style={{ display: 'block' }}
              />
            </div>
          ) : (
            <div
              style={{
                color: '#6d8591',
                fontSize: 14,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                display: 'flex'
              }}>
              Featured Image
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default layout without hero image
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        backgroundColor: '#0d0a11',
        color: '#ffffff',
        padding: 80,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: `${bodyFont}, sans-serif`
      }}>
      <div style={{ display: 'flex', fontSize: 18, color: '#fff683', fontWeight: 600 }}>
        Avalonstar
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: title.length > 50 ? 48 : 64, fontWeight: 700, textAlign: 'center', fontFamily: `${headingFont}, sans-serif` }}>
          {title}
        </div>

        {description && (
          <div style={{ fontSize: 20, color: '#b4cbd6', textAlign: 'center' }}>
            {description}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', fontSize: 16, color: '#939393' }}>
        {formatDate(date)} • Age {authorAge}
      </div>
    </div>
  )
}