![Logo](.github/assets/logo.png)

[![test](https://github.com/timphandev/css-variants/actions/workflows/ci.yml/badge.svg)](https://github.com/timphandev/css-variants/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/timphandev/css-variants)](https://github.com/timphandev/css-variants/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/dm/css-variants)](https://npmjs.com/package/css-variants)
![npm](https://img.shields.io/npm/v/css-variants)

# css-variants

A lightweight, flexible API for managing CSS class variants in JavaScript and TypeScript projects.

## Overview

`css-variants` provides a simple yet powerful way to handle dynamic class names and inline styles based on component props or state. It's designed to work seamlessly with modern JavaScript frameworks and CSS methodologies, offering a type-safe approach to styling your UI components.

`css-variants` is heavily inspired by [CVA](https://github.com/joe-bell/cva), [Tailwind Variants](https://github.com/nextui-org/tailwind-variants) and [Panda CSS](https://github.com/chakra-ui/panda).

## Features

- 🎨 Dynamic class name generation based on variants
- 🔧 Support for inline styles alongside class names
- 🧩 Slot-based variant system for complex components
- 📦 Zero dependencies
- 🔒 Fully type-safe with TypeScript
- 🚀 Framework-agnostic

## Table of Contents
* [Installation](#installation)
* [Variants](#variants)
  * [Adding variants](#adding-variants)
  * [Multiple variants](#multiple-variants)
  * [Boolean variants](#boolean-variants)
  * [Compound variants](#compound-variants)
  * [Default variants](#default-variants)
* [Slots](#events)
  * [Basic Usage](#basic-usage)
  * [Slots with variants](#slots-with-variants)
* [Handling Style Conflicts](#handling-style-conflicts)
* [TypeScript](#typeScript)
* [Contribute](#contribute)
* [License](#license)


## Installation

To use `css-variants` in your project, you can install it as a dependency:

```sh
yarn add css-variants
```

## Variants

Variants allows you to create multiple versions of the same component.

### Adding variants

You can add variants by using the `variants` key. There's no limit to how many variants you can add.

```ts
import { cv } from 'css-variants'
 
const button = cv({
  base: 'font-bold rounded-sm',
  variants: {
    color: {
      primary: 'bg-blue-500 hover:bg-blue-700',
      secondary: 'bg-purple-500 hover:bg-purple-700',
      success: {
        className: 'hover:bg-green-700',
        style: { color: 'green' }, // You can also use inline style
      },
    },
  },
})

button({ color: 'secondary' })
/**
 * Result:
 * {
 *    className: 'font-bold rounded-sm bg-purple-500 hover:bg-purple-700',
 *    style: {},
 * }
 */

button({ color: 'success' })
/**
 * Result:
 * {
 *    className: 'font-bold rounded-sm hover:bg-green-700',
 *    style: { color: 'green' },
 * }
 */
```

### Multiple variants

You can add multiple variants to a single component.

```ts
import { cv } from 'css-variants'
 
const button = cv({
  base: {
    className: 'font-bold',
    style: { borderRadius: 16 },
  },
  variants: {
    color: {
      primary: 'bg-blue-500 hover:bg-blue-700',
      secondary: 'bg-purple-500 hover:bg-purple-700',
      success: 'bg-green-500 hover:bg-green-700'
    },
    size: {
      sm: 'text-sm p-2',
      md: 'text-md p-4',
      lg: 'text-lg p-6',
    },
  },
})

button({ color: 'success', size: 'lg' })
/**
 * Result:
 * {
 *    className: 'font-bold bg-green-500 hover:bg-green-700 text-lg p-6',
 *    style: { borderRadius: 16 },
 * }
 */
```

### Boolean variants

You can also add boolean variants to a component. This is useful when you want to add a state variant e.g. `disabled`.

```ts
import { cv } from 'css-variants'
 
const button = cv({
  base: {
    style: { fontWeight: 'bold' },
  },
  variants: {
    color: {
      primary: 'bg-blue-500 hover:bg-blue-700',
      secondary: 'bg-purple-500 hover:bg-purple-700',
      success: 'bg-green-500 hover:bg-green-700'
    },
    disabled: {
      true: 'opacity-50 pointer-events-none',
    },
  },
})

button({ disabled: true })
/**
 * Result:
 * {
 *    className: 'opacity-50 pointer-events-none',
 *    style: { fontWeight: 'bold' },
 * }
 */
```

### Compound variants

Sometimes you might want to add a variant that depends on another variant. This is possible by using the `compoundVariants` key.

```ts
import { cv } from 'css-variants'
 
const button = cv({
  base: {
    style: { fontWeight: 'bold' },
  },
  variants: {
    size: {
      sm: 'text-sm p-2',
      md: 'text-md p-4',
      lg: {
        className: 'text-lg',
        style: { padding: 6 },
      },
    },
    disabled: {
      true: 'opacity-50 pointer-events-none',
    },
  },
  compoundVariants: [
    {
      size: 'lg', // You can also use the values as an array
      disabled: true,
      className: 'uppercase',
      style: { padding: 5 },
    }
  ],
})

button({ size: 'lg', disabled: true })
/**
 * Result:
 * {
 *    className: 'text-lg p-6 opacity-50 pointer-events-none uppercase',
 *    style: { fontWeight: 'bold', padding: 5 },
 * }
 */
```

### Default variants

You can also add a default variant to a component. This is useful when you want to add a predefined variants values to a component.

```ts
import { cv } from 'css-variants'
 
const button = cv({
  base: 'font-bold rounded-sm',
  variants: {
    color: {
      primary: 'bg-blue-500 hover:bg-blue-700',
      secondary: 'bg-purple-500 hover:bg-purple-700',
      success: 'bg-green-500 hover:bg-green-700'
    },
  },
  defaultVariants: {
    color: 'primary',
  },
})

button()
/**
 * Result:
 * {
 *    className: 'font-bold rounded-sm bg-blue-500 hover:bg-blue-700',
 *    style: {},
 * }
 */
```

## Slots

Slots allows you to separate a component into multiple parts.

### Basic Usage

You can add `slots` by using the slots key. There's no limit to how many slots you can add.

```ts
import { csv } from 'css-variants'

const notification = cv({
  slots: ['root', 'title'],
  base: {
    root: 'root',
    title: {
      className: 'title',
      style: { fontSize: 16 },
    },
  },
});

notification()
/**
 * Result:
 * {
 *    root: {
 *      className: 'root',
 *      style: {},
 *    },
 *    title: {
 *      className: 'title',
 *      style: { fontSize: 16 },
 *    },
 * }
 */

```

### Slots with variants

You can also change the entire component and its slots by using the variants.

```ts
import { csv } from 'css-variants'

const notification = cv({
  slots: ['root', 'title', 'content'],
  base: {
    root: 'root',
    title: 'title',
    content: {
      className: 'content',
      style: { fontSize: 16 },
    },
  },
  variants: {
    color: {
      primary: {
        root: 'root-primary',
        title: 'title-primary',
        content: 'content-primary',
      },
      secondary: {
        title: 'title-secondary',
        content: 'content-secondary',
      },
    }
  },
});

notification({ color: 'primary' })
/**
 * Result:
 * {
 *    root: {
 *      className: 'root root-primary',
 *      style: {},
 *    },
 *    title: {
 *      className: 'title title-primary',
 *      style: {},
 *    },
 *    content: {
 *      className: 'content content-primary',
 *      style: { fontSize: 16 },
 *    },
 * }
 */

notification({ color: 'secondary' })
/**
 * Result:
 * {
 *    root: {
 *      className: 'root',
 *      style: {},
 *    },
 *    title: {
 *      className: 'title title-secondary',
 *      style: {},
 *    },
 *    content: {
 *      className: 'content content-secondary',
 *      style: { fontSize: 16 },
 *    },
 * }
 */
```

## Handling Style Conflicts

Although `css-variants` is designed to help you avoid styling conflicts, there's still a small margin of error.

If you're keen to lift that burden altogether, check out the wonderful `tailwind-merge` package.

For bulletproof components, wrap your `cx`, `cv`, `csv` component with `twMerge`.

```ts
import { twMerge } from 'tailwind-merge'
import { cx as baseCx, cv as baseCv } from 'css-variants'

export const cx: typeof baseCx = (...args) => twMerge(baseCx(...args))

export const cv: typeof baseCv = (config) => {
  return baseCv({
    ...config,
    onDone: ({ className, style }) => {
      const css = {
        style,
        className: twMerge(className),
      }

      return config.onDone ? config.onDone(css) : css
    },
  })
}
```

## TypeScript

### Extracting Variant Types

You can use the `VariantProps` utility to extract variants from a component.

```tsx
import { VariantProps } from 'css-variants'
import { cv } from 'class-variance-authority'
 
export const button = cv({
  variants: {
    color: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-purple-500 text-white',
    },
  },
})

export type ButtonProps = VariantProps<typeof button>
```

## Contribute

If you would like to contribute to the project, please read how to contribute here [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

Licensed under the MIT License.

See [MIT license](./LICENSE) for more information.
