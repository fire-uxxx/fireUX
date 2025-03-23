import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog'
    })
  }
})
