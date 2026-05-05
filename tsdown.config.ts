import { defineConfig } from 'tsdown';

const entry = ['src/**/*.{js,jsx}'];

const shared = {
    entry,
    target: 'es2018',
    platform: 'browser' as const,
    unbundle: true,
    clean: true,
    dts: false,
    sourcemap: false,
    report: false,
    outExtensions: () => ({ js: '.js' }),
    deps: {
        neverBundle: [
            /^classnames(\/|$)/,
            /^moment(\/|$)/,
            /^prop-types(\/|$)/,
            /^rc-trigger(\/|$)/,
            /^rc-util(\/|$)/,
            /^react-lifecycles-compat(\/|$)/,
            /^react(\/|$)/,
            /^react-dom(\/|$)/,
        ],
    },
};

export default defineConfig([
    {
        ...shared,
        outDir: 'lib',
        format: 'cjs',
    },
    {
        ...shared,
        outDir: 'es',
        format: 'esm',
    },
]);
