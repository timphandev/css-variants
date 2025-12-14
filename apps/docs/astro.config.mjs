import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

const SITE = 'https://css-variants.vercel.app'

/** @type {import('@astrojs/starlight/types').StarlightConfig['head']} */
const head = [
  {
    tag: 'meta',
    attrs: { property: 'og:image', content: SITE + '/og-image.svg' },
  },
  {
    tag: 'meta',
    attrs: { name: 'twitter:image', content: SITE + '/og-image.svg' },
  },
]

if (process.env.GOOGLE_SITE_VERIFICATION) {
  head.push({
    tag: 'meta',
    attrs: {
      name: 'google-site-verification',
      content: process.env.GOOGLE_SITE_VERIFICATION,
    },
  })
}

export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      title: 'css-variants',
      description: 'Zero-dependency, type-safe CSS variant composition for modern JavaScript',
      favicon: '/favicon.svg',
      logo: {
        alt: 'css-variants logo',
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
      },
      social: [
        {
          icon: 'github',
          label: 'Github',
          href: 'https://github.com/timphandev/css-variants',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/timphandev/css-variants/edit/main/apps/docs/',
      },
      customCss: ['./src/styles/custom.css'],
      head,
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: 'getting-started/introduction', slug: 'getting-started/introduction' },
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Quick Start', slug: 'getting-started/quick-start' },
            { label: 'llms.txt', slug: 'resources/llms' },
          ],
        },
        {
          label: 'Core Concepts',
          items: [
            { label: 'Variants', slug: 'core-concepts/variants' },
            { label: 'Base Styles', slug: 'core-concepts/base-styles' },
            { label: 'Default Variants', slug: 'core-concepts/default-variants' },
            { label: 'Compound Variants', slug: 'core-concepts/compound-variants' },
            { label: 'Boolean Variants', slug: 'core-concepts/boolean-variants' },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { label: 'cv - Class Variants', slug: 'api/cv' },
            { label: 'scv - Slot Class Variants', slug: 'api/scv' },
            { label: 'sv - Style Variants', slug: 'api/sv' },
            { label: 'ssv - Slot Style Variants', slug: 'api/ssv' },
            { label: 'cx - Class Name Merger', slug: 'api/cx' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Tailwind CSS Integration', slug: 'guides/tailwind' },
            { label: 'CSS Modules', slug: 'guides/css-modules' },
            { label: 'Framework Integration', slug: 'guides/frameworks' },
            { label: 'TypeScript', slug: 'guides/typescript' },
          ],
        },
        {
          label: 'Resources',
          items: [
            { label: 'Migration from CVA', slug: 'resources/migration' },
            { label: 'Performance', slug: 'resources/performance' },
            { label: 'FAQ', slug: 'resources/faq' },
          ],
        },
      ],
    }),
  ],
})
