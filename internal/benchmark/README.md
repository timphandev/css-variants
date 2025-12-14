# css-variants Benchmark Suite

Performance benchmarks comparing css-variants against popular CSS variant libraries.

## Quick Start

```bash
# Run all benchmarks
yarn start

# Results are saved to dist/benchmark.json
```

## Folder Structure

```
internal/benchmark/
├── src/
│   ├── shared/                    # Shared configurations
│   │   ├── cv-configs.ts          # css-variants (cv) test configs
│   │   ├── cva-configs.ts         # class-variance-authority configs
│   │   ├── tv-configs.ts          # tailwind-variants configs
│   │   ├── scv-configs.ts         # css-variants slots (scv) configs
│   │   └── tv-slots-configs.ts    # tailwind-variants slots configs
│   │
│   ├── cv-vs-cva/                 # cv vs class-variance-authority
│   │   ├── basic.bench.ts         # Base, single, multiple, boolean variants
│   │   ├── defaults.bench.ts      # Default variants, className override
│   │   ├── compound.bench.ts      # Compound variants (no/single/multi match)
│   │   └── complex.bench.ts       # Real-world button component
│   │
│   ├── cv-vs-tv/                  # cv vs tailwind-variants
│   │   ├── basic.bench.ts
│   │   ├── defaults.bench.ts
│   │   ├── compound.bench.ts
│   │   └── complex.bench.ts
│   │
│   └── scv-vs-tv-slots/           # scv vs tailwind-variants slots
│       ├── basic.bench.ts         # Base slots, single/multiple variants
│       ├── defaults.bench.ts      # Default variants, classNames override
│       ├── compound.bench.ts      # Compound variants with slots
│       └── complex.bench.ts       # Complex card (7 slots), stress test (8 slots)
│
├── dist/
│   └── benchmark.json             # Benchmark results output
│
├── package.json
├── vite.config.mts
└── README.md
```

## Libraries Compared

| Library | Version | Description |
|---------|---------|-------------|
| **css-variants** | workspace | This library |
| **class-variance-authority** | 0.7.1 | Popular CVA pattern library |
| **tailwind-variants** | 3.2.2 | Feature-rich variant library with slots |

## Test Categories

### Basic Variants (`basic.bench.ts`)

| Test Case | Description |
|-----------|-------------|
| Base class only | Simple base class without variants |
| Single variant | One variant dimension (color: 3 options) |
| Multiple variants | Three dimensions (color, size, variant) |
| Boolean variants | Three boolean flags (disabled, loading, fullWidth) |
| No variants with className | Base class + className override |

### Default Variants (`defaults.bench.ts`)

| Test Case | Description |
|-----------|-------------|
| With defaults (no props) | Using default variants without overrides |
| With defaults (override one) | Override one default variant |
| With className override | Add custom classes to variant output |

### Compound Variants (`compound.bench.ts`)

| Test Case | Description |
|-----------|-------------|
| Compound (no match) | Props don't match any compound rule |
| Compound (single match) | Props match exactly one compound rule |
| Compound (multiple matches) | Props match multiple compound rules |

### Complex Real-World (`complex.bench.ts`)

| Test Case | Description |
|-----------|-------------|
| Complex button (defaults) | Full button with 6 variant options, compound rules |
| Complex button (overrides) | Same button with variant overrides + className |

### Slots Variants (`scv-vs-tv-slots/`)

| Test Case | Description |
|-----------|-------------|
| Base slots (2 slots) | Simple root + content slots |
| Single variant (2 slots) | Color variant affecting 2 slots |
| Multiple slots (4 slots) | Card with header, body, footer |
| Multiple variants (4 slots) | Alert with variant + size |
| Compound variants (3 slots) | Button with compound slot styles |
| Complex card (7 slots) | Real-world card component |
| Many slots (8 slots) | Stress test with theme variants |

## API Differences

### css-variants vs class-variance-authority

Both use similar APIs:
- `className` for compound variant classes
- `className` prop for custom classes

### css-variants vs tailwind-variants

| Feature | css-variants | tailwind-variants |
|---------|--------------|-------------------|
| Compound class key | `className` | `class` |
| Custom class prop | `className` | `class` |

### scv vs tailwind-variants slots

| Feature | css-variants (scv) | tailwind-variants |
|---------|-------------------|-------------------|
| Slots definition | `slots: ['root', 'content']` | `slots: { root: '', content: '' }` |
| Compound slot classes | `classNames: { root: '...' }` | `class: { root: '...' }` |
| Custom slot classes | `classNames: { root: '...' }` | Per-slot: `root({ class: '...' })` |
| Return type | `{ root: string, content: string }` | `{ root: fn, content: fn }` |

## Benchmark Methodology

- **Vitest Bench**: Uses Vitest's built-in benchmarking with tinybench
- **Isolated setup**: Variant configs created outside bench blocks (not measured)
- **Multiple iterations**: Each test runs for 500ms minimum with statistical analysis
- **Fair comparison**: Identical configurations for both libraries

## Understanding Results

The benchmark output includes:

- **hz**: Operations per second (higher is better)
- **mean**: Average time per operation in milliseconds
- **p75/p99**: 75th and 99th percentile latencies
- **rme**: Relative margin of error (lower is better)
- **samples**: Number of iterations completed

## Adding New Benchmarks

1. Add shared config to `src/shared/*-configs.ts`
2. Create bench file in appropriate folder
3. Import configs and use `bench()` from vitest:

```typescript
import { bench, describe } from 'vitest'
import { cvConfig } from '../shared/cv-configs'
import { otherConfig } from '../shared/other-configs'

describe('category', () => {
  describe('test case', () => {
    bench('css-variants', () => {
      cvConfig({ variant: 'primary' })
    })

    bench('other-library', () => {
      otherConfig({ variant: 'primary' })
    })
  })
})
```

## Output

Results are saved to `dist/benchmark.json` in Vitest's benchmark output format, which includes detailed statistics for each test case.
