# css-variants

> **Zero-dependency, type-safe CSS variant composition for modern JavaScript**

Build powerful, flexible component style systems with variants. Perfect for Tailwind CSS, vanilla CSS, or any CSS-in-JS solution.

[![test](https://github.com/timphandev/css-variants/actions/workflows/ci.yml/badge.svg)](https://github.com/timphandev/css-variants/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/css-variants.svg)](https://www.npmjs.com/package/css-variants)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/css-variants)](https://bundlephobia.com/package/css-variants)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Give a Star](https://img.shields.io/badge/⭐️%20Give%20a%20Star-support%20the%20project-ffcc00)](https://github.com/timphandev/css-variants)

## Features

- ⚡ **Tiny & Fast** — Zero dependencies, ~1KB minified+gzipped
- 🔒 **Type-Safe** — First-class TypeScript support with complete type inference
- 🧩 **Flexible** — Works with Tailwind, CSS modules, vanilla CSS, or inline styles
- 👨‍💻 **Developer-Friendly** — Intuitive API inspired by CVA and Panda CSS
- 🚀 **Production-Ready** — Battle-tested, fully tested, dual CJS/ESM builds

## Installation

```bash
npm install css-variants
# or
yarn add css-variants
# or
pnpm add css-variants
```

## Quick Example

```typescript
import { cv } from 'css-variants'

const button = cv({
  base: 'font-semibold rounded-lg transition-colors',
  variants: {
    color: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})

button() // => 'font-semibold rounded-lg ... bg-blue-600 text-white ... px-4 py-2 text-base'
button({ color: 'secondary', size: 'lg' }) // => '... bg-gray-200 text-gray-900 ... px-6 py-3 text-lg'
```

## Documentation

**[View full documentation →](https://timphandev.github.io/css-variants/getting-started/introduction/)**

- [Getting Started](https://timphandev.github.io/css-variants/getting-started/introduction/)
- [Core Concepts](https://timphandev.github.io/css-variants/core-concepts/variants/)
- [API Reference](https://timphandev.github.io/css-variants/api/cv/)
- [Tailwind CSS Integration](https://timphandev.github.io/css-variants/guides/tailwind/)

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting PRs.

**Development Setup:**

```bash
git clone https://github.com/timphandev/css-variants.git
cd css-variants
yarn install
yarn test
yarn build
```

## ⭐ Like it? Star it!

If this library saves you time, a **⭐ on GitHub** means a lot. Thank you! 🚀

## License

MIT © [Tim Phan](https://github.com/timphandev)

**Made with ❤️ by developers, for developers**
