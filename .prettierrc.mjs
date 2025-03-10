/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ],
  linelength: 120,
  singleQuote: true,
  semi: false,
  trailingComma: 'none'
}
