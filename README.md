![Logo](.github/assets/logo.png)

[![test](https://github.com/timphandev/css-variants/actions/workflows/ci.yml/badge.svg)](https://github.com/timphandev/css-variants/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/timphandev/css-variants)](https://github.com/timphandev/css-variants/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/dm/css-variants)](https://npmjs.com/package/css-variants)
![npm](https://img.shields.io/npm/v/css-variants)

# css-variants

A lightweight, flexible API for managing CSS class variants in JavaScript and TypeScript projects.

## Overview

`css-variants` provides a simple yet powerful way to handle dynamic class names and inline styles based on component props or state. It's designed to work seamlessly with modern JavaScript frameworks and CSS methodologies, offering a type-safe approach to styling your UI components.

`css-variants` is heavily inspired by the following excellent packages:

- [CVA (Class Variance Authority)](https://github.com/joe-bell/cva): A powerful utility for creating dynamic class names with variants.
- [Tailwind Variants](https://github.com/nextui-org/tailwind-variants): A flexible and reusable variant system for Tailwind CSS.
- [Panda CSS](https://github.com/chakra-ui/panda): A CSS-in-JS solution with a focus on developer experience and performance.

Thank you to the authors and contributors of these projects for their innovative work.

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
* [Overriding styles](#overriding-styles)
  * [Overriding styles on a single component](#overriding-styles-on-a-single-component)
  * [Overriding styles on a component with slots](#overriding-styles-on-a-component-with-slots)
* [Custom function to resolve class names](#custom-function-to-resolve-class-names)
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
      success: 'hover:bg-green-700',
    },
  },
})

button({ color: 'secondary' })
// => 'font-bold rounded-sm bg-purple-500 hover:bg-purple-700'
```

```ts
import { sv } from 'css-variants'
 
const button = sv({
  base: {
    fontWeight: 700,
  },
  variants: {
    color: {
      primary: {
        color: 'blue',
      },
      secondary: {
        color: 'red',
      },
      success: {
        color: 'green',
      },
    },
  },
})

button({ color: 'secondary' })
// => { fontWeight: 700, color: 'red' }
```

### Multiple variants

You can add multiple variants to a single component.

```ts
import { cv } from 'css-variants'
 
const button = cv({
  base: 'font-bold',
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
// => 'font-bold bg-green-500 hover:bg-green-700 text-lg p-6'
```

### Boolean variants

You can also add boolean variants to a component. This is useful when you want to add a state variant e.g. `disabled`.

```ts
import { cv } from 'css-variants'
 
const button = cv({
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
// => 'opacity-50 pointer-events-none'
```

### Compound variants

Sometimes you might want to add a variant that depends on another variant. This is possible by using the `compoundVariants` key.

```ts
import { cv } from 'css-variants'
 
const button = cv({
  variants: {
    size: {
      sm: 'text-sm p-2',
      md: 'text-md p-4',
      lg: 'text-lg',
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
    }
  ],
})

button({ size: 'lg', disabled: true })
// => 'text-lg p-6 opacity-50 pointer-events-none uppercase'
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
// => 'font-bold rounded-sm bg-blue-500 hover:bg-blue-700'
```

## Slots

Slots allows you to separate a component into multiple parts.

### Basic Usage

You can add `slots` by using the slots key. There's no limit to how many slots you can add.

```ts
import { scv } from 'css-variants'

const notification = scv({
  slots: ['root', 'title'],
  base: {
    root: 'root',
    title: 'title',
  },
})

notification()
/**
 * Result:
 * {
 *    root: 'root',
 *    title: 'title',
 * }
 */
```

```ts
import { ssv } from 'css-variants'

const notification = ssv({
  slots: ['root', 'title'],
  base: {
    root: {
      fontWeight: 'bold',
    },
    title: {
      fontSize: '20px',
    }
  },
})

notification()
/**
 * Result:
 * {
 *    root: { fontWeight: 'bold' },
 *    title: { fontSize: '20px' },
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
    content: 'content',
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
})

notification({ color: 'primary' })
/**
 * Result:
 * {
 *    root: 'root root-primary',
 *    title: 'title title-primary',
 *    content: 'content content-primary',
 * }
 */

notification({ color: 'secondary' })
/**
 * Result:
 * {
 *    root: 'root',
 *    title: 'title title-secondary',
 *    content: 'content content-secondary',
 * }
 */
```

## Overriding styles

`css-variants` allows you to override or extend the styles of your components. This feature is useful when you need to add custom styles or modify existing ones without changing the original component definition.

### Overriding styles on a single component

You can override or extend styles for a single component by passing additional `className` and `style` properties when calling the component function. These will be merged with the existing styles.

```ts
import { cv } from 'css-variants'
 
const button = cv({
  base: 'font-semibold',
  variants: {
    color: {
      primary: 'bg-blue-500 hover:bg-blue-700',
      secondary: 'bg-purple-500 hover:bg-purple-700',
    }
  }
})
 
button({
  color: 'secondary',
  className: 'border-purple-600',
})
// => 'bg-purple-500 hover:bg-purple-700 border-purple-600'
```

```ts
import { sv } from 'css-variants'
 
const button = cv({
  base: {
    fontWeight: 700,
  },
  variants: {
    color: {
      primary: {
        color: 'blue',
      },
      secondary: {
        color: 'purple',
      },
    }
  }
})
 
button({
  color: 'secondary',
  style: { color: 'red' },
})
// => { fontWeight: 700, color: 'red' }
```

### Overriding styles on a component with slots

For components with slots, you can override styles using the `classNames` and `styles` properties. These allow you to target specific slots and apply custom classes or inline styles.

```ts
import { csv } from 'css-variants'

const notification = cv({
  slots: ['root', 'title'],
  base: {
    root: 'root',
    title: 'title',
  },
})

notification({
  classNames: {
    root: 'root-custom-class',
  },
})
/**
 * Result:
 * {
 *    root: 'root root-custom-class',
 *    title: 'title',
 * }
 */

```

## Custom function to resolve class names

Default is the internal 'cx' function. The resolver function should accept multiple class name arguments and return a single concatenated string.

You can use this to integrate with class name utilities like clsx, classnames, or your own custom class name resolution logic.

```ts
import { clsx } from 'clsx'
import { cv as _cv, scv as _scv } from 'css-variants'

export const cv: typeof _cv = (config) => {
  return _cv({
    ...config,
    classNameResolver: clsx,
  })
}

export const scv: typeof _scv = (config) => {
  return _scv({
    ...config,
    classNameResolver: clsx,
  })
}
```

## TypeScript

### Extracting Variant Types

```tsx
import { cv } from 'css-variants'
 
export const button = cv({
  variants: {
    color: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-purple-500 text-white',
    },
  },
})

export type ButtonProps = Parameters<typeof button>[0]
```

## Contribute

If you would like to contribute to the project, please read how to contribute here [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

Licensed under the MIT License.

See [MIT license](./LICENSE) for more information.
