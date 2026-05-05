import { defineConfig } from 'oxlint';

export default defineConfig({
    options: {
        // Can be enabled when oxlint-tsgolint is stable.
        typeAware: false,
    },
    plugins: ['eslint', 'typescript', 'vitest', 'promise', 'import', 'node'],
    categories: {
        correctness: 'warn',
    },
    rules: {
        'eslint/no-unused-vars': 'error',
    },
});
