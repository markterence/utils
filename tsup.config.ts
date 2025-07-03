import process from 'node:process';
import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: [
      'src/index.ts',
      'src/core/index.ts',
      'src/core/date-time-dayjs/index.ts',
      'src/validator/index.ts',
    ],
    shims: true,
    format: ['esm', 'cjs'],
    target: 'esnext',
    sourcemap: process.env.NODE_ENV === 'development',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    dts: true,
    external: ['vue'],
    clean: false,
    treeshake: true,
  },
  {
    clean: false,
    treeshake: true,
    entry: ['src/vue/user-module-loader/index.ts'],
    dts: {
      entry: {
        index: 'src/vue/user-module-loader/index.ts',
      },
    },
    external: ['vue'],
    // dts: true,
    format: ['esm'],
    shims: true,
    target: 'esnext',
    sourcemap: process.env.NODE_ENV === 'development',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    outDir: 'dist/vue/user-module-loader',
  },
]);
