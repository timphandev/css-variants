[![test](https://github.com/timphandev/css-variants/actions/workflows/ci.yml/badge.svg)](https://github.com/timphandev/css-variants/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/timphandev/css-variants)](https://github.com/timphandev/css-variants/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/dm/css-variants)](https://npmjs.com/package/css-variants)
![npm](https://img.shields.io/npm/v/css-variants)

# css-variants — Compose class names & styles with variants

Lightweight helpers to compose class names and inline styles using "variants". Zero runtime deps, small bundle, and first-class TypeScript support.

<p align="center">
  <img src="/.github/assets/logo.png" alt="css-variants" />
</p>

## Features

🌱 **Zero deps** — No runtime dependencies; tiny bundle and minimal maintenance.

🐪 **Tailwind-friendly** — First-class compatibility with Tailwind via `tw-merge` (see "Tailwind Integration (tw-merge)"), so conflicting utilities are resolved predictably.

🔒 **TypeScript-safe** — Strong inference and mapped-type helpers keep variant props typed correctly.

🧩 **Variants & compound rules** — Simple `variants` maps plus `compoundVariants` for combination rules (e.g., size + color).

🧭 **Slot support** — `scv` / `ssv` manage multiple named slots with per-slot `base`, `variants`, and overrides.

⚙️ **Flexible resolver** — Default `cx`, with an option to pass a custom `classNameResolver` (recommended: `twMerge(cx(...))`).

⚡ **Performance & tree-shaking** — Minimal runtime and tree-shakeable code paths for small bundles.

🧪 **Developer ergonomics** — Colocated `*.test.ts` (Vitest), clear build scripts (`yarn build`) and linting (`yarn lint`).

Use cases: design-system components, Tailwind + component libraries, SSR-friendly UI primitives.

## Installation

Install with your preferred package manager:

```bash
# npm
npm install css-variants

# yarn
yarn add css-variants

# pnpm
pnpm add css-variants
```

TypeScript types are included. Import the package in ESM or CJS projects:

```ts
// ESM
import { cv, scv, cx } from 'css-variants'

// CJS
const { cv, scv, cx } = require('css-variants')
```

## Core Utilities

Quick reference for the main exports. Each utility has full examples below.

- 🧩 [`cv`](#cv---class-variants) — Class Variants (single element)
  - Use to compose class names for one element. Supports `base`, `variants`, `compoundVariants`, and `defaultVariants`.
  - Quick: `const btn = cv({ base: 'btn', variants: { size: { sm: 'p-2', lg: 'p-4' } } })`

- 🎨 [`sv`](#sv---style-variants) — Style Variants (single element)
  - Compose inline style objects similarly to `cv` but returning CSS props.
  - Quick: `const s = sv({ base: { display: 'flex' }, variants: { size: { sm: { gap: '4px' } } } })`

- 🧰 [`scv`](#scv-slot-class-variants) — Slot Class Variants (multi-slot)
  - Manage class names across named slots (`slots: ['root','title']`) with per-slot `base`, `variants`, and `classNames` overrides.
  - Quick: `const card = scv({ slots: ['root','title'], base: { root: 'card' } })`

- 🧾 [`ssv`](#ssv---slot-style-variants) — Slot Style Variants (multi-slot styles)
  - Same as `scv` but composes inline style objects per slot.

- ⚙️ [`cx`](#cx---class-merger) — Class merger
  - Small, typed `clsx`-like utility used as the default `classNameResolver`.
  - Quick: `cx('a', { b: true }, ['c']) // => 'a b c'`

### [cv](./src/cv.ts) - Class Variants
Compose class names for a single element. Config keys: `base`, `variants`, `defaultVariants`, `compoundVariants`, and optional `classNameResolver` (defaults to `cx`).
`cv` returns a typed function you call with variant props (and optional `className`) to get the final class string.

```ts
import { cv } from 'css-variants'

const button = cv({
  base: 'font-bold rounded-lg',
  variants: {
    color: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-500 text-white' 
    },
    size: {
      sm: 'text-sm px-2 py-1',
      lg: 'text-lg px-4 py-2'
    }
  },
  compoundVariants: [
    {
      color: 'primary',
      size: 'lg',  
      className: 'uppercase'
    }
  ],
  defaultVariants: {
    color: 'primary',
    size: 'sm'
  }
})

// Usage
button() // => 'font-bold rounded-lg bg-blue-500 text-white text-sm px-2 py-1'

button({ size: 'lg' }) // => 'font-bold rounded-lg bg-blue-500 text-white text-lg px-4 py-2 uppercase'

button({ size: 'lg', className: 'custom' }) // => 'font-bold rounded-lg bg-blue-500 text-white text-lg px-4 py-2 uppercase custom'
```

### [sv](./src/sv.ts) - Style Variants

Compose inline style objects for a single element. Config keys: `base`, `variants`, `defaultVariants`, and `compoundVariants`.
`sv` returns a typed function that accepts variant props and an optional `style` object which is shallow-merged into the result.

```ts
import { sv } from 'css-variants'

const button = sv({
  base: {
    fontWeight: 'bold',
    borderRadius: '8px'
  },
  variants: {
    color: {
      primary: {
        backgroundColor: 'blue',
        color: 'white'
      },
      secondary: {
        backgroundColor: 'gray',
        color: 'white'
      }
    }
  }
})

// Usage
button({ color: 'primary' })
// => { fontWeight: 'bold', borderRadius: '8px', backgroundColor: 'blue', color: 'white' }

button({
  color: 'secondary',
  style: { padding: '4px' },
})
// => { fontWeight: 'bold', borderRadius: '8px', backgroundColor: 'gray', color: 'white', padding: '4px' }
```

### [scv](./src/scv.ts) - Slot Class Variants

Compose and merge class names across named slots.
`scv` accepts `slots` plus per-slot `base`, `variants`, `compoundVariants`,
and runtime `classNames` overrides, and returns an object mapping each slot to
its final merged class string. Ideal for components with multiple sub-elements
(for example: `root`, `title`, `content`).

```ts
import { scv } from 'css-variants'

const card = scv({
  slots: ['root', 'title', 'content'],
  base: {
    root: 'rounded-lg shadow',
    title: 'text-xl font-bold',
    content: 'mt-2'
  },
  variants: {
    size: {
      sm: {
        root: 'p-4',
        title: 'text-base'
      },
      lg: {
        root: 'p-6', 
        title: 'text-2xl'
      }
    }
  }
})

// Usage
card({ size: 'sm' })
// => {
//   root: 'rounded-lg shadow p-4',
//   title: 'text-xl font-bold text-base',
//   content: 'mt-2'
// }

card({
  size: 'lg',
  classNames: {
    content: 'custom',
  },
})
// => {
//   root: 'rounded-lg shadow p-6',
//   title: 'text-xl font-bold text-2xl',
//   content: 'mt-2 custom'
// }
```

### [ssv](./src/ssv.ts) - Slot Style Variants

Compose and merge inline style objects across named slots.
`ssv` accepts `slots` plus per-slot `base`, `variants`, `compoundVariants`,
and runtime `styles` overrides, and returns an object mapping each slot to
its final merged style. Useful for components with multiple styled
sub-elements (for example: `root`, `title`, `content`).

```ts
import { ssv } from 'css-variants'

const card = ssv({
  slots: ['root', 'title'],
  base: {
    root: { padding: '1rem' },
    title: { fontWeight: 'bold' }
  },
  variants: {
    size: {
      sm: {
        root: { maxWidth: '300px' },
        title: { fontSize: '14px' }
      },
      lg: {
        root: { maxWidth: '600px' },
        title: { fontSize: '18px' }
      }
    }
  }
})

// Usage
card({ size: 'sm' })
// => {
//   root: { padding: '1rem', maxWidth: '300px' },
//   title: { fontWeight: 'bold', fontSize: '14px' }
// }

card({
  size: 'lg',
  styles: {
    title: {
      color: 'red',
    },
  },
})
// => {
//   root: { padding: '1rem', maxWidth: '600px' },
//   title: { fontWeight: 'bold', fontSize: '18px', color: 'red' }
// }
```

### [cx](./src/cx.ts) - Class Merger

Similar to `clsx/classnames` but with better TypeScript support.

```tsx
import { cx } from 'css-variants'

// Basic usage
cx('foo', 'bar') // => 'foo bar'

// With conditions
cx('foo', { 
  'bar': true,
  'baz': false 
}) // => 'foo bar'

// With arrays
cx('foo', ['bar', 'baz']) // => 'foo bar baz'

// With nested structures
cx('foo', {
  bar: true,
  baz: [
    'qux',
    { quux: true }
  ]
}) // => 'foo bar qux quux'

// With falsy values (they're ignored)
cx('foo', null, undefined, false, 0, '') // => 'foo'
```

## Tailwind Integration (tw-merge)

Use a resolver that combines `cx` with `tw-merge` to properly merge Tailwind classes
and let `tw-merge` remove conflicting utility classes (recommended for Tailwind users).

```ts
import { cv, cx } from 'css-variants'
import { twMerge } from 'tailwind-merge'

const button = cv({
  base: 'btn',
  variants: {
    color: {
      primary: 'bg-blue-500',
      danger: 'bg-red-500'
    }
  },
  // recommended resolver: compose `cx` then `twMerge`
  classNameResolver: (...args) => twMerge(cx(...args))
})

// Later classes and conflicting utilities are resolved by `tw-merge`:
button({ color: 'primary', className: 'bg-red-600' })
// => 'btn bg-red-600'  (tw-merge will prefer the later `bg-red-600` value)
```

## TypeScript Support

Full TypeScript support with automatic type inference:

```ts
import { cv } from 'css-variants'

const button = cv({
  variants: {
    size: {
      sm: 'text-sm',
      lg: 'text-lg'
    }
  }
})

type ButtonProps = Parameters<typeof button>[0]
// => { size?: 'sm' | 'lg' | undefined }
```

## Inspiration

This library is inspired by several excellent projects:

- [CVA (Class Variance Authority)](https://github.com/joe-bell/cva)
- [Panda CSS](https://github.com/chakra-ui/panda)

## Developer commands

```bash
yarn test   # run vitest tests
yarn build  # build CJS + ESM artifacts into dist/
yarn lint   # eslint + prettier
```

## Contribute

Please open PRs with focused changes and unit tests under `src/*.test.ts`. Keep runtime footprint minimal and preserve the exported API (`cv`, `sv`, `scv`, `ssv`, `cx`). See [CONTRIBUTING.md](./CONTRIBUTING.md) for process details.

## License

Licensed under the MIT License.

See [MIT license](./LICENSE) for more information.
