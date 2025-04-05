import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/libs/__mocks__/prisma.ts'],
    exclude: ['node_modules', 'dist'],
  },
});
