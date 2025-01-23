import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/validator/index.ts',
  ],
  shims: true,
  target: 'esnext',
  sourcemap: true,
});
