import { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

import { fontFamily, fontWeight } from './font.config'

const config: Config = {
  theme: {
    extend: {
      fontFamily,
      fontWeight
    }
  }
}

export default config
