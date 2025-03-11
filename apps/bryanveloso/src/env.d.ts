/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare module 'astro:content' {
  interface DefineCollection {
    schema?: any
  }

  const defineCollection: DefineCollection
  const getCollection: GetCollection

  export { defineCollection, getCollection }
}
