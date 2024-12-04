import type { Config } from 'tailwindcss';
import baseConfig from '../config/tailwind/base.config';

const config: Config = {
  ...baseConfig,
  content: ['./components/**/*.{astro,js,ts,jsx,tsx}', './styles/**/*.css'],
};

export default config;
