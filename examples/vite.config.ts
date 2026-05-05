import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const examplesDir = path.dirname(__filename);
const repoRoot = path.resolve(examplesDir, '..');

export default defineConfig({
    plugins: [react()],
    root: examplesDir,
    resolve: {
        alias: {
            'rc-calendar/assets': path.resolve(repoRoot, 'assets'),
            'rc-calendar/src': path.resolve(repoRoot, 'src'),
            'rc-calendar': path.resolve(repoRoot, 'src'),
        },
    },
    server: {
        port: 8002,
        host: '0.0.0.0',
    },
});
