import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  site: 'https://timphandev.github.io',
  base: '/css-variants',
  integrations: [
    starlight({
      title: 'css-variants',
      description: 'Zero-dependency, type-safe CSS variant composition for modern JavaScript',
      social: [
        {
          icon: 'github',
          label: 'Github',
          href: 'https://github.com/timphandev/css-variants',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/timphandev/css-variants/edit/main/docs/',
      },
      customCss: ['./src/styles/custom.css'],
      head: [],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: 'getting-started/introduction', slug: 'getting-started/introduction' },
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Quick Start', slug: 'getting-started/quick-start' },
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
