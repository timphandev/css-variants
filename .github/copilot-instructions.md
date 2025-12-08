<!-- GitHub Copilot / AI Agent instructions for contributors working on css-variants -->

# Quick Context

This repo implements a tiny, zero-dependency library for composing CSS class names and inline styles via "variants" (`cv`, `sv`, `scv`, `ssv`) and a simple `cx` class-merger. Keep changes minimal and preserve the small, tree-shakeable public API.

**Big picture:** library code lives under `src/`. Builds produce `dist/cjs` and `dist/esm` artifacts (see `package.json` `exports`). Tests are Vitest-based and colocated as `*.test.ts` next to sources.

# Key files to read first

- `src/cv.ts` — class-variants for a single component (base, `variants`, `compoundVariants`, `defaultVariants`, optional `classNameResolver`).
- `src/sv.ts` — same concept for inline styles.
- `src/scv.ts` / `src/ssv.ts` — slot-based versions that operate across multiple named slots.
- `src/cx.ts` — lightweight `clsx`-style implementation used as the default `classNameResolver`.
- `src/utils/merge-props.ts` and `src/utils/types.ts` — shared helper behavior and TypeScript shaping rules.
- `package.json` — scripts: `yarn build` runs `tsc` for CJS and ESM; `yarn test` runs `vitest`; `yarn lint` runs `eslint`.

# Project-specific patterns & conventions (do not invent alternatives without discussion)

- Variant shapes: `variants` is a nested record where top-level keys are variant names and second-level keys are variant values mapping to `class` or `style` values. Example: `variants: { size: { sm: 'text-sm', lg: 'text-lg' } }` (`src/cv.ts`).
- `defaultVariants` are merged with incoming props using `mergeProps` so falsy/`undefined` behavior matters — if a prop is explicitly provided (not `undefined`) it overrides default.
- `compoundVariants` is an array of objects that combine variant selectors with a final `className`/`style`/`classNames`/`styles` value. The code checks array membership or equality when matching (see loop in `cv.ts`, `scv.ts`, `sv.ts`, `ssv.ts`).
- Boolean variants are represented by string keys like `'true' | 'false'` in the variant records; the type helpers (`StringToBoolean`) allow mapping to booleans in TS inference (`src/utils/types.ts`).
- Slot APIs: `scv`/`ssv` accept a `slots` array and `base`/`variants` as maps of slot -> value. Consumers can pass `classNames`/`styles` per-slot to merge on top.
- `classNameResolver`: callers can pass a custom resolver (defaults to `cx`). The resolver accepts mixed nested inputs and returns a single space-delimited string (`src/cx.ts`).

**CompoundVariants Walkthrough**

- Purpose: `compoundVariants` allow adding classes/styles when multiple variant selectors match simultaneously (e.g., `size: 'sm'` + `color: 'red'`).
- Matching algorithm (see `src/cv.ts`, `src/scv.ts`, `src/sv.ts`, `src/ssv.ts`):
	- `mergedProps` is computed by merging `defaultVariants` and incoming props using `mergeProps`.
	- For each `compoundVariant` entry, the code iterates its selector keys (all keys except the final `className`/`style`/`classNames`/`styles`) and checks whether the prop value matches the selector. If a selector value is an array it checks membership.
	- If all selectors match, the provided classes/styles are merged into the result.
- Type-safety pitfalls: older TypeScript versions could widen mapped types to `Record<string, unknown>` causing excess property checks to be skipped (so `classNames: { container: 'x' }` might not error even when `container` isn't a valid slot). This repo uses a `[keyof T] extends [never]` pattern in `src/utils/types.ts` to avoid that widening and restore excess property checks across TS versions.
- Runtime safety: in addition to the types fix, code defensively guards against unexpected slot keys in runtime values (see `src/scv.ts` where pushes into per-slot arrays are guarded). This prevents runtime exceptions even if a bad object slips through.

# Typical code changes and where to implement them

- Adding a new feature for variants: update the relevant `src/*v.ts` file and its `.test.ts` file under `src/`.
- Changing types: update `src/utils/types.ts` and ensure `tsc` builds both CJS and ESM targets (`tsconfig.cjs.json`, `tsconfig.esm.json`).
- Small helpers: add under `src/utils/` and import where needed.

# Tests, build, and debug commands

- Run tests: `yarn test` (uses `vitest run --coverage`). Use `yarn bench` for benchmarks.
- Lint: `yarn lint` (ESLint + Prettier configs are present).
- Build artifacts: `yarn build` (runs `rimraf ./dist && yarn build:cjs && yarn build:esm`). Output goes to `dist/cjs` and `dist/esm`. Check `package.json` `exports` when changing public entry points.

# Public API & backwards-compatibility guidance

- Keep the exported API shapes stable: `cv`, `sv`, `scv`, `ssv`, and `cx` are re-exported from `src/index.ts`.
- Avoid changing function call signatures for the variant creators. Small additive options (optional config fields) are acceptable; breaking changes must be coordinated.

# Examples worth referencing in pull requests

- `src/cv.ts` — shows how `classValues` are collected and how `compoundVariants` are matched.
- `src/scv.ts` — demonstrates per-slot collection + merging of `base`, `variants`, `compoundVariants`, and `classNames` overrides.

# Integration & external dependencies

- Runtime: no external runtime dependencies (zero deps). `csstype` is used for TypeScript CSS property typing.
- CI/publish: built artifacts are expected in `dist/`; `package.json` controls published exports. If you change filenames or exports, update `package.json` accordingly.

# What to avoid

- Do not introduce runtime dependencies that increase bundle size without explicit justification.
- Do not modify build outputs or `exports` semantics without updating `package.json` and verifying `yarn build`.

# Where to ask questions / follow-ups

- Open a draft PR referencing the rationale if you propose API changes. Include targeted unit tests under `src/*.test.ts`.

---

If any of these areas are unclear or you'd like more detail (for example, a short walkthrough of `compoundVariants` matching logic or example tests to mirror), tell me which part and I will expand or refine the instructions. 
