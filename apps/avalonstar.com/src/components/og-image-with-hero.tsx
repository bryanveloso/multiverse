import React from 'react'
import { OG_COLORS, OG_DIMENSIONS, OG_BRAND } from '@/utils/og-constants'

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
          width: OG_DIMENSIONS.width,
          height: OG_DIMENSIONS.height,
          backgroundColor: OG_COLORS.background,
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
          <div style={{ display: 'flex', fontSize: 18, color: OG_COLORS.brand, fontWeight: 600 }}>
            {OG_BRAND.name}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: title.length > 40 ? 42 : 52, fontWeight: 700, color: OG_COLORS.textPrimary, lineHeight: 1.1, fontFamily: `${headingFont}, sans-serif` }}>
              {title}
            </div>

            {description && (
              <div style={{ fontSize: 18, color: OG_COLORS.textSecondary, lineHeight: 1.4 }}>
                {description}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', fontSize: 16, color: OG_COLORS.textMuted, gap: 10 }}>
            <span>{formatDate(date)}</span>
            <span>•</span>
            <span>Age {authorAge}</span>
          </div>
        </div>

        {/* Right side - Hero image */}
        <div
          style={{
            width: OG_DIMENSIONS.heroWidth,
            backgroundColor: OG_COLORS.backgroundAccent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: `4px solid ${OG_COLORS.accent}`
          }}>
          {heroImageData ? (
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              <img
                src={heroImageData}
                width={OG_DIMENSIONS.heroWidth}
                height={OG_DIMENSIONS.height}
                style={{ display: 'block' }}
              />
            </div>
          ) : (
            <div
              style={{
                color: OG_COLORS.imagePlaceholder,
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
        width: OG_DIMENSIONS.width,
        height: OG_DIMENSIONS.height,
        backgroundColor: OG_COLORS.background,
        color: OG_COLORS.textPrimary,
        padding: 80,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: `${bodyFont}, sans-serif`
      }}>
      <div style={{ display: 'flex', fontSize: 18, color: OG_COLORS.brand, fontWeight: 600 }}>
        {OG_BRAND.name}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: title.length > 50 ? 48 : 64, fontWeight: 700, textAlign: 'center', fontFamily: `${headingFont}, sans-serif` }}>
          {title}
        </div>

        {description && (
          <div style={{ fontSize: 20, color: OG_COLORS.textSecondary, textAlign: 'center' }}>
            {description}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', fontSize: 16, color: OG_COLORS.textMuted }}>
        {formatDate(date)} • Age {authorAge}
      </div>
    </div>
  )
}