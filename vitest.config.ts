import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/**/*.vitest.{js,jsx,ts,tsx}', 'src/**/*.vitest.{js,jsx,ts,tsx}'],
        passWithNoTests: true,
    },
});
