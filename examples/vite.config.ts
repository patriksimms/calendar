import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const examplesDir = path.dirname(__filename);
const repoRoot = path.resolve(examplesDir, '..');

const stripLegacyMutationObserverRequire = (): Plugin => ({
    name: 'strip-legacy-mutationobserver-require',
    transform(code, id) {
        if (!/rc-menu[/\\](es|lib)[/\\]DOMWrap\.js$/.test(id)) return null;

        const nextCode = code.replace(
            /\nif \(canUseDOM\) \{\n\s*(?:\/\/[^\n]*\n)?\s*require\(['"]mutationobserver-shim['"]\);\n\}/,
            '',
        );

        return {
            code: nextCode,
            map: null,
        };
    },
});

export default defineConfig({
    base: process.env.VITE_BASE || '/',
    plugins: [stripLegacyMutationObserverRequire(), react()],
    root: examplesDir,
    resolve: {
        alias: {
            '@patriksimms/calendar/assets': path.resolve(repoRoot, 'assets'),
            '@patriksimms/calendar/src': path.resolve(repoRoot, 'src'),
            '@patriksimms/calendar': path.resolve(repoRoot, 'src'),
        },
    },
    server: {
        port: 8002,
        host: '0.0.0.0',
    },
});
