import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/cx.ts', 'src/cv.ts', 'src/scv.ts', 'src/sv.ts', 'src/ssv.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  minify: true,
})
