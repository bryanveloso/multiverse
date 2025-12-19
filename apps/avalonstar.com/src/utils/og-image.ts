import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import * as React from 'react'
import { readFile } from 'fs/promises'
import { OgImageWithHero } from '@/components/og-image-with-hero'
import { getAuthorAge } from '@/utils/age'
import * as path from 'path'
import { fileURLToPath } from 'url'
import * as sharp from 'sharp'

interface GenerateOgImageOptions {
  title: string
  date: Date
  description?: string
  heroImage?: any
  siteUrl: string
}

export async function generateOgImage({ title, date, description, heroImage, siteUrl }: GenerateOgImageOptions): Promise<Buffer> {
  const authorAge = getAuthorAge(date)

  // Satori only supports woff/ttf/otf fonts, not woff2
  // Load fonts from cdn.velo.so to match site typography
  let fonts: { name: string; data: ArrayBuffer; weight: number; style: 'normal' | 'italic' }[] = []

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

  // Process hero image if it exists
  let heroImageData: string | undefined
  if (heroImage) {
    try {
      // Handle Astro image imports (they have a src property)
      const imagePath = heroImage.src || heroImage

      if (typeof imagePath === 'string') {
        let fullPath: string

        if (imagePath.startsWith('/@fs/')) {
          // Dev mode: Astro serves files with /@fs/ prefix
          fullPath = imagePath.replace('/@fs/', '/').split('?')[0]
        } else if (imagePath.startsWith('@/')) {
          // Build mode: Direct asset reference
          const __dirname = path.dirname(fileURLToPath(import.meta.url))
          const relativePath = imagePath.replace('@/', '../')
          fullPath = path.join(__dirname, relativePath)
        } else {
          // Assume it's already a full path
          fullPath = imagePath
        }

        // Read and optimize the image for OG display
        const imageBuffer = await readFile(fullPath)

        // Use sharp to resize and convert to JPEG for smaller size
        // @ts-expect-error - sharp ESM/CJS interop
        const sharpFn = sharp.default || sharp
        const optimizedBuffer = await sharpFn(imageBuffer)
          .resize(400, 630, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toBuffer()

        const base64 = optimizedBuffer.toString('base64')
        heroImageData = `data:image/jpeg;base64,${base64}`
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
      fonts: fonts as any
    }
  )

  const resvg = new Resvg(svg, {
    background: 'rgba(13, 10, 17, 1)',
    fitTo: {
      mode: 'width',
      value: 1200
    }
  })

  const pngData = resvg.render()
  return pngData.asPng()
}