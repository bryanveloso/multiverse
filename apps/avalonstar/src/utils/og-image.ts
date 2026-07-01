import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import React from 'react'
import { OgImageWithHero } from '@/components/og-image-with-hero'
import { getAuthorAge } from '@/utils/age'
import { OG_COLORS } from '@/utils/og-constants'
import sharp from 'sharp'

interface SatoriFont {
  name: string
  data: ArrayBuffer
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  style: 'normal' | 'italic'
}

interface GenerateOgImageOptions {
  title: string
  date: Date
  description?: string
  heroImage?: string
}

export async function generateOgImage({ title, date, description, heroImage }: GenerateOgImageOptions): Promise<Buffer> {
  const authorAge = getAuthorAge(date)

  // Satori only supports woff/ttf/otf fonts, not woff2
  // Load fonts from cdn.velo.so to match site typography
  let fonts: SatoriFont[] = []

  try {
    const [
      reallySansLargeRegular,
      reallySansLargeBold,
      reallySansSmallRegular
    ] = await Promise.all([
      fetch('https://cdn.velo.so/fonts/reallysans/large/regular.woff'),
      fetch('https://cdn.velo.so/fonts/reallysans/large/bold.woff'),
      fetch('https://cdn.velo.so/fonts/reallysans/small/regular.woff')
    ])

    if (reallySansLargeRegular.ok) {
      fonts.push({ name: 'ReallySansLarge', data: await reallySansLargeRegular.arrayBuffer(), weight: 400, style: 'normal' })
    }
    if (reallySansLargeBold.ok) {
      fonts.push({ name: 'ReallySansLarge', data: await reallySansLargeBold.arrayBuffer(), weight: 700, style: 'normal' })
    }
    if (reallySansSmallRegular.ok) {
      fonts.push({ name: 'ReallySansSmall', data: await reallySansSmallRegular.arrayBuffer(), weight: 400, style: 'normal' })
    }
  } catch (error) {
    console.error('Failed to load ReallySans fonts:', error)
  }

  // Fallback to Inter if fonts failed to load
  if (fonts.length === 0) {
    const fontResponse = await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.16/files/inter-latin-400-normal.woff')
    fonts.push({ name: 'Inter', data: await fontResponse.arrayBuffer(), weight: 400, style: 'normal' })
  }

  let heroImageData: string | undefined
  if (heroImage) {
    try {
      const response = await fetch(heroImage)
      if (response.ok) {
        const imageBuffer = Buffer.from(await response.arrayBuffer())
        const optimizedBuffer = await sharp(imageBuffer)
          .resize(400, 630, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toBuffer()
        heroImageData = `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`
      }
    } catch (error) {
      console.error('Failed to load hero image:', error)
    }
  }

  // Determine font families based on what was loaded
  const hasReallySans = fonts.some(f => f.name === 'ReallySansLarge')
  const headingFont = hasReallySans ? 'ReallySansLarge' : 'Inter'
  const bodyFont = fonts.some(f => f.name === 'ReallySansSmall') ? 'ReallySansSmall' : headingFont

  const svg = await satori(
    React.createElement(OgImageWithHero, {
      title,
      date,
      authorAge,
      description,
      hasHeroImage: !!heroImage,
      heroImageData,
      headingFont,
      bodyFont
    }),
    {
      width: 1200,
      height: 630,
      fonts
    }
  )

  const resvg = new Resvg(svg, {
    background: OG_COLORS.background,
    fitTo: {
      mode: 'width',
      value: 1200
    }
  })

  const pngData = resvg.render()
  return pngData.asPng()
}