import { defineConfig } from 'vitest/config';

export default defineConfig({
    oxc: {
        jsx: { runtime: 'automatic' },
    },
    test: {
        include: ['tests/**/*.vitest.{js,jsx,ts,tsx}', 'src/**/*.vitest.{js,jsx,ts,tsx}'],
        passWithNoTests: true,
        environment: 'jsdom',
        setupFiles: ['./tests/vitest.setup.ts'],
    },
});
