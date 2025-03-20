/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ],
  astroAllowShorthand: true,
  printWidth: 120,
  singleQuote: true,
  semi: false,
  trailingComma: 'none'
}
