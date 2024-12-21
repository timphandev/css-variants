import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 10000,
    coverage: {
      reporter: ['json', 'text'],
      include: ['src/**/*.ts'],
      exclude: ['**/*.bench.ts', '**/*.test.ts'],
    },
    benchmark: {
      include: ['src/*.bench.ts'],
    },
  },
})
