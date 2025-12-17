import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

const site = 'https://css-variants.vercel.app'

/** @type {import('@astrojs/starlight/types').StarlightConfig['head']} */
const head = [
  {
    tag: 'meta',
    attrs: { property: 'og:image', content: site + '/og-image.svg' },
  },
  {
    tag: 'meta',
    attrs: { name: 'twitter:image', content: site + '/og-image.svg' },
  },
]

const siteVerifications = [
  { name: 'google-site-verification', env: 'GOOGLE_SITE_VERIFICATION' },
  { name: 'msvalidate.01', env: 'BING_SITE_VERIFICATION' },
  { name: 'yandex-verification', env: 'YANDEX_SITE_VERIFICATION' },
  { name: 'baidu-site-verification', env: 'BAIDU_SITE_VERIFICATION' },
]
for (const { name, env } of siteVerifications) {
  const value = process.env[env]

  if (value) {
    head.push({ tag: 'meta', attrs: { name, content: value } })
  }
}

export default defineConfig({
  site,
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
            { label: 'What is css-variants?', link: 'getting-started/introduction', slug: 'getting-started/introduction' },
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Quick Start', slug: 'getting-started/quick-start' },
            { label: 'llms.txt', slug: 'resources/llms' },
          ],
        },
        {
          label: 'Core Concepts',
          items: [
            { label: 'Defining Variants', slug: 'core-concepts/variants' },
            { label: 'Base Styles', slug: 'core-concepts/base-styles' },
            { label: 'Default Variants', slug: 'core-concepts/default-variants' },
            { label: 'Compound Variants', slug: 'core-concepts/compound-variants' },
            { label: 'Boolean Variants', slug: 'core-concepts/boolean-variants' },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { label: 'cv() — Class Variants', slug: 'api/cv' },
            { label: 'scv() — Slot Variants', slug: 'api/scv' },
            { label: 'sv() — Style Variants', slug: 'api/sv' },
            { label: 'ssv() — Slot Style Variants', slug: 'api/ssv' },
            { label: 'cx() — Class Merger', slug: 'api/cx' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Tailwind CSS', slug: 'guides/tailwind' },
            { label: 'CSS Modules', slug: 'guides/css-modules' },
            { label: 'React, Vue, Svelte', slug: 'guides/frameworks' },
            { label: 'TypeScript', slug: 'guides/typescript' },
          ],
        },
        {
          label: 'Resources',
          items: [
            {
              label: 'When to Use css-variants',
              slug: 'resources/when-to-use',
            },
            {
              label: 'css-variants vs CVA vs tailwind-variants',
              slug: 'resources/comparison',
            },
            {
              label: 'Migrate from CVA',
              slug: 'resources/migration-cva',
            },
            {
              label: 'Migrate from tailwind-variants',
              slug: 'resources/migration-tailwind-variants',
            },
            {
              label: 'Performance',
              slug: 'resources/performance',
            },
            {
              label: 'Benchmarks',
              slug: 'resources/benchmarks',
            },
            {
              label: 'FAQ',
              slug: 'resources/faq',
            },
          ],
        },
      ],
    }),
  ],
})
