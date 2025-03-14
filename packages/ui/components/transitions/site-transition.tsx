import { type FC, useEffect } from 'react'

interface BackgroundColors {
  [domain: string]: string
}

const defaultBackgroundColors: BackgroundColors = {
  'avalonstar.com': 'bg-avalonstar',
  'bryanvelo.so': 'bg-bryanveloso',
  'omnyist.com': 'bg-omnyist'
}

export const SiteTransition: FC<{
  backgroundColors?: BackgroundColors
  transitionDuration?: number
}> = ({ backgroundColors = defaultBackgroundColors, transitionDuration = 2000 }) => {
  useEffect(() => {
    const referrer = document.referrer

    // Find matching referrer.
    const referrerDomain = Object.keys(backgroundColors).find((domain) => referrer.includes(domain))

    if (referrerDomain) {
      const sourceColor = backgroundColors[referrerDomain]

      document.documentElement.setAttribute('data-from-site', referrerDomain)
      document.documentElement.style.setProperty('--source-color', sourceColor)

      setTimeout(() => {
        document.documentElement.removeAttribute('data-from-site')
      }, transitionDuration)
    }
  }, [backgroundColors, transitionDuration])

  return <div className="site-transition" style={{ display: 'none' }} />
}
