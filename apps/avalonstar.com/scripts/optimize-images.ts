/**
 * Convert JPG/PNG images to WebP in src/assets/blog/.
 *
 * Usage:
 *   bun run optimize-images              # convert all unconverted images
 *   bun run optimize-images 2025-05-15   # convert images in a specific post directory
 */

import { $ } from 'bun'
import { readdir, exists, unlink } from 'fs/promises'
import { join, extname, basename } from 'path'

const ASSETS_DIR = join(import.meta.dirname, '..', 'src', 'assets', 'blog')
const QUALITY = 80
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png'])

async function convertImage(filePath: string): Promise<boolean> {
  const webpPath = filePath.replace(/\.[^.]+$/, '.webp')

  if (await exists(webpPath)) {
    return false
  }

  const result = await $`cwebp -q ${QUALITY} ${filePath} -o ${webpPath}`.quiet()
  if (result.exitCode !== 0) {
    console.error(`  Failed: ${basename(filePath)}`)
    return false
  }

  console.log(`  Converted: ${basename(filePath)} → ${basename(webpPath)}`)
  return true
}

async function processDirectory(dirPath: string): Promise<number> {
  const entries = await readdir(dirPath)
  const images = entries.filter((f) => EXTENSIONS.has(extname(f).toLowerCase()))

  if (images.length === 0) return 0

  let converted = 0
  for (const image of images) {
    if (await convertImage(join(dirPath, image))) {
      converted++
    }
  }
  return converted
}

async function main() {
  const target = process.argv[2]
  let totalConverted = 0

  if (target) {
    const dirPath = join(ASSETS_DIR, target)
    if (!(await exists(dirPath))) {
      console.error(`Directory not found: ${target}`)
      process.exit(1)
    }
    console.log(`Processing ${target}/`)
    totalConverted = await processDirectory(dirPath)
  } else {
    const dirs = await readdir(ASSETS_DIR)
    const postDirs = dirs.filter((d) => /^\d{4}-\d{2}-\d{2}/.test(d)).sort()

    for (const dir of postDirs) {
      const converted = await processDirectory(join(ASSETS_DIR, dir))
      if (converted > 0) {
        console.log(`  ${dir}: ${converted} image(s) converted`)
      }
    }
  }

  if (totalConverted === 0) {
    console.log('No images to convert.')
  } else {
    console.log(`\nDone. ${totalConverted} image(s) converted to WebP.`)
  }
}

main()
